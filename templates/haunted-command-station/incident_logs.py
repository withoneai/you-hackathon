"""Spooky Incident Logs: a local generator, so the station works with no feed at all.

Each batch is a handful of messy, unstructured log lines (radio chatter,
sensor dumps, citizen reports, typos and all), the kind of input the
Structurer agent has to make sense of. Every line comes from a hidden
structured event, kept alongside it, so offline mode can skip the model.

The activity drifts: one sector escalates over time, others flare and fade.

    python incident_logs.py             print a few batches
    python incident_logs.py --stream    keep printing a batch every few seconds

Set LOGS_URL to read from a real feed instead (see `fetch_remote`).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import random
import time
import urllib.request

SECTORS = ["Cemetery Row", "Old Mill", "Hospital Wing B", "Victorian Row", "Pier 13",
           "Clocktower", "Catacombs", "Bayview Asylum", "Fog Tunnel"]
KINDS = ["zombie", "phantom", "poltergeist", "apparition", "unknown"]

TEMPLATES = {
    "zombie": [
        "[{t}] {S} // zombie count rising, est {n} shamblers near the {side} gate. units requested",
        "{t} radio: uh, {s}, we got biters. like {n} of em?? need backup",
        "ALERT {S}: undead outbreak, {n} confirmed, {c} civilians cornered",
    ],
    "phantom": [
        "[{t}] {S} PKE meter {pke} / phantom activity lvl {lvl}",
        "{t} sensor dump {s}: pke={pke} emf_spike=true temp_drop={drop}C",
        "{t} ops: phantom actvity in {s} climbing, now {lvl}/10",
    ],
    "poltergeist": [
        "{t} 911 relay ({s}): furniture thrown, {c} people hurt, caller hysterical",
        "[{t}] {S} poltergeist event, windows blown out, activity {lvl}/10",
    ],
    "apparition": [
        "{t} citizen report ({s}): 'a woman in white walked through the wall' lvl {lvl}",
        "[{t}] cam 4 {S}: translucent figure on feed, {n} frames, then gone",
    ],
    "unknown": [
        "{t} citizen report ({s}): something laughing in the attic. maybe raccoons",
        "[{t}] {S} power flicker x{n}, cause unknown, crews en route",
    ],
}


class LogStream:
    """An endless, seeded stream of incident batches."""

    def __init__(self, seed: int | None = None):
        self.rng = random.Random(seed)
        self.hot = self.rng.choice(SECTORS)  # the sector that keeps escalating
        self.batch_no = 0
        self.clock = dt.datetime.now().replace(microsecond=0)
        self.counter = 0

    def _event(self) -> dict:
        rng = self.rng
        escalation = min(10, 3 + self.batch_no)
        if rng.random() < 0.45:
            sector, kind = self.hot, rng.choice(["zombie", "phantom", "zombie"])
            level = min(10, max(1, escalation + rng.randint(-1, 2)))
        else:
            sector, kind = rng.choice(SECTORS), rng.choice(KINDS)
            level = rng.randint(1, 6) if kind != "unknown" else rng.randint(1, 2)
        self.counter += 1
        self.clock += dt.timedelta(seconds=rng.randint(10, 90))
        casualties = rng.randint(0, level // 2) if kind in ("zombie", "poltergeist") else 0
        return {"id": f"inc-{self.counter:04d}", "time": self.clock.strftime("%H:%M:%S"), "minute": self.clock.strftime("%H:%M"),
                "zone": sector, "kind": kind, "level": level, "casualties": casualties, "source": "logs"}

    def _line(self, ev: dict) -> str:
        rng = self.rng
        text = rng.choice(TEMPLATES[ev["kind"]]).format(
            t=ev["time"], S=ev["zone"].upper(), s=ev["zone"].lower() if rng.random() < 0.5 else ev["zone"],
            n=max(1, ev["level"] * rng.randint(1, 3)), c=ev["casualties"], lvl=ev["level"],
            pke=round(ev["level"] * 0.9 + rng.random(), 1), drop=ev["level"] + rng.randint(0, 3),
            side=rng.choice(["east", "north", "south", "west"]))
        if rng.random() < 0.15:
            text = text.upper()
        return text

    def next_batch(self, size: int | None = None) -> list[dict]:
        """A batch of events; each carries its raw `line` (what the Structurer reads)."""
        self.batch_no += 1
        size = size or self.rng.randint(6, 10)
        out = []
        for _ in range(size):
            ev = self._event()
            ev["line"] = self._line(ev)
            out.append(ev)
        return out


def fetch_remote(url: str, timeout: int = 15) -> list[dict]:
    """Read logs from a real feed. Accepts a JSON array of strings or objects with a `line`, or plain text lines."""
    with urllib.request.urlopen(url, timeout=timeout) as res:
        body = res.read().decode("utf-8", "replace")
    try:
        data = json.loads(body)
        items = data if isinstance(data, list) else data.get("logs", [])
    except json.JSONDecodeError:
        items = [ln for ln in body.splitlines() if ln.strip()]
    out = []
    for i, item in enumerate(items[-200:]):
        line = item if isinstance(item, str) else str(item.get("line") or item.get("text") or json.dumps(item))
        out.append({"id": f"remote-{i:04d}", "line": line[:400], "source": "logs"})
    return out


def logs_url() -> str:
    return (os.environ.get("LOGS_URL") or "").strip()


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--seed", type=int, default=13)
    ap.add_argument("--stream", action="store_true")
    ap.add_argument("--batches", type=int, default=3)
    args = ap.parse_args()
    stream = LogStream(args.seed)
    n = 0
    while args.stream or n < args.batches:
        for ev in stream.next_batch():
            print(ev["line"], flush=True)
        n += 1
        if args.stream:
            time.sleep(4)


if __name__ == "__main__":
    main()
