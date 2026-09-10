# Self-repairing research agent

An agent that researches a topic on the live web, writes a script to chart what it found, runs that script somewhere it cannot break your laptop, fixes the script when it fails, emails you the chart, and remembers the fix so the next run does not fail the same way.

Three apps, one credential, no SDKs: You.com, Daytona and Gmail are all reached through One.

## Why this counts as a self-improving agent

Two loops, one inside a run and one across runs.

Inside a run the agent adapts when a tool fails. It asks the model for `chart.py`, runs it in a Daytona sandbox, and then runs a verification script (written into the sandbox from `VERIFY_SCRIPT` in `agent.py`) that opens the finished PNG and fails when a paper has no bar or the image is too small to read. A failure at either step hands the last 40 lines of output back to the model, applies the fix, and runs again, up to four times. Checking the picture matters: an early version of this template emailed a chart of three empty bars for days, because the script exited zero and the file had bytes.

Across runs it remembers. Every repair that led to a green run is stored in One memory as a one-sentence rule. The next run recalls those rules and puts them in the prompt before the first attempt. On our verification run the first run failed on attempt 1, repaired, and passed on attempt 2; the second run recalled the rule and passed on attempt 1.

The failure is real, not staged. A model writing a chart script from a one-paragraph brief gets it wrong often enough that you will see the loop work, usually on the data it did not expect: a title too long for the axis, a count that arrived as a string, an empty list. When a run does succeed on the first attempt, nothing is stored, because there was no lesson to learn. That is the honest behaviour of the loop, and the `Recalled:` and `Learned:` lines tell you which happened.

## What it uses from One

Path B in the hackathon skill: the `one` CLI, called from Python. The script never pastes an action id. It searches for each action at run time and picks it by method and path:

| Platform | Action | Used for |
|---|---|---|
| you | `POST /v1/research` | The sourced answer to research |
| daytona | `POST /api/sandbox` | A throwaway sandbox with a 15 minute TTL |
| daytona | `POST /toolbox/{sandboxId}/process/execute` | Writing files, running the script, reading the PNG back |
| daytona | `DELETE /api/sandbox/{sandboxIdOrName}` | Cleanup, in a `finally` |
| gmail | `POST /gmail/v1/users/{userId}/messages/send` | The raw MIME message with the PNG attached |

Memory is One's `one mem`: `remember` stores a rule keyed on the error, `recall` reads this template's rules back, `--forget` archives them.

## Setup

You need Node 18+, Python 3.10 to 3.13, a One account, and connections for You.com, Daytona and Gmail.

```bash
one add you        # key from https://api.you.com
one add daytona    # key from https://app.daytona.io/dashboard/keys
one add gmail      # OAuth in the browser

cd templates/self-repairing-research
./setup.sh         # venv, dependencies, .env from .env.example
```

Fill in `.env`: `ONE_SECRET`, your model key, and `EMAIL_TO`. Leave the three connection key lines empty when each platform has exactly one connection; `setup.sh` runs a preflight that tells you which key to set if not. Then run `./setup.sh` once more: it writes the One config that memory needs.

## Run

```bash
source .venv/bin/activate
python agent.py                        # run 1
python agent.py                        # run 2, uses what run 1 learned
python agent.py --topic "agent memory"  # any topic
python agent.py --forget               # start again from zero
```

## What you will see

Run 1, trimmed to the lines that matter:

```text
Recalled: 0 lesson(s)
Researching: graph neural networks
Research done: 2 source(s)
Papers: Semi-Supervised Classification with Graph Convolut (32647); Graph Attention Networks (23872); Inductive Representation Learning on Large Graphs (17884)
Sandbox b5d6ae5f-... created (ttl 15 min)
attempt 1 failed: chart.png is too small to read: 1000x150
  repair: The figure size is too small for the number of papers, making the chart unreadable.
attempt 2 ok: verified chart.png 1000x500: 3 bar(s) for 3 paper(s)
Sandbox b5d6ae5f-... deleted
Learned: 1 lesson(s): chart.png is too small to read: 1000x150
Emailed you@example.com: Gmail message id 1a08...
```

Run 2:

```text
Recalled: 1 lesson(s)
  - Set the figure height from the number of papers so the bars stay readable.
Researching: graph neural networks
Research done: 3 source(s)
Sandbox 146ebc7f-... created (ttl 15 min)
attempt 1 ok: verified chart.png 1000x500: 3 bar(s) for 3 paper(s)
Sandbox 146ebc7f-... deleted
Learned: 0 lesson(s) (no failures this run)
Emailed you@example.com: Gmail message id 1a08...
```

Every call is also in your One dashboard under Logs, with the request and the response.

## How it is built

- `agent.py` is the whole agent, top to bottom. `VERIFY_SCRIPT` inside it is written into the sandbox as `verify.py` and run after every attempt: it opens the finished PNG and fails unless each paper has a visible bar, so a blank or unreadable chart is repaired instead of emailed.
- `one_cli.py` wraps the CLI: `resolve` (search, pick by method and path), `execute`, memory helpers with a find-then-update-else-add upsert, and `preflight`, which checks the toolchain, the account and the connections, then writes a `.onerc` allowlist so the CLI can only see these three connections.
- `llm.py` is one function over `MODEL`. Everything here was verified on `openai/gpt-4o`. The Anthropic branch (`anthropic/claude-sonnet-5`) is written and supported but was not tested, so treat it as unverified.
- Scripts and data go into the sandbox as base64 through a single command, so quoting can never break them.
- The sandbox has `ttlMinutes: 15`, so an interrupted run still cleans itself up.

## How to extend

- Change the research prompt and the chart prompt in `agent.py`; the repair loop and the memory do not care what the script draws.
- Replace Gmail with Slack: search the `slack` platform for the file upload action and send the PNG there instead.
- Lock the sandbox down for untrusted code: pass `networkBlockAll: true` or a `domainAllowList` on the create action.
- Learn more than repairs: store which sources were useful, or which topics returned no citation counts at all, and feed that into the next research prompt.

Verified 2026-09-10 on `openai/gpt-4o` against a production One account.
