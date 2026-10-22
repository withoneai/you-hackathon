"""Haunted command station: a generative UI pipeline for The Haunted Dashboard track.

Every refresh:
  1. pull new Spooky Incident Logs (the local generator, or LOGS_URL) and live
     web reports with You.com Search through One
  2. a CrewAI crew on Parasail structures them, designs the station, and builds
     a JSON UI spec (Structurer -> Designer -> Builder)
  3. the server streams the spec to the browser over WebSockets, panel by panel
  4. through One: the top alerts go to Slack, and the worst one becomes a Linear issue

Usage:
  python main.py              live: Parasail + You.com + Slack + Linear
  python main.py --dry-run    Parasail + You.com, but Slack and Linear are printed, not sent
  python main.py --offline    no keys at all: local logs and a spec built without a model
  python main.py --once       build one spec, then keep serving it (no refresh loop)
  python main.py --check      preflight only

Then open http://127.0.0.1:8765
"""
from __future__ import annotations

import argparse
import asyncio
import os
import sys
import time
from pathlib import Path

from incident_logs import LogStream, fetch_remote, logs_url
from one_cli import OneError, load_env, preflight, redact, say
from parasail import ParasailError, check_model
from server import Station
import spec as specs


class Pipeline:
    def __init__(self, args, station: Station):
        self.args = args
        self.station = station
        self.stream = LogStream(args.seed)
        self.window: list[dict] = []   # the rolling window of incident lines the crew sees
        self.keys: dict = {}
        self.alerts = None
        self.page_url = f"http://{args.host}:{args.port}"
        self.query = os.environ.get("INCIDENT_QUERY") or "paranormal activity reports this week"

    # --- setup --------------------------------------------------------------------

    def preflight(self) -> None:
        from one_actions import Alerts

        a = self.args
        if a.offline:
            self.alerts = Alerts(dry_run=True)
            say("Offline: local logs, no model, no One. Slack and Linear writes are printed.")
            return
        say(f"Parasail model: {check_model()}")
        has_one = bool(os.environ.get("ONE_SECRET", "").strip())
        if not a.dry_run and not has_one:
            raise OneError("ONE_SECRET is empty in .env. A live run uses You.com, Slack and Linear through One")
        if has_one:
            self.keys = preflight("haunted-command-station", ["you"] + ([] if a.dry_run else ["slack", "linear"]), need_memory=False)
        else:
            say("ONE_SECRET is empty: no You.com search this run. Fill it in to pull live web reports.")
        if a.dry_run:
            self.alerts = Alerts(dry_run=True, channel=os.environ.get("SLACK_CHANNEL", ""))
        else:
            channel, team = os.environ.get("SLACK_CHANNEL", "").strip(), os.environ.get("LINEAR_TEAM_KEY", "").strip()
            if not channel or not team:
                raise OneError("SLACK_CHANNEL and LINEAR_TEAM_KEY must be set in .env (or use --dry-run)")
            self.alerts = Alerts(False, self.keys["slack"], channel, self.keys["linear"], team)

    # --- one refresh ----------------------------------------------------------------

    def status(self, stage: str, detail: str) -> None:
        say(f"  {stage}: {detail}")
        self.station.publish({"type": "status", "stage": stage, "detail": detail})

    def gather(self) -> tuple[list[dict], list[dict]]:
        url = logs_url()
        if url:
            fresh = fetch_remote(url)
            seen = {x["line"] for x in self.window}
            fresh = [x for x in fresh if x["line"] not in seen]
        else:
            fresh = self.stream.next_batch()
        for ev in fresh:
            self.station.publish({"type": "log", "id": ev.get("id", ""), "line": ev["line"]})
            time.sleep(0.05)
        self.window = (self.window + fresh)[-60:]
        self.status("Logs", f"{len(fresh)} new line(s) from {url or 'the local generator'}, {len(self.window)} in the window")

        web: list[dict] = []
        if self.keys.get("you"):
            from one_actions import web_incidents
            try:
                web = web_incidents(self.keys["you"], self.query)
                self.status("You.com", f"{len(web)} web result(s) for '{self.query}'")
            except OneError as exc:
                self.status("You.com", f"search failed, continuing without it: {exc}")
        return self.window, web

    def refresh(self) -> None:
        self.status("Pipeline", "refresh started")
        lines, web = self.gather()
        known = [x for x in lines if x.get("zone")]  # the generator's own structured copy; remote logs have none
        if self.args.offline:
            spec, notes, built_by = specs.fallback(known, web), [], "offline fallback (no model)"
        else:
            from crew import run_crew
            self.status("Structurer", "structuring the logs on Parasail")
            try:
                out = run_crew(lines, web, known, on_stage=self.status, verbose=self.args.verbose)
                spec, notes, built_by = out["spec"], out["notes"], out["built_by"]
            except Exception as exc:  # noqa: BLE001 - a failed refresh keeps the page alive with the fallback
                self.status("Crew", f"failed, showing the fallback: {redact(exc)[:200]}")
                spec, notes, built_by = specs.fallback(known, web), [f"crew failed: {redact(exc)[:160]}"], "fallback after a crew error"
        for note in notes:
            say(f"  note: {note}")
        self.station.publish_spec(spec, built_by, notes)
        self.status("Station", f"streamed {len(spec['panels'])} panel(s), threat {spec['threat_level']}, built by {built_by}")

        top = specs.top_alerts(spec)
        res = self.alerts.send(top, spec["threat_level"], self.page_url)
        self.status("One", f"Slack {res['slack']}, Linear {res['linear']}")

    async def loop(self) -> None:
        say(f"Station on {self.page_url}  (WebSocket {self.page_url.replace('http', 'ws')}/ws)")
        while True:
            try:
                await asyncio.to_thread(self.refresh)
            except (OneError, ParasailError) as exc:
                say(f"  refresh failed: {exc}")
                self.station.publish({"type": "error", "detail": redact(exc)[:300]})
            if self.args.once:
                say("Built once (--once). Still serving; Ctrl-C to stop.")
                await asyncio.Event().wait()
            await asyncio.sleep(self.args.interval)


def main() -> int:
    os.chdir(Path(__file__).resolve().parent)
    load_env()
    os.environ.setdefault("CREWAI_DISABLE_TELEMETRY", "true")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="print Slack and Linear writes instead of sending them")
    ap.add_argument("--offline", action="store_true", help="no keys: local logs and a spec built without a model")
    ap.add_argument("--once", action="store_true", help="build one spec, then keep serving it")
    ap.add_argument("--check", action="store_true", help="preflight only")
    ap.add_argument("--host", default=os.environ.get("HOST") or "127.0.0.1")
    ap.add_argument("--port", type=int, default=int(os.environ.get("PORT") or 8765))
    ap.add_argument("--interval", type=int, default=int(os.environ.get("REFRESH_SECONDS") or 120),
                    help="seconds between refreshes")
    ap.add_argument("--seed", type=int, default=None, help="seed the local log generator (repeatable demos)")
    ap.add_argument("--verbose", action="store_true", help="show every agent step")
    args = ap.parse_args()

    station = Station("offline" if args.offline else "dry-run" if args.dry_run else "live")
    pipeline = Pipeline(args, station)
    pipeline.preflight()
    if args.check:
        say("preflight ok")
        return 0
    asyncio.run(station.serve(args.host, args.port, pipeline.loop))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OneError, ParasailError) as exc:
        print(f"error: {redact(exc)}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nstopped", file=sys.stderr)
        sys.exit(130)
