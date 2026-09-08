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

## Editing

- **Copy, URLs, coupon, Discord link, event facts:** `src/lib/site.ts`. `DISCORD_URL` is a placeholder until the invite exists.
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
