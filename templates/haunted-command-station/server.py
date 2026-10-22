"""A small HTTP + WebSocket server for the station, on one port.

    GET /           the page (static/index.html)
    GET /spec.json  the latest UI spec, for curl and debugging
    WS  /ws         the live stream

Messages on /ws, all JSON with a `type`:

    hello       {station, mode}
    log         {line, id}                      a raw incident line as it arrives
    status      {stage, detail}                 what the pipeline is doing
    spec_begin  {title, subtitle, threat_level, panels: <count>}
    panel       {index, panel}                  one panel at a time, so the UI builds itself
    spec_end    {built_by, notes, at}
    spec        {spec, built_by, at}            the whole latest spec, sent to a client that just connected
    error       {detail}

The pipeline runs in a worker thread and calls `publish`, which hands each
message to the event loop safely.
"""
from __future__ import annotations

import asyncio
import datetime as dt
import json
import time
from pathlib import Path

from websockets.asyncio.server import broadcast, serve
from websockets.datastructures import Headers
from websockets.http11 import Response

STATIC = Path(__file__).resolve().parent / "static"
PANEL_DELAY = 0.25  # seconds between panels while a new spec streams in


def _response(status: int, body: bytes, content_type: str) -> Response:
    reason = {200: "OK", 404: "Not Found"}.get(status, "OK")
    headers = Headers([("Content-Type", content_type), ("Content-Length", str(len(body))), ("Cache-Control", "no-store")])
    return Response(status, reason, headers, body)


class Station:
    def __init__(self, mode: str):
        self.mode = mode
        self.clients: set = set()
        self.latest: dict | None = None
        self.logs: list[dict] = []
        self.loop: asyncio.AbstractEventLoop | None = None

    # --- HTTP -------------------------------------------------------------------

    def process_request(self, connection, request):
        path = request.path.split("?")[0]
        if path == "/ws":
            return None  # continue with the WebSocket handshake
        if path in ("/", "/index.html"):
            return _response(200, (STATIC / "index.html").read_bytes(), "text/html; charset=utf-8")
        if path == "/spec.json":
            return _response(200, json.dumps(self.latest or {}).encode(), "application/json")
        if path == "/healthz":
            return _response(200, b"ok", "text/plain")
        return _response(404, b"not found", "text/plain")

    # --- WebSocket ----------------------------------------------------------------

    async def handler(self, ws) -> None:
        self.clients.add(ws)
        try:
            await ws.send(json.dumps({"type": "hello", "station": "haunted-command-station", "mode": self.mode}))
            for item in self.logs[-40:]:
                await ws.send(json.dumps({"type": "log", **item}))
            if self.latest:
                await ws.send(json.dumps({"type": "spec", **self.latest}))
            async for _ in ws:  # the page does not send anything we act on; keep the socket open
                pass
        finally:
            self.clients.discard(ws)

    def _emit(self, msg: dict) -> None:
        broadcast(self.clients, json.dumps(msg))

    # --- called from the pipeline thread --------------------------------------------

    def publish(self, msg: dict) -> None:
        if msg.get("type") == "log":
            self.logs = (self.logs + [{k: v for k, v in msg.items() if k != "type"}])[-200:]
        if self.loop:
            self.loop.call_soon_threadsafe(self._emit, msg)

    def publish_spec(self, spec: dict, built_by: str, notes: list[str]) -> None:
        at = dt.datetime.now().strftime("%H:%M:%S")
        self.latest = {"spec": spec, "built_by": built_by, "notes": notes, "at": at}
        self.publish({"type": "spec_begin", "title": spec["title"], "subtitle": spec.get("subtitle", ""),
                      "threat_level": spec["threat_level"], "panels": len(spec["panels"])})
        for i, panel in enumerate(spec["panels"]):
            time.sleep(PANEL_DELAY)
            self.publish({"type": "panel", "index": i, "panel": panel})
        self.publish({"type": "spec_end", "built_by": built_by, "notes": notes, "at": at})

    # --- run ---------------------------------------------------------------------

    async def serve(self, host: str, port: int, pipeline) -> None:
        """Serve forever; `pipeline` is an async function started once the port is open."""
        self.loop = asyncio.get_running_loop()
        async with serve(self.handler, host, port, process_request=self.process_request):
            await pipeline()
