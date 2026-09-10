"""Send three sample support emails to the connected inbox so the crew has something deterministic to triage.

Two are real bugs with a Python snippet. The third reports the first bug again
in different words with the same snippet, which is what the crew must
recognise as a duplicate.
"""
from __future__ import annotations

import sys

from one_cli import OneError, die, execute, load_env, preflight, resolve, say

TEMPLATE = "support-triage-crew"

SNIPPET_A = """def first_item(items):
    return items[0]

print(first_item([]))
"""

SNIPPET_B = """def average(values):
    return sum(values) / len(values)

print(average([]))
"""

EMAILS = [
    ("[support] Crash when the cart is empty",
     "Hi team, our checkout page crashes for customers with an empty cart. This is the helper that fails:\n\n"
     f"```python\n{SNIPPET_A}```\n\nCan you take a look?"),
    ("[support] Division error in the reporting job",
     "Hello, the nightly report job stops with a division error whenever a day has no orders. Minimal repro:\n\n"
     f"```python\n{SNIPPET_B}```\n\nThanks."),
    ("[support] Empty basket blows up",
     "Reporting the same thing a colleague mentioned: opening an empty basket throws. Here is the code path:\n\n"
     f"```python\n{SNIPPET_A}```\n\nRegards."),
]


def main() -> int:
    load_env()
    # Same four platforms as crew.py so the .onerc allowlist stays stable between the two scripts.
    keys = preflight(TEMPLATE, ["gmail", "daytona", "linear", "slack"], need_memory=False)
    profile_id = resolve("gmail", "get profile", "GET", "/gmail/v1/users/{userId}/profile")
    send_id = resolve("gmail", "send email", "POST", "/v1/gmail/send-email")
    me = execute("gmail", profile_id, keys["gmail"], path_vars={"userId": "me"}).get("emailAddress")
    if not me:
        die("could not read the connected mailbox address")
    for subject, body in EMAILS:
        execute("gmail", send_id, keys["gmail"], data={"to": me, "subject": subject, "body": body})
        say(f"sent: {subject}")
    say("Seeded 3 support emails to the connected inbox (two bugs, one duplicate).")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except OneError as exc:
        die(str(exc))
