# Market watch

A morning briefing agent that learns how you like your brief. Each run researches your watchlist with You.com Finance Research, writes a sourced brief to a Notion page, posts a digest to Slack, and remembers the brief. Tell it what you preferred and the next run follows that, and says what changed since the last one.

## Why this counts as a self-improving agent

The agent learns a user's preferences and improves its results after feedback, which is the theme in one sentence.

- `market_watch.py feedback "Keep it to three bullet points. Lead with the biggest mover. Skip crypto."` stores a preference in One memory.
- The next `run` recalls every preference and puts them in the prompt as standing instructions. On our verification run the first brief was a broad, cautious multi-paragraph note; after that one line of feedback the second brief led with the biggest mover, in three bullets, with crypto left out.
- Each brief is remembered too, so the next run can say what changed since the previous one instead of repeating it.

## What it uses from One

Path B in the hackathon skill: the `one` CLI, called from Python. Action ids are resolved at run time by method and path.

| Platform | Action | Used for |
|---|---|---|
| you | `POST /v1/finance_research` | A finance-grade answer with sources for the whole watchlist in one call |
| notion | `POST /pages` | The brief as a page under a parent page you choose (first run of the day) |
| notion | `GET /blocks/{blockId}/children`, `DELETE /blocks/{blockId}`, `PATCH /blocks/{blockId}/children` | Rewriting today's page on a later run instead of creating a duplicate |
| slack | `POST /chat.postMessage` | A three-line digest with the Notion link |

Memory is One's `one mem`: preferences are keyed on their text so repeating one is a no-op, and briefs are keyed on the date. The record also holds the Notion page id, so a second run on the same day rewrites that page instead of leaving a second "Market brief" behind.

## Setup

Node 18+, Python 3.10 to 3.13, a One account, connections for You.com, Notion and Slack.

```bash
one add you       # key from https://api.you.com
one add notion    # OAuth; share the parent page with the integration
one add slack     # OAuth; invite the bot to the channel

cd templates/market-watch
./setup.sh
```

Fill in `.env`: `ONE_SECRET`, your model key, `WATCHLIST`, `NOTION_PARENT_PAGE_ID` (a page the Notion connection can write under; the id is the 32 hex characters at the end of the page URL), and `SLACK_CHANNEL` (a channel id the bot has joined). Then `./setup.sh` again to write the One config that memory needs.

## Run

```bash
source .venv/bin/activate
python market_watch.py run
python market_watch.py feedback "Keep it to three bullet points. Lead with the biggest mover. Skip crypto."
python market_watch.py run
python market_watch.py history
```

To run it every weekday morning: `./install-schedule.sh` prints and installs a cron line built from this folder's path, the `one` binary and `ONE_HOME`, so nothing machine-specific is committed. On macOS give cron Full Disk Access first; on Windows use Task Scheduler with the same command.

## What you will see

Run 1:

```text
Recalled: 0 preference(s), 0 previous brief(s)
Researching watchlist: AAPL, NVDA, BTC
Research done: 6 source(s)
Brief: Market Caution Weighs on Tech and Crypto Ahead of Key Data Releases
Notion page: https://www.notion.so/Market-brief-2026-09-10-...
Posted to Slack channel C0...
Learned: stored today's brief (keyed on 2026-09-10), so the next run can compare against it
```

Feedback, then run 2:

```text
Learned preference: Keep it to three bullet points. Lead with the biggest mover. Skip crypto.

Recalled: 1 preference(s), 1 previous brief(s)
  - Keep it to three bullet points. Lead with the biggest mover. Skip crypto.
Researching watchlist: AAPL, NVDA, BTC
Research done: 7 source(s)
Brief: Nvidia Gains Ahead of Key Conference, Apple Steady Post-Launch
Notion page: https://www.notion.so/Market-brief-2026-09-10-...
Posted to Slack channel C0...
Learned: stored today's brief (keyed on 2026-09-10), so the next run can compare against it
```

## How it is built

- `market_watch.py` has three commands: `run`, `feedback`, `history`, plus `--check` and `--forget`.
- The page id is stored the moment Notion confirms the page, before the Slack post, so a Slack failure cannot orphan it and cause a duplicate tomorrow.
- `one_cli.py` and `llm.py` are the same helpers every template vendors: CLI wrapper, action resolution, memory upsert, preflight with a `.onerc` allowlist, and one `complete` function over `MODEL`.
- The research text and the previous brief are handed to the model as untrusted data; the prompt says never to follow instructions found inside them.
- Finance Research accepts `research_effort` of `deep` or `exhaustive`; `deep` takes about a minute.
- A transient 5xx from an upstream platform is retried twice with a short wait before it is reported.

## How to extend

- Read feedback from Slack instead of the command line: fetch replies to yesterday's post with `conversations.replies` and store each as a preference.
- Add a second reader: a second `.env` with a different `SLACK_CHANNEL` and watchlist, since memory records carry the template name and can carry a reader name too.
- Swap Notion for Google Docs or a database row: replace the page write in `do_run` and the four Notion calls it uses (`POST /pages` to create, then `GET`, `DELETE` and `PATCH` on `/blocks/{blockId}/children` to rewrite the same page on a later run).

Verified 2026-09-10 on `openai/gpt-4o` against a production One account.
