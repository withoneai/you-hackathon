# Build with One · Hackathons

Every hackathon One supports, at **https://hackathon.withone.ai**. The home page lists events as cards, upcoming by default with past events a tab away (`/#past`). Each event keeps its own page, skill and design system at its own slug, so old skills and event details stay reachable.

## Routes

| Route | What |
|---|---|
| `/` | The events hub: upcoming and past cards (Paper, the light theme) |
| `/<slug>` | An event's page: facts, coupon, skill install, setup, sponsors, templates, help |
| `/<slug>/skill` | That event's skill, rendered with a table of contents and a copy button |
| `/<slug>/skill.md` | That event's raw skill as `text/markdown`. The install prompt and commands fetch this |
| `/<slug>/opengraph-image` | The event's OG card, in its theme |
| `/skill.md`, `/skill` | The current event's skill (the next one that has not ended). Kept because install prompts shared before the hub pointed here |

## Events

| Slug | Event | Theme |
|---|---|---|
| `sf-halloween-2026` | Hack With YOU: Halloween Edition, San Francisco, Oct 28, 2026 | `paper` with pumpkin and hex accents and hero art |
| `nyc-2026` | Build with YOU: The Live Web Agent Hackathon, New York, Sep 11, 2026 | `carbon`, archived as it ran |

### Adding an event

1. Copy an event file in `src/events/` (for example `sf-halloween-2026.ts`), give it a new `slug` and fill in its facts, partners, templates and copy. `startsAt` and `endsAt` decide whether it shows as upcoming or past.
2. Add it to `EVENTS` in `src/events/index.ts`.
3. Put its skill at `content/events/<slug>/skill.md`. Point the skill's self-links at `https://hackathon.withone.ai/<slug>/skill.md`.
4. Pick a `theme`: `paper` (light) or `carbon` (dark). To give an event its own design system, add a `.theme-<name>` block in `src/app/globals.css` that sets the same tokens, and add the name to `EventTheme`.

## Design

`src/app/globals.css` holds two Clockwork themes, scoped by class:

- **`theme-paper`** is the light theme from the backoffice (`starter/backoffice/app/globals.css`): Paper ground, Ink text, white cards, Inter for display, tight 0.05em label tracking, small radii. The hub and the Halloween page use it, and it is the `:root` default.
- **`theme-carbon`** is the dark theme the NYC page shipped with: carbon neutrals, Lora display, wide 0.16em labels, large radii.

Both set the same token names (`--bg-*`, `--line*`, `--ink*`, `--spring`, display font, radii, shadows, code colours), so every section component renders in either theme. Lime is a fill only in both. White monochrome marks take the `mono` flag and invert on paper.

## Templates

`templates/` holds working examples. Each folder runs on its own: Python 3.10 to 3.13, the One CLI, a `.env`, and `./setup.sh`.

| Folder | Event | What it does |
|---|---|---|
| `exorcism-swarm` | SF, track 1 | A hierarchical CrewAI swarm on a Parasail model. Checks reports with You.com, posts to Slack, files containments in Linear, scores each run |
| `haunted-command-station` | SF, track 2 | Incident logs through a CrewAI crew to a Parasail-generated JSON UI spec, streamed over WebSockets |
| `self-repairing-research` | NYC | You.com research, chart in a Daytona sandbox, PNG by Gmail |
| `support-triage-crew` | NYC | Support mail to Linear and Slack, with repros in a sandbox |
| `market-watch` | NYC | Finance Research to Notion and Slack |
| `pr-reviewer-that-learns` | NYC | Reviews a GitHub pull request and learns from replies |

Template cards link to `TEMPLATES_URL` (GitHub, `main`) when `TEMPLATES_PUBLIC` in `src/lib/site.ts` is true. `templates/check.sh` compares the vendored helpers, compiles every script, and fails on any committed key or action id.

## Editing

- **Site-wide links and catalogues** (One's product and docs links, MCP URL, platform and agent logos): `src/lib/site.ts`.
- **Anything about one event**: `src/events/<slug>.ts`. Its skill repeats some of the same facts (coupon, Discord, URLs) as text, so change them there too.
- **Sections**: `src/components/sections/*` take an `event` prop. The hub's cards and tabs are in `src/components/hub/*`.
- **Logos**: `public/logo` (One, `logo-full-dark.svg` for carbon and `logo-full-light.svg` for paper), `public/agents`, `public/partners`, `public/platforms`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm run start
```

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4. No database, no env vars. The hub revalidates hourly so events move from upcoming to past on their own.
