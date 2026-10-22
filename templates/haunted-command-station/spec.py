"""The UI spec: what the Builder asks the model for, and what the page renders.

A spec is a JSON object:

    {
      "title": "Spooky Tactical Command Station",
      "subtitle": "...",
      "threat_level": "low" | "elevated" | "high" | "critical",
      "panels": [
        {"type": "stats",          "title": "...", "items": [{"label", "value", "note"}]},
        {"type": "threat_map",     "title": "...", "cells": [{"zone", "level": 0-4, "label"}]},
        {"type": "activity_chart", "title": "...", "x": ["21:04", ...],
                                   "series": [{"name": "zombie", "values": [0, 2, ...]}]},
        {"type": "alerts",         "title": "...", "items": [{"severity", "zone", "headline", "detail"}]},
        {"type": "feed",           "title": "...", "items": [{"text", "url"}]}
      ]
    }

`validate()` never trusts the model: it drops unknown panel types, clamps
numbers, trims text, and fills in any of the three required panels (threat
map, activity chart, top alerts) from `fallback()`, which builds a complete
spec from the structured incidents with no model at all.
"""
from __future__ import annotations

from incident_logs import KINDS, SECTORS

SCHEMA_HINT = __doc__.split("A spec is a JSON object:")[1].split("`validate()`")[0].strip()
LEVELS = ("low", "elevated", "high", "critical")
SEVERITIES = ("info", "warning", "serious", "critical")
PANEL_TYPES = ("stats", "threat_map", "activity_chart", "alerts", "feed")
REQUIRED = ("threat_map", "activity_chart", "alerts")


def _num(value, lo: float, hi: float, default: float = 0) -> float:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return default
    return max(lo, min(hi, n))


def _text(value, limit: int) -> str:
    return " ".join(str(value or "").split())[:limit]


def bucket(level: float) -> int:
    """An incident level 0-10 as a map level 0-4."""
    if level <= 0:
        return 0
    if level <= 2:
        return 1
    if level <= 4:
        return 2
    if level <= 7:
        return 3
    return 4


def severity(level: float) -> str:
    return "critical" if level >= 8 else "serious" if level >= 6 else "warning" if level >= 4 else "info"


def rank(incidents: list[dict]) -> list[dict]:
    """Worst first: level, then casualties."""
    return sorted(incidents, key=lambda i: (_num(i.get("level"), 0, 10), _num(i.get("casualties"), 0, 1e6)), reverse=True)


# --- the no-model spec ------------------------------------------------------------

def fallback(incidents: list[dict], web: list[dict] | None = None) -> dict:
    incidents = [i for i in incidents if i.get("zone")]
    by_zone: dict[str, list[dict]] = {}
    for inc in incidents:
        by_zone.setdefault(inc["zone"], []).append(inc)
    zones = list(SECTORS) + [z for z in by_zone if z not in SECTORS]
    cells = []
    for zone in zones[:12]:
        rows = by_zone.get(zone, [])
        top = max((_num(r.get("level"), 0, 10) for r in rows), default=0)
        kinds = sorted({r.get("kind", "unknown") for r in rows})
        cells.append({"zone": zone, "level": bucket(top),
                      "label": f"{len(rows)} report(s), {', '.join(kinds)}" if rows else "quiet"})

    minutes = sorted({i.get("minute") or i.get("time", "")[:5] for i in incidents if i.get("minute") or i.get("time")})[-12:]
    if not minutes:
        minutes = ["now"]
    series = []
    for kind in KINDS:
        values = [sum(1 for i in incidents if i.get("kind") == kind and (i.get("minute") or i.get("time", "")[:5] or "now") == m)
                  for m in minutes]
        if any(values):
            series.append({"name": kind, "values": values})

    worst = rank(incidents)[:3]
    alerts = [{"severity": severity(_num(i.get("level"), 0, 10)), "zone": i["zone"],
               "headline": f"{i.get('kind', 'unknown').capitalize()} activity level {int(_num(i.get('level'), 0, 10))} in {i['zone']}",
               "detail": _text(i.get("summary") or i.get("line") or "", 200), "incident_id": i.get("id", "")} for i in worst]

    hottest = max(cells, key=lambda c: c["level"]) if cells else {"zone": "-", "level": 0}
    casualties = int(sum(_num(i.get("casualties"), 0, 1e6) for i in incidents))
    top_level = max((c["level"] for c in cells), default=0)
    panels = [
        {"type": "stats", "title": "Right now", "items": [
            {"label": "Incidents", "value": len(incidents), "note": "in this window"},
            {"label": "Casualties", "value": casualties, "note": "reported"},
            {"label": "Hottest sector", "value": hottest["zone"], "note": f"map level {hottest['level']}/4"},
        ]},
        {"type": "threat_map", "title": "Threat map", "cells": cells},
        {"type": "activity_chart", "title": "Activity by type, per minute", "x": minutes, "series": series},
        {"type": "alerts", "title": "Top alerts", "items": alerts},
    ]
    if web:
        panels.append({"type": "feed", "title": "From the web (You.com)",
                       "items": [{"text": _text(w.get("title") or w.get("line"), 140), "url": w.get("url", "")} for w in web[:5]]})
    return {"title": "Spooky Tactical Command Station", "subtitle": "Built without a model (offline fallback)",
            "threat_level": LEVELS[min(3, max(0, top_level - 1))], "panels": panels}


# --- checking a model's spec ----------------------------------------------------------

def _clean_panel(p: dict) -> dict | None:
    kind = p.get("type")
    title = _text(p.get("title") or kind.replace("_", " ").capitalize() if isinstance(kind, str) else "", 60)
    if kind == "stats":
        items = [{"label": _text(i.get("label"), 30), "value": _text(i.get("value"), 30), "note": _text(i.get("note"), 60)}
                 for i in (p.get("items") or [])[:4] if isinstance(i, dict)]
        return {"type": kind, "title": title, "items": items} if items else None
    if kind == "threat_map":
        cells = [{"zone": _text(c.get("zone"), 40), "level": int(_num(c.get("level"), 0, 4)), "label": _text(c.get("label"), 80)}
                 for c in (p.get("cells") or [])[:16] if isinstance(c, dict) and c.get("zone")]
        return {"type": kind, "title": title, "cells": cells} if cells else None
    if kind == "activity_chart":
        x = [_text(v, 12) for v in (p.get("x") or [])[:24]]
        series = []
        for s in (p.get("series") or [])[:5]:
            if not isinstance(s, dict):
                continue
            values = [_num(v, 0, 1e6) for v in (s.get("values") or [])[:len(x) or 24]]
            if values:
                series.append({"name": _text(s.get("name"), 24), "values": values})
        if not series:
            return None
        n = max(len(s["values"]) for s in series)
        x = (x + [str(i + 1) for i in range(len(x), n)])[:n]
        for s in series:
            s["values"] += [0] * (n - len(s["values"]))
        return {"type": kind, "title": title, "x": x, "series": series}
    if kind == "alerts":
        items = []
        for i in (p.get("items") or [])[:5]:
            if not isinstance(i, dict) or not i.get("headline"):
                continue
            sev = str(i.get("severity", "warning")).lower()
            items.append({"severity": sev if sev in SEVERITIES else "warning", "zone": _text(i.get("zone"), 40),
                          "headline": _text(i.get("headline"), 120), "detail": _text(i.get("detail"), 240),
                          "incident_id": _text(i.get("incident_id"), 40)})
        return {"type": kind, "title": title, "items": items} if items else None
    if kind == "feed":
        items = [{"text": _text(i.get("text"), 160), "url": str(i.get("url") or "")[:300]}
                 for i in (p.get("items") or [])[:6] if isinstance(i, dict) and i.get("text")]
        for item in items:
            if not item["url"].startswith(("https://", "http://")):
                item["url"] = ""  # the page renders this as a link; never let a model put javascript: in an href
        return {"type": kind, "title": title, "items": items} if items else None
    return None


def validate(raw: dict, incidents: list[dict], web: list[dict] | None = None) -> tuple[dict, list[str]]:
    """A spec the page can always render, plus notes on what had to be fixed."""
    notes: list[str] = []
    base = fallback(incidents, web)
    if not isinstance(raw, dict):
        return base, ["the model's spec was not an object; used the fallback"]
    panels = []
    for p in raw.get("panels") or []:
        clean = _clean_panel(p) if isinstance(p, dict) else None
        if clean:
            panels.append(clean)
        else:
            notes.append(f"dropped a panel the page cannot render: {str(p)[:80]}")
    have = {p["type"] for p in panels}
    for kind in REQUIRED:
        if kind not in have:
            panels.append(next(p for p in base["panels"] if p["type"] == kind))
            notes.append(f"the model left out {kind}; filled it from the incidents")
    level = str(raw.get("threat_level", "")).lower()
    spec = {
        "title": _text(raw.get("title"), 80) or base["title"],
        "subtitle": _text(raw.get("subtitle"), 160),
        "threat_level": level if level in LEVELS else base["threat_level"],
        "panels": panels[:8],
    }
    return spec, notes


def top_alerts(spec: dict, n: int = 3) -> list[dict]:
    alerts = next((p["items"] for p in spec.get("panels", []) if p.get("type") == "alerts"), [])
    return sorted(alerts, key=lambda a: SEVERITIES.index(a["severity"]) if a.get("severity") in SEVERITIES else 0, reverse=True)[:n]
