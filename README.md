# Build with One · Hack With YOU Halloween page

The one-page starting point for builders using One at You.com's **Hack With YOU @ AWS Builder Loft, Halloween Edition** (San Francisco, October 28, 2026), plus the primary `one-hackathon` skill they install. Every team builds with You.com, One, CrewAI and Parasail.

Deployed at **https://hackathon.withone.ai**, which served the NYC edition before this one.

## Routes

| Route | What |
|---|---|
| `/` | The one-pager: event facts and both tracks, the free-month-of-Pro coupon, the skill install callout, three ways to use One (remote MCP, CLI, API), sponsor playbooks (You.com, CrewAI, Parasail), track templates, help, links |
| `/skill` | The skill rendered with a table of contents and a copy button |
| `/skill.md` | The raw skill as `text/markdown`. This is the URL agents fetch and the install commands curl |
| `/opengraph-image` | Generated OG card |

## Templates

`templates/` holds working examples. Each folder runs on its own: Python 3.10 to 3.13, the One CLI, a `.env`, and `./setup.sh`.

The page shows the two Halloween track templates:

| Folder | Track | What it does |
|---|---|---|
| `exorcism-swarm` | 1: The Exorcism Protocol | A hierarchical CrewAI swarm (Sentinel, Analyst, Dispatcher) on a Parasail model. Checks reports with You.com, posts to Slack, files containments in Linear, scores each run |
| `haunted-command-station` | 2: The Haunted Dashboard | Incident logs through a CrewAI crew to a Parasail-generated JSON UI spec, streamed to the browser over WebSockets. Alerts to Slack and Linear |

The four NYC templates (`self-repairing-research`, `support-triage-crew`, `market-watch`, `pr-reviewer-that-learns`) stay in the repo but are no longer on the page.

The cards link to `TEMPLATES_URL` on GitHub (`main`), so they resolve only once the templates are on `main` of `withoneai/you-hackathon`. They link at all only when `TEMPLATES_PUBLIC` in `src/lib/site.ts` is true. `templates/check.sh` compares the vendored helpers, compiles every script, and fails on any committed key or action id.

## Editing

- **Copy, URLs, coupon, Discord link, event facts, tracks, partners:** `src/lib/site.ts`. `DISCORD_URL` is the NYC invite, which Discord reports expired on 2026-10-10. Replace it before launch. `STARTER_REPO_URL` is empty until You.com shares the starter repo.
- **The skill:** `content/skill.md`. Section anchors used by the page (`youcom-via-one`, `parasail-with-one`, `crewai-with-one`) come from the `##` heading text. The skill repeats the site URL, coupon and Discord link as literal text, so change them there too.
- **Design tokens:** `src/app/globals.css` (Clockwork dark: carbon neutrals, lime fill-only CTA, spring green accents, Inter / DM Mono / Lora). The Halloween edition adds `pumpkin` and `hex` (purple) as a light accent, plus one piece of hero art (`src/components/sections/hero-art.tsx`).
- **Sections:** `src/components/sections/*`. Primitives in `src/components/ui/*`.
- **Logos:** `public/logo` (One), `public/agents` (AI clients), `public/partners` (You.com, CrewAI, Parasail, AWS, UpScaleX, Founders Bay, Discord), `public/platforms` (connector marks from `assets.withone.ai/connectors/<slug>.svg`).

The app count is a fixed label, `APP_COUNT_LABEL` in `site.ts` ("1,000+"), so the page, the skill and the event copy agree.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm run start
```

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4. No database, no env vars.
