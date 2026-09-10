"""Tools for the support triage crew.

Two kinds. `one_mcp_params`, `dropping_nulls` and `harden_execute` are the
wrappers from the hackathon skill, so the crew can use One's MCP tools inside
CrewAI. The `@tool` functions below are deterministic: anything that must be
exact (a GraphQL mutation, a Slack message) is code, not a model guess.

No `from __future__ import annotations` here: CrewAI builds each tool's JSON
schema from the real type hints, and string annotations leave it empty, which
OpenAI then rejects.
"""
import json
import os
import re
import sys

from crewai.tools import tool
from mcp import StdioServerParameters

from one_cli import OneError, connection, execute, mem_find, mem_update, remember, resolve, say

TEMPLATE = "support-triage-crew"

# One report at a time. `begin_report` opens the slot, the tool fills it at most once, and
# `issue_for` reads it back. This is what stops a second tool call from filing a duplicate.
_CURRENT: dict = {"key": None, "issue": None}


def begin_report(report_key: str) -> None:
    _CURRENT["key"] = report_key
    _CURRENT["issue"] = None
    _CURRENT["announced"] = False


def issue_for(report_key: str):
    return _CURRENT["issue"] if _CURRENT["key"] == report_key else None


# --- One MCP wrappers (from content/skill.md) --------------------------------

def one_mcp_params(connection_keys: list[str], action_ids: list[str]) -> StdioServerParameters:
    """Start the local MCP server with a hard allowlist and redacted stderr (see mcp_wrapper.py).

    The child gets only what it needs: One's own credential and scoping, plus enough of the
    system environment to run node. The model keys stay in this process, where the crew uses
    them; the MCP server has no reason to hold them.
    """
    keep = ("PATH", "HOME", "LANG", "LC_ALL", "TMPDIR", "SystemRoot", "APPDATA", "NODE_EXTRA_CA_CERTS", "ONE_HOME")
    env = {k: os.environ[k] for k in keep if k in os.environ}
    env["ONE_SECRET"] = os.environ["ONE_SECRET"]
    if os.environ.get("ONE_BASE_URL"):
        env["ONE_BASE_URL"] = os.environ["ONE_BASE_URL"]
    env["ONE_CONNECTION_KEYS"] = ",".join(connection_keys)
    env["ONE_ACTION_IDS"] = ",".join(action_ids)
    return StdioServerParameters(command=sys.executable, args=["mcp_wrapper.py"], env=env)


def dropping_nulls(tools):
    for t in tools:
        inner = t._run
        object.__setattr__(t, "_run", (lambda f: lambda **kw: f(**{k: v for k, v in kw.items() if v is not None}))(inner))
    return tools


def harden_execute(tools):
    mcp_execute = next(t for t in tools if t.name == "execute_one_action")

    @tool("execute_one_action")
    def execute_one_action(platform: str, actionId: str, connectionKey: str, dataJson: str = "", pathVariablesJson: str = "",
                           queryParamsJson: str = "", headersJson: str = "", isFormData: bool = False, isFormUrlEncoded: bool = False) -> str:
        """Execute an API action on a connected platform via One. Pass request parts as JSON-encoded STRINGS. Omit or pass "" for parts the action does not need. Set isFormData or isFormUrlEncoded only when the knowledge says the body is form-encoded."""
        kwargs = {"platform": platform, "actionId": actionId, "connectionKey": connectionKey}
        for key, raw in (("data", dataJson), ("pathVariables", pathVariablesJson), ("queryParams", queryParamsJson), ("headers", headersJson)):
            if raw and raw.strip() and raw.strip() != "{}":
                kwargs[key] = json.loads(raw)
        if "headers" in kwargs:  # One's own routing headers come from connectionKey and actionId; never let an agent override them
            kwargs["headers"] = {k: v for k, v in kwargs["headers"].items() if not k.lower().startswith(("x-one-", "x-pica-"))} or None
            if kwargs["headers"] is None:
                del kwargs["headers"]
        if isFormData:
            kwargs["isFormData"] = True
        if isFormUrlEncoded:
            kwargs["isFormUrlEncoded"] = True
        return mcp_execute._run(**kwargs)

    return [t for t in tools if t.name != "execute_one_action"] + [execute_one_action]


# --- deterministic tools ------------------------------------------------------

def linear_team_id(team_key: str) -> str:
    key = connection("linear")
    query_id = resolve("linear", "list accessible teams", "POST", "/graphql", title="List Accessible Teams")
    data = execute("linear", query_id, key, data={"query": "{ teams { nodes { id key name } } }"})
    for team in data.get("data", {}).get("teams", {}).get("nodes", []):
        if team["key"].lower() == team_key.lower():
            return team["id"]
    raise RuntimeError(f"no Linear team with key {team_key}")


def make_tools(team_id: str, slack_channel: str):
    linear_key = connection("linear")
    slack_key = connection("slack")
    create_issue = resolve("linear", "create issue", "POST", "/graphql", title="Create an Issue")
    post_message = resolve("slack", "post message to channel", "POST", "/chat.postMessage")
    history = resolve("slack", "conversation history messages", "GET", "/conversations.history")

    # Parameter names avoid `title`: CrewAI's strict-schema sanitizer strips every key called
    # "title" (to drop pydantic's schema titles) and would delete a parameter with that name.
    @tool("file_linear_issue")
    def file_linear_issue(issue_title: str, body: str) -> str:
        """File one bug in Linear with a short issue_title and a markdown body. Returns the issue identifier and URL as JSON. Call it exactly once per bug."""
        if _CURRENT["issue"]:
            done = _CURRENT["issue"]
            return json.dumps({"identifier": done["identifier"], "url": done["url"],
                               "note": "already filed for this report; do not call this tool again"})
        data = execute("linear", create_issue, linear_key, data={
            "query": "mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier url } } }",
            "variables": {"input": {"teamId": team_id, "title": issue_title[:200], "description": body[:6000]}},
        })
        if data.get("errors"):
            return f"error: Linear rejected the issue: {json.dumps(data['errors'])[:300]}"
        created = (data.get("data") or {}).get("issueCreate") or {}
        issue = created.get("issue") or {}
        if not created.get("success") or not issue.get("identifier") or not issue.get("url"):
            return f"error: Linear did not confirm the issue: {json.dumps(created)[:300]}"
        record = {"identifier": issue["identifier"], "url": issue["url"], "title": issue_title}
        _CURRENT["issue"] = record
        say(f"  filed {issue['identifier']}: {issue_title[:60]}")
        # Persist now, before Slack, so a failed announcement can never cause a second filing.
        # `announced: False` is what lets the next run pick the announcement back up.
        if _CURRENT["key"]:
            remember(TEMPLATE, "bug", {"title": issue_title, "identifier": issue["identifier"],
                                       "url": issue["url"], "status": "filed", "announced": False},
                     key=_CURRENT["key"], tags=["bug"], weight=7)
        return json.dumps({"identifier": issue["identifier"], "url": issue["url"]})

    def announce(issue: dict, memory_key: str | None = None) -> bool:
        """Post the filed issue to Slack. Called by the code, not by the model.

        Announcing is not a judgement call: every filed bug gets one line. Leaving it to the
        model meant one issue was announced and the next was silently skipped. When Slack fails,
        the memory record keeps `announced: False` so the next run retries it.
        """
        if not issue:
            return False
        key = memory_key or _CURRENT.get("key")
        text = f"{issue['identifier']}: {issue['title'][:160]} {issue['url']}"

        # Look before posting. A previous run may have timed out after Slack accepted the message,
        # so retrying blind is how a channel gets the same line twice.
        seen = already_posted(issue)
        if seen is True:
            say(f"  {issue['identifier']} is already in Slack; not posting it again")
            mark_announced(key)
            return True
        if seen is None:
            # The channel could not be read, so posting might duplicate an earlier message.
            # Leave it unannounced and try again next run rather than risk a second line.
            say(f"  leaving {issue['identifier']} unannounced until the channel can be read")
            return False

        try:
            res = execute("slack", post_message, slack_key, data={"channel": slack_channel, "text": text}, skip_validation=True)
        except OneError as exc:
            # The message may have landed even though no answer came back. Do not mark it
            # announced: the next run checks the channel first, then posts only if it is missing.
            say(f"  could not confirm the Slack post for {issue['identifier']} ({exc}); "
                "the next run checks the channel before trying again")
            return False
        if not res.get("ok"):
            say(f"  Slack rejected the announcement for {issue['identifier']} ({res.get('error')}); the next run will retry it")
            return False
        mark_announced(key)
        say(f"  announced {issue['identifier']} in Slack")
        return True

    def already_posted(issue: dict) -> bool | None:
        """Is this issue's announcement already in the channel?

        Three answers, and the difference matters: True (found, do not post again), False
        (definitely not there, safe to post), None (the channel could not be read, or the scan
        ran out of pages with history still unread, so nothing is known). Returning False in
        either unknown case is how a duplicate gets posted.

        A match is the announcement itself: the word-bounded identifier and the issue's Linear
        URL in one message. The identifier alone is not enough, because a human writing "I'm
        looking at TST-1" would otherwise silence the official line for good.

        Pages back through the history so an announcement from days ago is still found.
        """
        identifier, url = issue["identifier"], issue["url"]
        pattern = re.compile(rf"(?<![A-Za-z0-9-]){re.escape(identifier)}(?![A-Za-z0-9-])")
        cursor, pages = None, 0
        while pages < 5:  # about 1000 messages, far past any realistic announcement backlog
            query = {"channel": slack_channel, "limit": 200}
            if cursor:
                query["cursor"] = cursor
            try:
                res = execute("slack", history, slack_key, query=query, read_only=True)
            except OneError as exc:
                say(f"  could not read the Slack channel to check for {identifier} ({exc})")
                return None
            if not res.get("ok", True):
                say(f"  could not read the Slack channel to check for {identifier} ({res.get('error')})")
                return None
            for m in res.get("messages", []):
                # A word-boundary match: plain `in` would let TST-1 match a line about TST-10.
                text = m.get("text") or ""
                if url in text and pattern.search(text):
                    return True
            cursor = ((res.get("response_metadata") or {}).get("next_cursor") or "").strip()
            pages += 1
            # The cursor is authoritative: Slack says to page until next_cursor is empty, and
            # `has_more` is optional. Stopping on a missing has_more would skip real history.
            if not cursor:
                return False
        # Pages remain unread, so the announcement may sit further back. Unknown, not absent.
        say(f"  Slack history is longer than the {pages}-page scan; cannot tell whether {identifier} was announced")
        return None

    def mark_announced(key: str | None) -> None:
        _CURRENT["announced"] = True
        if not key:
            return
        found = mem_find(key, "bug")
        if found:
            mem_update(found[0]["id"], {"announced": True})

    return file_linear_issue, announce
