"""Learn from what happened to the issues the crew filed.

For every bug the crew remembers, read its Linear issue. A cancelled issue
means the team decided it was not a bug, so the memory record is marked
`not_a_bug` and the next run reports it that way instead of re-filing it.

Usage: python feedback.py
"""
from __future__ import annotations

import sys

from one_cli import OneError, die, execute, load_env, mem_update, preflight, recall, resolve, say

TEMPLATE = "support-triage-crew"


def main() -> int:
    load_env()
    # Same four platforms as crew.py so the .onerc allowlist stays stable between the scripts.
    keys = preflight(TEMPLATE, ["gmail", "daytona", "linear", "slack"])
    query_id = resolve("linear", "list accessible teams", "POST", "/graphql", title="List Accessible Teams")
    bugs = recall(TEMPLATE, "bug", limit=50)
    say(f"Recalled: {len(bugs)} filed bug(s)")
    changed = 0
    for rec in bugs:
        identifier = rec["data"].get("identifier")
        if not identifier or rec["data"].get("status") == "not_a_bug":
            continue
        data = execute("linear", query_id, keys["linear"], data={
            "query": "query($id: String!) { issue(id: $id) { identifier state { name type } } }",
            "variables": {"id": identifier},
        })
        state = ((data.get("data") or {}).get("issue") or {}).get("state") or {}
        say(f"  {identifier}: {state.get('name')} ({state.get('type')})")
        if state.get("type") == "canceled":
            mem_update(rec["id"], {"status": "not_a_bug", "linear_state": state.get("name")})
            changed += 1
    say(f"Learned: {changed} report(s) marked not a bug; the next run will not file them again")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except OneError as exc:
        die(str(exc))
