# Build with One · You.com Hackathon page

The one-page starting point for builders using One at You.com's **Build with YOU: The Live Web Agent Hackathon** (NYC, September 11, 2026), plus the primary `one-hackathon` skill they install.

Deployed at **https://hackathon.withone.ai**.

## Routes

| Route | What |
|---|---|
| `/` | The one-pager: event facts, the free-year-of-Pro coupon, the skill install callout, three ways to use One (remote MCP, CLI, API), partner playbooks (You.com, Daytona, CrewAI), use-case templates, help, links |
| `/skill` | The skill rendered with a table of contents and a copy button |
| `/skill.md` | The raw skill as `text/markdown`. This is the URL agents fetch and the install commands curl |
| `/opengraph-image` | Generated OG card |

## Templates

`templates/` holds four working examples for the hackathon theme (agents that repair and learn). Each folder runs on its own: Python 3.10 to 3.13, the One CLI, a `.env`, and `./setup.sh`.

| Folder | What it does | Improves how |
|---|---|---|
| `self-repairing-research` | You.com research, chart in a Daytona sandbox, PNG by Gmail | Repairs the script from the error; remembers the rule so the next run passes first time |
| `support-triage-crew` (CrewAI) | Reads support mail, reproduces each bug in a sandbox through One's MCP tools, files in Linear, posts to Slack | Remembers what it filed and skips duplicates; learns from cancelled issues |
| `market-watch` | Finance Research to a Notion page and a Slack digest | Applies preferences you give as feedback; says what changed since the previous brief |
| `pr-reviewer-that-learns` | Reviews a GitHub pull request | Turns `one-learn:` replies into rules it applies on the next review |

Every template resolves action ids at run time, reads the knowledge before executing, keeps `ONE_SECRET` in `.env`, scopes the CLI with a `.onerc` allowlist it writes itself, and prints `Recalled:` and `Learned:` lines so the improvement is visible. Verified 2026-09-10 on `openai/gpt-4o`.

The cards on the page link here only when `TEMPLATES_PUBLIC` in `src/lib/site.ts` is true. Flip it when the repository is public. `templates/check.sh` compares the vendored helpers, compiles every script, and fails on any committed key or action id.

## Editing

- **Copy, URLs, coupon, Discord link, event facts:** `src/lib/site.ts`. `DISCORD_URL` invites people to `#agentic-hackathon` in You.com's Discord and expires 2026-10-10.
- **The skill:** `content/skill.md`. Section anchors used by the page (`youcom-via-one`, `daytona-via-one`, `crewai-with-one`) come from the `##` heading text.
- **Design tokens:** `src/app/globals.css` (Clockwork dark: carbon neutrals, lime fill-only CTA, spring green accents, Inter / DM Mono / Lora).
- **Sections:** `src/components/sections/*`. Primitives in `src/components/ui/*`.
- **Logos:** `public/logo` (One), `public/agents` (AI clients), `public/partners` (You.com, Daytona, CrewAI, Discord, Founders Bay, Clean Data Alliance), `public/platforms` (connector marks from `assets.withone.ai/connectors/<slug>.svg`).

Platform and tool counts are fetched at build time from `api.withone.ai/open/count/*` with fallbacks in `site.ts`; the page revalidates hourly.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm run start
```

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4. No database, no env vars.
