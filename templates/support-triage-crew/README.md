# Support triage crew

A CrewAI crew that reads support email, reproduces each new bug in a Daytona sandbox, files it in Linear and announces it in Slack. It remembers what it filed, so the next run skips reports it has already handled, and it learns from the team's Linear decisions: cancel an issue and the crew stops re-filing that report.

Four apps through One, one credential, and One's MCP tools inside CrewAI for the part an agent should do.

## Why this counts as a self-improving agent

It remembers what worked and adapts to feedback.

- Every filed bug is stored in One memory under a key derived from the code snippet in the report, so a reworded duplicate maps to the same key. The record is written the moment Linear confirms the issue, before the Slack post, so a failed announcement can never cause a second filing.
- Run 2 on the same inbox recalls those records and files nothing.
- `feedback.py` reads the Linear state of every filed issue. A cancelled issue is remembered as "not a bug", and the next run reports it that way instead of filing it again.

On our verification run: run 1 read 19 unread emails, collapsed them to 3 unique reports, could not reproduce one, and filed the other two in Linear with a Slack line each. A human cancelled one issue. The feedback pass marked it not a bug. Run 2 recalled all three and filed nothing.

## How the work is split

The deterministic parts are code, the judgement is the crew.

| Step | Who | How |
|---|---|---|
| Read the inbox | code | Gmail's custom `POST /v1/gmail/get-emails`, then a literal subject-prefix filter, because Gmail's search ignores punctuation |
| Decide what is new | code | Hash the code snippet in each report, look it up in One memory |
| Create and delete the sandbox | code | `POST /api/sandbox` before the crew, `DELETE` in a `finally` |
| Run the snippet | Reproducer agent | One's MCP `execute_one_action`, scoped to one connection and one action |
| File the bug | Filer agent | One deterministic `@tool`: `file_linear_issue` (the `issueCreate` GraphQL mutation) |
| Announce it in Slack | code | `chat.postMessage`, called after a confirmed filing, never left to the model. A run that could not confirm its post checks `conversations.history` for the exact line (identifier and Linear URL) before trying again, so a lost response never doubles the message. If the channel cannot be read, or the scan runs out of pages, it leaves the bug unannounced for the next run rather than guess |

Each report goes through the crew end to end before the next one starts.

## What it uses from One

Path C in the hackathon skill for the crew (local MCP server through `MCPServerAdapter`) and path B (the CLI) for everything deterministic. The MCP server starts with `ONE_CONNECTION_KEYS` set to the Daytona connection only and `ONE_ACTION_IDS` set to the execute action only, both resolved in code before the crew starts. The Reproducer gets `get_one_action_knowledge` and the hardened `execute_one_action` from the skill; the Filer gets only `file_linear_issue`.

The MCP server is launched through `mcp_wrapper.py`, which copies its stderr to `mcp-stderr.log` with every secret and connection key replaced first, because the server prints the whole failed request on a 4xx.

## Setup

Node 18+, Python 3.10 to 3.13, a One account, connections for Gmail, Daytona, Linear and Slack.

```bash
one add gmail
one add daytona   # key from https://app.daytona.io/dashboard/keys
one add linear
one add slack     # invite the bot to the channel

cd templates/support-triage-crew
./setup.sh
```

Fill in `.env`: `ONE_SECRET`, your model key, `LINEAR_TEAM_KEY` (the short key of the team, e.g. `ENG`) and `SLACK_CHANNEL` (a channel id). Then `./setup.sh` again to write the One config that memory needs.

## Run

```bash
source .venv/bin/activate
python seed_inbox.py     # sends three sample reports to the connected inbox: two bugs, one duplicate
python crew.py           # run 1: files two issues
python seed_inbox.py     # the same three reports arrive again
python crew.py           # run 2: files nothing
# cancel one of the issues in Linear, then:
python feedback.py       # learns that it was not a bug
python crew.py --pending # what is waiting on a human, and how to release it
python crew.py --forget  # start over
```

The crew takes about a minute per new report.

## What you will see

Run 1:

```text
Recalled: 0 known report(s), 0 marked not a bug by a human, 0 still waiting for a human to reproduce
Inbox: 19 email(s), 3 unique report(s), 3 new
Sandbox ff71221c-... created (ttl 15 min)
  needs a human (the snippet ran cleanly here, could not reproduce): Totals maybe wrong
  filed TST-31: Empty basket causes IndexError
  announced TST-31 in Slack
  filed TST-32: Division error in reporting job with no orders
  announced TST-32 in Slack
Sandbox ff71221c-... deleted
Learned: filed 2 new bug(s); skipped 16 duplicate(s) in this batch and 0 already known from earlier runs
```

A report whose snippet runs cleanly here is not called "not a bug": it is recorded as needing a human. `python crew.py --pending` lists those, and `python crew.py --retry "<part of the title>"` releases one for another attempt. Only a report that could not be reproduced can be released: releasing a filed bug would make the crew file a second Linear issue, and releasing a human's "not a bug" decision would undo it.

After cancelling TST-23 in Linear, `feedback.py`:

```text
Recalled: 2 filed bug(s)
  TST-32: Backlog (backlog)
  TST-31: Canceled (canceled)
Learned: 1 report(s) marked not a bug; the next run will not file them again
```

Run 2:

```text
Recalled: 3 known report(s), 1 marked not a bug by a human, 1 still waiting for a human to reproduce
Inbox: 19 email(s), 3 unique report(s), 0 new
  known: None Totals maybe wrong (not_reproduced)
  known: TST-31 Empty basket causes IndexError (not_a_bug)
  known: TST-32 Division error in reporting job with no orders (filed)
Learned: nothing to file, every report was already known
```

## How it is built

- `crew.py` reads, dedupes, creates the sandbox, runs one two-agent crew per new report, remembers each result, and deletes the sandbox.
- `tools.py` holds the skill's `one_mcp_params`, `dropping_nulls` and `harden_execute`, the `file_linear_issue` tool, and the `announce` function the code calls. Tool parameters avoid the name `title`, because CrewAI's strict-schema sanitiser strips that key.
- `seed_inbox.py` and `feedback.py` are the two ends of the loop.
- `one_cli.py` and `llm.py` are the helpers every template vendors.
- Pins that work together: `crewai[anthropic]==1.15.2`, `crewai-tools[mcp]==1.15.2`, `mcp~=1.26.0`, `mcpadapt>=0.1.9,<0.2`.

## How to extend

- Let the Reproducer install packages: give the snippet a `requirements` line and a second execute call, still inside the sandbox.
- Learn severity: store the Linear priority a human sets and have the Filer propose it next time.
- Reply to the reporter: search the `gmail` platform for the reply action and send the Linear link back on the original thread.

Verified 2026-09-10 on `openai/gpt-4o` against a production One account.
