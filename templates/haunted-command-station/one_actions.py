"""Everything the station does through One, in code.

- `web_incidents`: You.com Search (GET /v1/search on the `you` platform) for live reports.
- `Alerts.send`: the top alerts to Slack, and a Linear issue for the worst one.

Action ids are resolved at run time by method and path. Writes go only to the
Slack channel and Linear team in .env, are deduplicated across refreshes and
restarts (out/state.json), and are never retried blindly: a timeout or gateway
error on a write may still have landed, so it is reported, not repeated.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from one_cli import OneError, WriteUncertain, execute, resolve, say

STATE = Path("out") / "state.json"


def web_incidents(you_key: str, query: str, count: int = 5) -> list[dict]:
    """Live web and news results for the query. Fields go in query params, exactly query and count."""
    search_id = resolve("you", "search web and news", "GET", "/v1/search")
    res = execute("you", search_id, you_key, query={"query": query, "count": count}) or {}
    results = res.get("results") or {}
    out = []
    for hit in (results.get("news") or []) + (results.get("web") or []):
        if not hit.get("url"):
            continue
        out.append({"title": hit.get("title", ""), "url": hit["url"], "description": hit.get("description", ""),
                    "source": "web"})
    return out[:count]


def _load(path: Path) -> dict:
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        return {"slack_digest": "", "linear_filed": {}}


def _save(path: Path, state: dict) -> None:
    path.parent.mkdir(exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2))
    tmp.replace(path)


class Alerts:
    def __init__(self, dry_run: bool, slack_key: str = "", channel: str = "", linear_key: str = "", team_key: str = ""):
        self.dry_run = dry_run
        self.slack_key, self.channel, self.linear_key = slack_key, channel, linear_key
        self.team_id = ""
        # A dry run keeps its own memory, so a rehearsal never stops the real run from filing.
        self.state_path = STATE.with_name("state.dry-run.json") if dry_run else STATE
        if not dry_run:
            self.post_id = resolve("slack", "post message to channel", "POST", "/chat.postMessage")
            self.issue_id = resolve("linear", "create issue", "POST", "/graphql", title="Create an Issue")
            self.team_id = self._team(team_key)

    def _team(self, team_key: str) -> str:
        teams_id = resolve("linear", "list accessible teams", "POST", "/graphql", title="List Accessible Teams")
        data = execute("linear", teams_id, self.linear_key, data={"query": "{ teams { nodes { id key name } } }"}, read_only=True)
        for team in (data or {}).get("data", {}).get("teams", {}).get("nodes", []):
            if team["key"].lower() == team_key.lower():
                return team["id"]
        raise OneError(f"no Linear team with key {team_key}. Set LINEAR_TEAM_KEY in .env to one of your team keys")

    def send(self, alerts: list[dict], threat_level: str, page_url: str) -> dict:
        """Post the top alerts (when they changed) and file the worst one (once per incident)."""
        result = {"slack": "unchanged", "linear": "unchanged"}
        if not alerts:
            return result
        state = _load(self.state_path)

        digest = hashlib.sha256(json.dumps([[a["zone"], a["headline"]] for a in alerts]).encode()).hexdigest()[:16]
        if digest != state.get("slack_digest"):
            icon = {"critical": ":rotating_light:", "serious": ":warning:", "warning": ":ghost:"}
            lines = [f"*Haunted command station: threat {threat_level.upper()}*"]
            lines += [f"{icon.get(a['severity'], ':jack_o_lantern:')} [{a['severity']}] {a['zone']}: {a['headline']}" for a in alerts]
            lines.append(f"Live station: {page_url}")
            if self._slack("\n".join(lines)):
                state["slack_digest"] = digest
                result["slack"] = "posted"
            else:
                result["slack"] = "failed"

        worst = alerts[0]
        key = worst.get("incident_id") or f"{worst['zone']}|{worst['headline']}"
        if worst["severity"] in ("serious", "critical") and key not in state.get("linear_filed", {}):
            issue = self._linear(f"[{worst['severity']}] {worst['zone']}: {worst['headline']}",
                                 f"**Zone:** {worst['zone']}\n**Severity:** {worst['severity']}\n\n{worst.get('detail', '')}\n\n"
                                 f"Raised by the haunted command station (CrewAI on Parasail, You.com and One). Live view: {page_url}")
            if issue:
                state.setdefault("linear_filed", {})[key] = issue
                result["linear"] = f"filed {issue.get('identifier')}"
            else:
                result["linear"] = "failed"
        _save(self.state_path, state)
        return result

    def _slack(self, text: str) -> bool:
        if self.dry_run:
            say("  [dry-run] Slack " + (self.channel or "#station") + ":\n    " + text.replace("\n", "\n    "))
            return True
        try:
            res = execute("slack", self.post_id, self.slack_key, data={"channel": self.channel, "text": text}, skip_validation=True)
        except WriteUncertain as exc:
            say(f"  Slack post not confirmed, not retried: {exc}")
            return True  # it may have landed; treat as sent so the next refresh does not post it again
        except OneError as exc:
            say(f"  Slack post failed: {exc}")
            return False
        if not (res or {}).get("ok"):
            say(f"  Slack rejected the post: {(res or {}).get('error')}")
            return False
        return True

    def _linear(self, heading: str, body: str) -> dict:
        if self.dry_run:
            say(f"  [dry-run] Linear issue: {heading}")
            return {"identifier": "DRY-RUN", "url": ""}
        try:
            data = execute("linear", self.issue_id, self.linear_key, data={
                "query": "mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier url } } }",
                "variables": {"input": {"teamId": self.team_id, "title": heading[:200], "description": body[:6000]}},
            })
        except WriteUncertain as exc:
            say(f"  Linear issue not confirmed, not retried (check Linear before filing it again): {exc}")
            return {"identifier": "unconfirmed", "url": ""}  # recorded, so a restart does not file a second one
        except OneError as exc:
            say(f"  Linear issue failed: {exc}")
            return {}
        issue = ((data or {}).get("data") or {}).get("issueCreate", {}).get("issue") or {}
        if not issue.get("identifier"):
            say(f"  Linear did not confirm the issue: {json.dumps(data)[:300]}")
            return {}
        say(f"  filed {issue['identifier']} {issue.get('url', '')}")
        return {"identifier": issue["identifier"], "url": issue.get("url", "")}
