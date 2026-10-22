---
name: one-hackathon
description: |
  Build with One at You.com's "Hack With YOU: Halloween Edition" (San Francisco, October 28, 2026). Every team builds with You.com, One, CrewAI and Parasail. One connects an AI agent to 1,000+ apps (Gmail, Slack, Notion, GitHub, Linear, You.com and more) through four tools with managed auth, access control and an audit log. Use this skill to set One up (remote MCP server, CLI, local MCP server, passthrough API or SDK), to take any action in a third-party app through the list → search → knowledge → execute loop, to use You.com through One, to run a CrewAI crew on One's tools with a Parasail model, to build for The Exorcism Protocol or The Haunted Dashboard tracks, or to find the One dashboard, docs, logs, coupon or Discord.
---

# Build with One (hackathon edition)

## When to use this skill

Use it when the user wants to:

- Set up One, install the One CLI, or connect an agent (Claude Code, Cursor, Codex, ChatGPT, Claude, OpenClaw, Hermes, Kiro, Gemini CLI, CrewAI) to One's MCP server
- Take ANY action in a third-party app: send an email, post to Slack, create a Linear issue, read a calendar, look up a customer
- Search the web, research a topic, or read a page with You.com through One
- Build a CrewAI crew whose agents act on real apps through One, or fix "expected boolean, received null" and empty-data errors from One tools inside CrewAI
- Run a crew's agents, or a generated UI, on a Parasail model
- Build a swarm for The Exorcism Protocol track or a generative UI pipeline for The Haunted Dashboard track
- Let the users of a product connect their own apps to it (One Connect)
- Redeem the hackathon coupon, or find the One dashboard, docs, logs or Discord

Do not use it for calling the You.com API directly with its own SDK and key with no One involved, or for CrewAI or Parasail questions that have nothing to do with tools, integrations or this hackathon.

One connects an AI agent to every app a builder needs through **four tools**. No matter how many platforms you connect, it stays four tools, so *search* is how the agent finds things, not a giant tool list. One holds the OAuth tokens and API keys server-side, proxies every call, enforces the access you granted, and logs each request so you can see exactly what your agent did.

```text
list_one_integrations  →  search_one_platform_actions  →  get_one_action_knowledge  →  execute_one_action
      what am I               what can I do here?             how do I do it?              do it.
      connected to?
```

The CLI (`one list`, `one actions search`, `one actions knowledge`, `one actions execute`) is the same loop from a terminal. Everything below applies to both.

## Links you will need

| What | Where |
|---|---|
| Dashboard (create account, connect apps, logs) | https://app.withone.ai |
| API keys (`sk_live_…` / `sk_test_…`) | https://app.withone.ai/settings/api-keys |
| Every call your agent made, request and response | https://app.withone.ai/logs |
| Billing (redeem the hackathon coupon) | https://app.withone.ai/settings/billing |
| Hackathon perk: **a free month of One Pro for every builder** | code `YOU-SF-PRO`, entered at checkout on the Pro plan. The winning team gets a free year (second place six months, third place three) |
| Remote MCP server (Streamable HTTP, OAuth) | `https://mcp.withone.ai/mcp` |
| Docs | https://www.withone.ai/docs/welcome · CLI https://www.withone.ai/docs/cli · MCP https://www.withone.ai/docs/mcp · Install guides https://www.withone.ai/docs/install · Relay https://www.withone.ai/docs/relay |
| Every platform and action, searchable | https://www.withone.ai/knowledge |
| You.com API key | https://api.you.com |
| Parasail API key and docs | https://www.saas.parasail.io/keys · https://docs.parasail.io |
| CrewAI docs | https://docs.crewai.com |
| Starter repo (CrewAI starter and the facility simulation) | Not public yet. Ask in the Discord |
| Track templates | https://github.com/withoneai/you-hackathon/tree/main/templates |
| One Connect (let your users connect their own apps) | https://github.com/withoneai/connect · skill: `npx skills add withoneai/connect` |
| This skill (latest version) | https://halloween.withone.ai/skill.md · rendered at https://halloween.withone.ai/skill |
| Hackathon page and Discord | https://halloween.withone.ai · https://discord.gg/pn8QmHQ4p |
| Event page | https://luma.com/you-halloween |

Platform slugs are lowercase kebab-case: `gmail`, `slack`, `google-calendar`, `hubspot`, `you`, `linear`. Run `one platforms` or browse the knowledge base to find one.

## Pick your path

| Your agent lives in… | Use | Why |
|---|---|---|
| An editor or chat client (Claude Code, Cursor, Codex, ChatGPT, Claude, OpenClaw, Hermes, Kiro, Gemini CLI) | **A. Remote MCP server** | Nothing to install, OAuth sign-in in the browser, scope exactly what the client may touch on the consent screen |
| A terminal, a shell script, a cron job, or you need to connect platforms | **B. The CLI** | `one add <platform>` lives here; `--agent` gives JSON for anything that can run a command |
| A Python or Node framework such as CrewAI, LangChain, Mastra, the Vercel AI SDK | **C. Local MCP server** (`npx -y @withone/mcp` + `ONE_SECRET`) | Frameworks cannot complete a browser OAuth flow; the local server takes a key from the environment |
| Application code you are shipping | **D. Passthrough API or `@withone/sdk`** | Three headers, no per-platform tokens or refresh logic in your code |
| A product whose **users** should connect **their own** apps to it | **E. One Connect** (`@withone/connect` + two backend routes) | Each user grants your app a scoped, revocable token to their own One connections; One enforces the grant on every call. See [Embed One in your product](#embed-one-in-your-product-one-connect) |

You can mix them. They share the same account, the same connections and the same access rules.

### A. Remote MCP server

URL: `https://mcp.withone.ai/mcp`. Transport: Streamable HTTP. Auth: OAuth in the browser on first use. There is no API key. On the consent screen you pick the space and environment (sandbox or production), which connections the client may use, read-only / read-write / a specific action list per connection, and optionally **Knowledge-only mode**, which removes `execute_one_action` so the agent can read every API's real schema and write code but never fire a live request.

Generic config for any client that takes JSON (Cursor, Kiro, Windsurf and others):

```json
{
  "mcpServers": {
    "one": {
      "type": "http",
      "url": "https://mcp.withone.ai/mcp"
    }
  }
}
```

Some clients omit `type` and take the URL alone; UI-based clients (custom connectors) just need the URL. If you hand-edit Claude Code's `.mcp.json` or `~/.claude.json`, the entry needs `"type": "http"` or Claude Code treats it as a stdio server and skips it.

| Client | Setup |
|---|---|
| Claude Code | `claude mcp add --transport http one https://mcp.withone.ai/mcp` (add `--scope project` to write the repo's `.mcp.json`). Or the plugin, which bundles skills: `/plugin marketplace add withoneai/claude-plugin` then `/plugin install one@one`, then `/mcp` → One → Authenticate |
| Cursor | Cursor menu → MCP Settings, or `~/.cursor/mcp.json` (project: `.cursor/mcp.json`) with the JSON above. Click **Connect** on the "Needs authentication" row |
| Codex | `~/.codex/config.toml`: `[mcp_servers.one]` / `url = "https://mcp.withone.ai/mcp"`, then `codex mcp login one`. `auth` defaults to `oauth` |
| ChatGPT | Settings → Apps → Advanced settings → Create app. Name `One`, Connection `https://mcp.withone.ai/mcp`, Authentication OAuth, then Sign in with One |
| Claude (Cowork / apps) | Settings → Connectors → Add custom connector. Name `One`, URL `https://mcp.withone.ai/mcp` |
| Devin | Settings → Connections → MCP servers → Add a custom MCP. Name `One`, transport HTTP (Streamable HTTP), URL above |
| Kiro | `~/.kiro/settings/mcp.json` (project: `.kiro/settings/mcp.json`) with the JSON above |
| OpenClaw | `openclaw mcp add one --url https://mcp.withone.ai/mcp --transport streamable-http --auth oauth` then `openclaw mcp login one`; verify with `openclaw mcp doctor one --probe` |
| Hermes | `~/.hermes/config.yaml`: `mcp_servers: { one: { url: "https://mcp.withone.ai/mcp", auth: oauth } }`, then `hermes mcp login one` from a separate terminal |
| Gemini CLI | `gemini mcp add --scope user --transport http one https://mcp.withone.ai/mcp`, then `/mcp auth one` |

To change what a client may access later: clear its One authentication in the client (Claude Code: `/mcp` → One → Clear authentication) and sign in again.

If the four tools do not appear, or every call returns 401, the fix is always the same: re-authenticate the One server in that client.

### B. The CLI

Node 18+. The CLI auto-updates silently after most commands.

```bash
npm i -g @withone/cli
one init --auth browser            # opens a login window, saves the key, installs the base `one` skill; no prompts
one init --auth browser --project  # same, scoped to this folder only (config in ~/.one/projects/<slug>/)
one init --auth manual --api-key sk_live_...   # headless / CI, key from app.withone.ai/settings/api-keys
one whoami                         # user, organization, project, config scope, API base
```

Always put `--agent` right after `one` for JSON output with no colours, spinners or prompts. Every error comes back as `{"error": "..."}`.

```bash
one --agent list                                            # connections, keys, and your access on each
one --agent actions search <platform> "<query>" -t execute  # find an action (-t knowledge when writing code)
one --agent actions knowledge <platform> <actionId>         # read its docs (REQUIRED before execute)
one --agent actions execute <platform> <actionId> <connectionKey> [flags]
```

Execute flags: `-d '<json>'` request body (POST/PUT/PATCH) · `--path-vars '<json>'` for `{id}` placeholders in the path · `--query-params '<json>'` · `--headers '<json>'` · `--form-data` / `--form-url-encoded` · `--dry-run` (show the request, do not send) · `--mock` (example response, no API call; handy for building UI) · `--skip-validation` · `--output <path>` (binary downloads) · `--no-cache` · `--parallel` with segments separated by `--` (`--max-concurrency <n>`, default 5).

Do **not** put path or query values inside `-d`; use the matching flag. Wrap JSON in single quotes.

Helpful extras: `one guide [overview|actions|flows|relay|cache|sync|memory|all]` prints the full reference for agents that only have the binary; `one onboard` walks a fresh agent through your connections and suggests demo actions; `one config` sets permission level, connection scope, action scope and knowledge-only mode for every installed agent config at once.

### C. Local MCP server (frameworks)

Same four tools, run as a child process, authenticated with a key from the environment instead of a browser.

```bash
export ONE_SECRET=sk_live_...      # same key the CLI uses (app.withone.ai/settings/api-keys)
npx -y @withone/mcp --help         # downloads it once so the first real start is fast
```

Client config (Claude Desktop, Cursor, or any stdio client):

```json
{
  "mcpServers": {
    "one": {
      "command": "npx",
      "args": ["-y", "@withone/mcp"],
      "env": { "ONE_SECRET": "sk_live_..." }
    }
  }
}
```

The hosted server at `https://mcp.withone.ai/mcp` needs a browser sign-in, so a bearer `ONE_SECRET` does **not** work against it. Frameworks use this local server. See [CrewAI with One](#crewai-with-one) for the wiring.

### D. Passthrough API and SDK

Every action is also a plain HTTP call through One's proxy. Base URL `https://api.withone.ai`. Three headers, all required:

| Header | Value | Where it comes from |
|---|---|---|
| `x-one-secret` | your key | https://app.withone.ai/settings/api-keys (`sk_live_…` / `sk_test_…`) |
| `x-one-connection-key` | the connection to act on | `one --agent list` (`live::you::default::…`) |
| `x-one-action-id` | the action's id | `one --agent actions search <platform> "<query>"` |

Without `x-one-action-id` the proxy answers 400. The path after `/v1/passthrough/` is the action's own path, which you get from its knowledge.

```ts
const res = await fetch(
  "https://api.withone.ai/v1/passthrough/v1/search?query=haunted+house+sightings&count=5",
  {
    headers: {
      "x-one-secret": process.env.ONE_SECRET!,
      "x-one-connection-key": process.env.ONE_YOU_CONNECTION_KEY!,
      "x-one-action-id": process.env.ONE_YOU_SEARCH_ACTION_ID!, // the GET /v1/search action
    },
  },
);
```

Typed Node SDK (`npm i @withone/sdk`, Node 18+). The root of the package exports the client (`One`, `Action`, `OneError`, …); each platform's typed actions are a **subpath** module, so import them from `@withone/sdk/<platform>`:

```ts
import { One } from "@withone/sdk";
import * as gmail from "@withone/sdk/gmail";

const one = new One(process.env.ONE_SECRET!); // or One.fromEnv()
const res = await one
  .connection(process.env.ONE_GMAIL_CONNECTION_KEY!)
  .run(gmail.createUsersDraft({ path: { userId: "me" }, body: { message: { raw: base64Email } } }));
```

Typed modules exist for 34 platforms in 0.4.0 (gmail, slack, github, linear, notion, hubspot, stripe, googleCalendar, googleSheets, discord, openai, anthropic and more). **There is no typed `you` module yet.** Reach it with `runRaw`, the escape hatch that still handles auth, the base URL, retries and parsing. `systemId` is the same id `one actions search` returns as `actionId` (`conn_mod_def::…`); `method` and `path` come from the same result:

```ts
const search = await one.connection(process.env.ONE_YOU_CONNECTION_KEY!).runRaw({
  systemId: "<actionId from one actions search, e.g. conn_mod_def::…>",
  method: "GET",
  path: "/v1/search",
  query: { query: "haunted house sightings", count: 5 },
});
console.log(search.status, search.data);
```

`runRaw` takes `systemId`, `method`, `path`, optional `pathParams`, `query`, `body` and `headers`. Keys belong in the environment, never in source. Add the variable names to `.env.example`. Browser bundles cannot hold a One secret; route through a server.

## Connect platforms

Connections are made once, then shared by every path above.

```bash
one add you            # You.com: paste the key from https://api.you.com
one add gmail          # OAuth platforms open the browser
one add slack --tag work   # tag when you will have several accounts on one platform
```

Or use the Connect page at https://app.withone.ai. Then verify:

```bash
one --agent list --search you
```

`--search` matches substrings, so `--search you` also returns `youtube-data`. Match on the `platform` field, not on the search string: you want the row whose `platform` is exactly `you`, with an `operational` status and a key like `live::you::default::<32hex>`. That key is `<connectionKey>` everywhere below. **No matching row means the platform is not connected, or your key belongs to a different One environment (`live` vs `test`) than your connections.** Most "my code is broken" time in a short hackathon is really this. Keys are `sk_live_` for production and `sk_test_` for sandbox; connections created in one environment are invisible from the other.

Remove a connection with `one --agent connection delete <connectionKey>`.

## The four-tool loop

| Tool | CLI | What it does |
|---|---|---|
| `list_one_integrations` | `one list` | Active connections, each with its `platform`, `key` and the `access` it allows |
| `search_one_platform_actions` | `one actions search` | Up to 5 candidate actions on one platform for a plain-language query: `actionId`, `title`, `method`, `path` |
| `get_one_action_knowledge` | `one actions knowledge` | The real docs for one action: required and optional parameters, exact names and casing, enums, where each value goes (path / query / body / header), the response shape, gotchas |
| `execute_one_action` | `one actions execute` | Runs the action against the live account |

Follow it in order. Skipping a step is where calls fail.

1. **List first.** Confirm the platform is connected and grab its key. Only use keys returned here; never invent one. If the platform is missing, say so and point the user at `one add <platform>` or https://app.withone.ai. Do not fall back to a raw HTTP request, a scraped page, or a different platform that happens to be connected.
2. **Search by outcome.** `query` describes what you want to happen ("send an email", "create an issue", "search web and news"), not an endpoint name. Pass `agent_type: "execute"` when the user wants something done, `"knowledge"` when they want code or documentation. If nothing fits, broaden the query. When several actions share a title, pick by `method` and `path`.
3. **Read the knowledge. Always.** It is the schema. A field name that looks obvious and is not in the knowledge is invented, and produces a 400, or worse, a 200 that wrote the wrong thing. Never hardcode an action ID across sessions; resolve it at build time.
4. **Execute with values where the knowledge says they go.** Path variables in the path-variables argument, query params in query params, body fields in the body. Do not hand-build URLs or stuff path values into the body.

### Parameter names differ by server

The remote server (and the Claude Code plugin) uses **snake_case**; the local `@withone/mcp` server uses **camelCase**. Your client shows the schema; follow it.

| Concept | Remote `https://mcp.withone.ai/mcp` | Local `npx @withone/mcp` | CLI |
|---|---|---|---|
| Platform slug | `platform` (search, knowledge) | `platform` (search, knowledge, **and execute**) | positional |
| Search intent | `agent_type`: `"execute"` / `"knowledge"` | `agentType` | `-t execute` / `-t knowledge` |
| Action id | `action_id` | `actionId` | positional |
| Connection key | `connection_key` | `connectionKey` | positional |
| Request body | `data` | `data` | `-d` |
| Path variables | `path_variables` | `pathVariables` | `--path-vars` |
| Query params | `query_params` | `queryParams` | `--query-params` |
| Extra headers | `headers` | `headers` | `--headers` |
| Form-encoded body | `is_form_url_encoded: true` | `isFormUrlEncoded: true` | `--form-url-encoded` |
| Multipart body | not supported yet | `isFormData: true` | `--form-data` |

The remote `execute_one_action` has no `platform` parameter; the connection key identifies it. The local server requires `platform`, `actionId` and `connectionKey` on execute (verified against `@withone/mcp` 1.2.4). The knowledge text ends with a "How to execute this action" block written in camelCase; that describes the concepts, the tool schema is what you send.

### Read the access field before you plan

`list_one_integrations` (and `one list`) stamp each connection with `access`:

- `{"policy": "full"}`: every action on the connection.
- `{"policy": "methods", "methods": ["GET"]}`: only those HTTP methods. `["GET"]` is read-only; plan a read-only answer and say so.
- `{"policy": "actions", "actions": [{"actionId", "title", "method"}, …]}`: exactly those actions. Use one directly and skip search.

Two more fields appear only when relevant: `"knowledgeOnly": true` (execute is disabled; read knowledge and write code instead) and `"unresolvedActionIds": [...]` (allowlisted ids that could not be looked up; treat as unavailable). If `execute_one_action` is not in your tool list at all, the user chose knowledge-only mode on the consent screen.

### Rules that keep calls reliable

- Always use the exact `actionId` from search results or `access.actions`. Never guess or construct one.
- Platform names are lowercase kebab-case.
- Omit optional parameters you do not need. Never send `null` for them.
- Before the first **write** in a task (send, create, update, delete, pay), state the platform, the action and the target in one line and let the user stop you. Reads need no confirmation. Never write to a platform the user did not ask you to touch.
- Do not retry a write blindly. A timeout or a gateway error can hide a write that went through. Read first (fetch the record, list the last few messages) and send the write again only when it is missing. For reads, if a call fails twice with the same error, change the request based on the error instead of repeating it.
- List actions are paginated. Fetch a bounded page (`limit`, `cursor`, `page`, `pageToken`, whichever the knowledge names), summarize it, and say it was a page.
- Chain reads before writes across platforms: pull from every source, reconcile, then write once per target.
- Report the created record's id or link, the count read, or the platform's response, so the user can verify.

### When a call fails

Most errors are the platform's own response passed through unchanged, so read the body. One's own errors look different and mean a setup problem: a `secret_middleware_error` 400 (a missing `x-one-action-id` on passthrough, or a key from the other environment), a 401 (bad or revoked key), a validation message from the CLI (a value in the wrong place), or a "not allowed" message from the local MCP server (outside `ONE_CONNECTION_KEYS`, `ONE_ACTION_IDS` or `ONE_PERMISSIONS`). Those do not go away by retrying.

| Status | Meaning | Do |
|---|---|---|
| 400 / 422 | Parameters do not match the schema | Re-read the knowledge, fix the field or its location, retry once |
| 401 / 403 | Connection lacks permission, scope, or needs re-auth; or `access` forbids it | Tell the user which platform; `one add <platform>` again or re-authenticate; do not retry |
| 404 | The id does not exist on that account | Verify with a read before assuming the action is wrong |
| 429 | Rate limited | Back off; batch instead of looping |
| "Missing required OAuth scope" | The One grant lacks the scope | Re-authorize the client |

Every call, request and response, is at https://app.withone.ai/logs.

## Beyond a single call

- **Parallel execute.** `one --agent actions execute --parallel gmail <id> <key> -d '{...}' -- slack <id> <key> -d '{...}'`. All segments are validated first; failures do not block the others.
- **Dry runs and mocks.** `--dry-run` shows the request without sending it; `--mock` returns an example response from the action schema, so you can build UI before wiring real data.
- **Flows.** Multi-step workflows as JSON at `.one/flows/<key>/flow.json` with action, transform, code, condition, loop, parallel, while, paginate, bash and sub-flow steps and `$.input.x` / `$.steps.id.response` selectors. `one flow scaffold basic` **prints a starter definition to stdout and writes nothing**; pipe it to a file, edit it, then `one flow create <key> --definition @flow.json` (or `--definition '<json>'`) to save it. Then `one flow validate <key>` and `one flow execute <key> -i name=value`, with `--dry-run`, `--stop-after <stepId>` and `one flow inspect <runId>` for debugging. A step names its connection **either** as `"connectionKey": "$.input.someKey"` **or** as `"connection": { "platform": "gmail" }`, never both; the scaffold uses the second form, which resolves at run time. Read `one guide flows` before writing one; never guess the schema.
- **Relay (inbound webhooks).** A relay receives events from a source platform (Stripe, GitHub, Airtable, Attio, Google Calendar and 80+ more) and forwards them to another platform's action, an agent, or a URL, with Handlebars templates like `{{payload.data.object.email}}`. `one --agent relay platforms`, `relay event-types <platform>`, `relay create --connection-key <key> --create-webhook --event-filters '["customer.created"]'`, then `relay activate <id> --actions '[{"type":"passthrough","actionId":"…","connectionKey":"…","body":{…}}]'`. GitHub needs `--metadata '{"GITHUB_OWNER":"…","GITHUB_REPOSITORY":"…"}'`. Two flag traps: pass `--webhook-secret` on activate **only** when you created the endpoint without `--create-webhook` and registered the webhook yourself, since `--create-webhook` stores the right secret for you and passing another one breaks signature checks; and `relay events` filters by `--platform` / `--event-type` / `--after` / `--before` only, while `--endpoint-id` belongs to `relay deliveries`. Read `one guide relay` first.
- **Memory and sync (agents that learn).** `one mem add note '{"content":"…"}' --tags run --weight 7`, `one mem search "…"` (hybrid full-text + semantic once an OpenAI key is set via `one mem config set embedding.apiKey sk-…`), `one mem find-by-key email:jane@acme.com`. `one sync init <platform> <model>` then `one sync run <platform>` pulls platform data (Gmail threads, Stripe customers, Attio people…) into the same store, with `one sync schedule add <platform> --every 1h`. Read `one guide memory` and `one guide sync`.
  - `one mem` needs a real config file. `ONE_SECRET` in the environment is not enough: without `~/.one/config.json` it exits with "No One config found", so run `one init` first.
  - The first `one mem` call downloads and bootstraps an embedded Postgres and takes about 25 seconds. It has not hung. The cluster stays running as a daemon afterwards (`~/.one/pg/.pgserve.json`), so later calls are fast.
  - `sync run` fails with "Multiple `<platform>` connections found" when the account has more than one untagged connection for that platform. Either put an explicit `"connectionKey"` in the profile, or create the connection with `one add <platform> --tag <name>` and add `"tag": "<name>"` next to `"platform"` in the profile's `connection` block.

## Scoping and environment variables

The two runtimes read their scoping from different places. Getting this wrong is silent: the setting is simply ignored.

| Setting | Local MCP server (`@withone/mcp`) | CLI (`one`) |
|---|---|---|
| `ONE_SECRET` | environment | environment, then `.onerc`, then `~/.one/projects/<slug>/config.json`, then `~/.one/config.json` |
| `ONE_CONNECTION_KEYS` (allowlist of connections the agent may see and use) | environment | **not read from the environment.** Put it in `.onerc` in the working directory, or run `one config` |
| `ONE_PERMISSIONS` (`read` = GET only; `write` = GET/POST/PUT/PATCH; `admin` = everything, the default) | environment | `.onerc` or `one config` only |
| `ONE_ACTION_IDS` (only these actions are visible and executable) | environment | `.onerc` or `one config` only |
| `ONE_KNOWLEDGE_AGENT=true` (removes `execute_one_action`; code-generation mode) | environment | `.onerc` or `one config` only |
| `ONE_BASE_URL` | environment (only here; never set it to an empty string) | ignored; the CLI uses `apiBase` from its config |
| `ONE_CACHE_TTL` (knowledge/search cache, default 1 hour; execution is never cached) | ignored | environment |
| `.onerc` file (KEY=VALUE, working directory only) | ignored | read |

So for a crew or a script that starts `npx -y @withone/mcp`, export the variables. For the CLI, write a `.onerc` next to your project (add it to `.gitignore`) or run `one config`, which writes the same scoping into every installed agent config at once; `one config path` shows which config is active. The remote server takes the same choices from the consent screen and enforces them server-side.

> **Known issues in `@withone/mcp` 1.2.4 (verified 2026-09-09; re-check for a newer release).**
> 1. `execute_one_action` builds the outgoing request as `{ ...serverHeaders, "x-one-connection-key": connectionKey, "x-one-action-id": id, ...headers }`, so the caller's `headers` argument is applied **after** the `ONE_CONNECTION_KEYS`, `ONE_ACTION_IDS` and `ONE_PERMISSIONS` checks and can override `x-one-connection-key`, `x-one-action-id` or `x-one-secret`. An agent that puts a non-allowlisted connection key in `headers` reaches it. Treat the allowlist as a guardrail against an agent's mistakes, not as a security boundary, keep the crew's task descriptions away from the `headers` parameter, and use the CrewAI wrapper below, which strips any `x-one-*` header. The remote server enforces the consent grant server-side and is not affected by this.
> 2. When a passthrough call fails (4xx/5xx), the local server logs the whole error object, including the plaintext `x-one-secret`, to **stderr**. The tool result is redacted; the log line is not. Do not ship the server's stderr to shared logs.

## You.com via One

One exposes You.com as the platform `you`. Connect it once and your agent searches the web, runs deep research, and reads pages through the same four tools it uses for every other app. Get a key at https://api.you.com, then `one add you` and `one --agent list --search you`.

| Family | What it gives you | Fields go in |
|---|---|---|
| Search (GET and POST variants) | Web and news results for a query: `url`, `title`, `description`, `snippets[]` per hit | query params (GET) or body (POST) |
| Get Web Page Contents | The full clean text of URLs you already have | body |
| Research | One written answer to a complex question plus the `sources[]` it used | body |
| Finance Research | Same as Research, tuned for public companies, stocks, markets | body |
| Account | Your remaining You.com balance | none |

Never hardcode an action ID. Find it at build time and read its knowledge:

```bash
one --agent actions search you "search web and news" -t execute
one --agent actions knowledge you <actionId>
```

The GET and POST `/v1/search` actions share the title "Search Unified Web and News Results", so **pick by method, not by name**. GET takes its fields in `queryParams`; POST takes the same fields in `data`. Resolve ids by method so the pair cannot bite you:

```bash
SEARCH=$(one --agent actions search you "search web and news" -t execute | jq -r '.actions[] | select(.method=="GET") | .actionId')
RESEARCH=$(one --agent actions search you "research" -t execute | jq -r '.actions[] | select(.path=="/v1/research") | .actionId')
```

**Example 1: research a company, then email the summary.** The agent searches `you` for the web search action, reads its knowledge, then executes (remote parameter names shown; local uses `actionId` / `connectionKey` / `queryParams`):

```json
{
  "action_id": "<actionId of GET /v1/search>",
  "connection_key": "<connectionKey>",
  "query_params": { "query": "Vercel news", "count": 5 }
}
```

The reply has `results.web[]` and `results.news[]`. The agent picks a hit, writes two sentences citing it, then searches the `gmail` platform for the send action and calls it the same way. Keep `queryParams` to exactly `query` and `count`; when an LLM adds filters on its own, You.com returns 422.

**Example 2: answer a question with sources, then post it to Slack.** For "compare CrewAI and LangGraph for a multi-agent pipeline" a single search is not enough. Research runs several searches, reads the pages, and returns one written answer plus the sources it used:

```bash
one --agent actions execute you <researchActionId> <connectionKey> \
  -d '{"input": "Compare CrewAI and LangGraph for building a multi-agent sales research pipeline.", "research_effort": "standard"}'
```

The reply is `output.content` (the answer) and `output.sources[]` (`url`, `title`, `snippets[]`). Post both to Slack with the same `actions execute` on the `slack` platform. Research takes longer than search; give it a minute. `research_effort` runs from `lite` to `exhaustive`; `standard` is the right default.

**Example 3: found a page, now read the whole thing.** Search returns snippets. When the agent needs the full article behind one hit, it searches `you` for the Get Web Page Contents action and reads its knowledge. The body takes **two** required fields, not one: `urls` (an array, even for a single page) and `formats` (an array of `html`, `markdown`, `metadata`). Sending only the URL is rejected.

```json
{ "urls": ["https://example.com/the-article"], "formats": ["markdown"] }
```

Back comes clean text ready to summarize.

Gotchas:

- Search (GET) fields go in `--query-params` / `query_params`, never in `-d` / `data`. The body-taking actions are the reverse.
- On Search, do not combine `include_domains` with `exclude_domains` or `boost_domains`. You.com returns 422.
- Research and Finance Research take domain lists as arrays inside `source_control`; Search takes one comma-separated string.

## Parasail with One

Parasail is not a platform on One. It is where the model runs. Parasail serves open models behind an OpenAI-compatible API, so your agents think on Parasail and act through One's four tools. Nothing to connect with `one add`.

**Setup.** Get a key at https://www.saas.parasail.io/keys and add it to `.env`:

```text
PARASAIL_API_KEY=<parasailKey>
```

- Base URL: `https://api.parasail.io/v1`
- Auth: `Authorization: Bearer $PARASAIL_API_KEY`
- Any OpenAI SDK works: set `base_url` to the Parasail URL and `api_key` to your key.

**Pick a model that calls tools.** Agents on One need a model that supports tool (function) calling. Model ids change, so list them at build time instead of hardcoding one:

```bash
curl -s https://api.parasail.io/v1/models -H "Authorization: Bearer $PARASAIL_API_KEY" | jq -r '.data[].id'
```

Check https://docs.parasail.io/parasail-docs/guides/tool-function-calling.md for which ones support tools (at the time of writing it lists `parasail-kimi-k26`, `parasail-deepseek-v4-flash`, `parasail-qwen3p6-35b-a3b` and `parasail-glm-52`, among others) and https://docs.parasail.io/parasail-docs/products/overview/models.md for context windows and prices. Try your pick with one tool call before wiring a whole crew.

**Example 1: a CrewAI crew on Parasail.** Swap the `LLM` in the CrewAI example below. Everything else (One's tools, `dropping_nulls`, `harden_execute`, the `RULES` string) stays the same.

```python
import os
from crewai import LLM

llm = LLM(
    model="<parasail-model-id>",           # the bare id, e.g. parasail-kimi-k26
    provider="openai",                     # CrewAI's native OpenAI-compatible client
    base_url="https://api.parasail.io/v1",
    api_key=os.environ["PARASAIL_API_KEY"],
)
```

Write it exactly this way. `model="openai/<id>"` without `provider` raises `ImportError` on plain `crewai` (it falls through to LiteLLM, which is not installed), and `provider="openai"` together with an `openai/` prefix sends the literal `openai/<id>` to Parasail. CrewAI also assumes a window of about 7k tokens for model ids it does not recognise, so long crews get summarised early; the track templates (`parasail.py`) show how to raise it.

**Example 2: plain Python, one call with a tool.** Useful for a generative UI step where you want structured output, not a crew.

```python
import os
from openai import OpenAI

client = OpenAI(base_url="https://api.parasail.io/v1", api_key=os.environ["PARASAIL_API_KEY"])

response = client.chat.completions.create(
    model="<parasail-model-id>",
    messages=[{"role": "user", "content": "Summarize these incident logs as JSON: <logs>"}],
    response_format={"type": "json_object"},
)
print(response.choices[0].message.content)
```

Gotchas:

- If an agent never calls a tool, the model probably does not support tool calling. Pick another from the models list.
- On the Responses API (`/v1/responses`), set `store: false` on every request. Parasail does not keep server-side state.
- Keep model output that must be exact (a Gmail `raw` value, a date format) in a plain Python `@tool`, the same rule as the CrewAI example.

## CrewAI with One

CrewAI is not a platform on One; it is the program that runs your agents in order and passes each one's output to the next. `@withone/mcp` is the small Node program that exposes One's four tools; CrewAI runs it as a local child process through `MCPServerAdapter` and hands those tools to your agents, which can then act on any app you have connected. Two small fixes make those tool calls reliable inside CrewAI.

**Setup.** Python 3.10 to 3.13 (3.14 does not work yet), Node 18+, the `one` CLI signed in, and the platforms you need connected with `one add <platform>`. 3.12 or 3.13 is the smoothest; on 3.10 or 3.11 pip installs a slightly older `mcpadapt` (0.1.19), which works but is one version behind. Check your setup before writing any code: `one --agent list --search <platform>` for each platform the crew will use, and confirm an `operational` row whose `platform` field is exactly the one you want (`--search` matches substrings, so `you` also returns `youtube-data`) with a `live::<platform>::default::<32hex>` key.

`requirements.txt`. These are exact pins, not floors: `crewai>=0.140.0` resolves to 1.15.20 today, which is not the version this was tested on, and `dropping_nulls` below reaches into a pydantic internal that can shift between releases. `crewai` and `crewai-tools` move in lockstep, so keep them equal. `mcp~=1.26.0` is what crewai 1.15.2 itself requires (mcp 2.x breaks the adapter).

```text
crewai==1.15.2
crewai-tools[mcp]==1.15.2
mcp~=1.26.0
mcpadapt>=0.1.9,<0.2
python-dotenv
```

`.env`. `ONE_SECRET` is the same key the `one` CLI uses. `ONE_CONNECTION_KEYS` is an allowlist: the crew only sees the connections you name here (see the known-issue note under Scoping for its limits). The local MCP server reads both from the environment, which `load_dotenv()` fills.

```text
PARASAIL_API_KEY=<parasailKey>
ONE_SECRET=<oneSecret>
ONE_CONNECTION_KEYS=live::you::default::<32hex>,live::gmail::default::<32hex>
```

```bash
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
npx -y @withone/mcp --help   # downloads the MCP server once so the first crew run is not slow
```

**Wiring.** Three functions. `one_mcp_params` starts the MCP server. `dropping_nulls` fixes one problem: CrewAI sends unset optional fields as `null`, and One's server rejects `null`. `harden_execute` fixes another: JSON-object arguments sometimes arrive as `{}` through CrewAI, so it takes them as JSON strings and parses them right before the call. It passes every execute parameter through (`headers`, `isFormData`, `isFormUrlEncoded` included) and strips any `x-one-*` header, which closes the header-override hole described under Scoping. Apply both before building agents.

```python
import base64, json, os
from email.mime.text import MIMEText
from crewai import LLM, Agent, Crew, Process, Task
from crewai.tools import tool
from crewai_tools import MCPServerAdapter
from dotenv import load_dotenv
from mcp import StdioServerParameters

load_dotenv()

def one_mcp_params() -> StdioServerParameters:
    return StdioServerParameters(command="npx", args=["-y", "@withone/mcp"], env={**os.environ})

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
        """Execute an API action on a connected platform via One. Pass request parts as JSON-encoded STRINGS. Omit or pass "" for parts the action does not need."""
        kwargs = {"platform": platform, "actionId": actionId, "connectionKey": connectionKey}
        for key, raw in (("data", dataJson), ("pathVariables", pathVariablesJson), ("queryParams", queryParamsJson), ("headers", headersJson)):
            if raw and raw.strip() and raw.strip() != "{}":
                kwargs[key] = json.loads(raw)
        if "headers" in kwargs:  # never let the model override One's own headers (connection key, action id, secret)
            kwargs["headers"] = {k: v for k, v in kwargs["headers"].items() if not k.lower().startswith("x-one-")}
        if isFormData:
            kwargs["isFormData"] = True
        if isFormUrlEncoded:
            kwargs["isFormUrlEncoded"] = True
        return mcp_execute._run(**kwargs)
    return [t for t in tools if t.name != "execute_one_action"] + [execute_one_action]
```

After `harden_execute`, the agent-facing `execute_one_action` takes `dataJson`, `pathVariablesJson`, `queryParamsJson`, `headersJson`, `isFormData` and `isFormUrlEncoded`. Write task descriptions against those names.

**Example: research a topic, then email the summary.** Two agents. The Researcher searches the web through One's `you` platform. The Sender emails the result through One's `gmail` platform. Both get the same four tools; the task descriptions tell each which platform to use. Anything that must be exact down to the last character (Gmail's base64 `raw` field, a date format) belongs in a plain `@tool` function, not in the LLM. `build_gmail_raw` is that function here.

```python
@tool("build_gmail_raw")
def build_gmail_raw(to: str, subject: str, body: str) -> str:
    """Build the base64url raw value Gmail's send action requires. Always use this tool; never hand-encode."""
    message = MIMEText(body)
    message["To"] = to
    message["Subject"] = subject
    return base64.urlsafe_b64encode(message.as_bytes()).decode()

RULES = (
    "Before executing any One action, call get_one_action_knowledge and read it. "
    "Omit optional tool parameters entirely; never pass null. "
    "Never call execute_one_action with an empty dataJson when the action needs a body. "
    "If a call fails twice with the same error, change the request based on the error instead of repeating it."
)

def build_crew(one_tools) -> Crew:
    llm = LLM(model="<parasail-model-id>", provider="openai", base_url="https://api.parasail.io/v1",
              api_key=os.environ["PARASAIL_API_KEY"])  # see "Parasail with One"

    researcher = Agent(role="Researcher", goal="Find three recent facts about {topic}, each with a source URL",
                       backstory="A careful researcher who only reports facts found in search results. " + RULES,
                       tools=one_tools, llm=llm, max_iter=25, verbose=True)
    sender = Agent(role="Sender", goal="Email the research summary through Gmail",
                   backstory="A careful operator. " + RULES,
                   tools=[*one_tools, build_gmail_raw], llm=llm, max_iter=25, verbose=True)

    research = Task(agent=researcher, expected_output="Three facts about {topic}, each with a source URL.", description=(
        "Research {topic}. On the 'you' platform, find the 'Search Unified Web and News Results' action that is GET /v1/search, "
        "read its knowledge, then execute it. queryParamsJson must be exactly {\"query\": \"<terms>\", \"count\": 5}."))
    send = Task(agent=sender, context=[research], expected_output="The Gmail message id, or what failed.", description=(
        "Email the research summary to {to} via Gmail through One. Search the 'gmail' platform for the send action, read its "
        "knowledge, call build_gmail_raw for the encoded message, then execute the send action with dataJson "
        "{\"raw\": \"<output of build_gmail_raw>\"} and pathVariablesJson {\"userId\": \"me\"}."))

    return Crew(agents=[researcher, sender], tasks=[research, send], process=Process.sequential, verbose=True)

if __name__ == "__main__":
    with MCPServerAdapter(one_mcp_params(), connect_timeout=120) as one_tools:
        one_tools = harden_execute(dropping_nulls(list(one_tools)))
        print(build_crew(one_tools).kickoff(inputs={"topic": "Anthropic", "to": "<yourEmail>"}))
```

Run `python main.py` and watch the log: the Researcher finds the search action, reads its knowledge, calls it; the Sender finds Gmail's send action, builds the raw message, calls it; an email lands in your inbox. Expect a couple of minutes, not seconds.

Two habits from this example worth keeping. One task, one outcome: a single "create the contact and send the email" task ran out of steps in practice, and splitting it fixed that. And the `RULES` string in every backstory is what stops agents from guessing parameters or retrying the same failing call.

**Swarm pattern (Exorcism Protocol).** A swarm is a crew where no single agent sees everything. Give each agent only the tools and connections its role needs, and make them share what they learn through one place every agent can read.

- One role, one slice of tools. Build each agent's tool list from the same MCP session, but tell each one in its backstory which platforms it may use. To hard-limit an agent, start a second `MCPServerAdapter` with its own `ONE_CONNECTION_KEYS` in `env` and give that agent only those tools.
- One shared channel. Pick a Slack channel or a Notion database as the swarm's memory. Every agent posts what it saw and reads the channel before acting.
- One decider. Use `Process.hierarchical` with a manager agent (the Dispatcher) so actions get coordinated, not duplicated.
- Score yourself the way the judges do: time to containment, false alarms, civilians saved. Log all three every run.

## Embed One in your product (One Connect)

Everything above is about **your** agent acting on **your** connections. When the thing you are building is a product whose **users** should connect **their own** Gmail, Slack, Notion or Stripe to it, use **One Connect**: a drop-in OAuth 2.1 flow (authorization code + PKCE) in which your user grants your app scoped, revocable access to their own One-connected tools. The user owns the connections in their One account. You hold a bearer token scoped to exactly what they granted, they can narrow or revoke it at any time, and One enforces the grant on every call.

Connect is not Auth. `@withone/auth` (AuthKit in the dashboard) puts connections in **your** One project, so you own them. Connect puts them in the **user's** One account and hands you a grant. For a hackathon product where each user brings their own accounts, Connect is the shape you want.

What you build is one button and two backend routes. Everything sensitive (state, the PKCE verifier, your client secret, the tokens) lives on your server; the SDK only navigates the tab to One's hosted connect page and watches for `?one_connect=success` on the way back, so there is no completion page to build.

1. **Create the OAuth app** at https://app.withone.ai → Settings → OAuth Apps → New OAuth app (client type Confidential). You get a Client ID and a Client Secret (shown once, server-only), register an `https` redirect URI that must match your callback route exactly, pick the access-token lifetime (7 days, 30 days, 90 days or 1 year), and optionally a permission set that pre-fills the consent screen (users can only narrow it). Env: `ONE_CLIENT_ID`, `ONE_CLIENT_SECRET`, `ONE_REDIRECT_URI`, optional `ONE_PERMISSION_SET`.
2. **The button.** `npm i @withone/connect`, then `<ConnectButton authorizeUrl="/api/one/authorize" platforms={[{ name: "Stripe" }]} onSuccess={…} />` from `@withone/connect/react` (Vue, Svelte and a plain `<one-connect-button>` custom element exist too), or the headless `useOneConnect({ authorize: { url }, onSuccess })` hook on your own element. Platform logos derive from `https://assets.withone.ai/connectors/<slug>.svg`.
3. **`GET /api/one/authorize`** mints `state` and a PKCE verifier, stores the verifier in an httpOnly cookie named per flow (`one_tx_<state>`, `path: "/"`, 10-minute expiry), and 302s to `https://api.withone.ai/oauth/authorize` with `client_id`, `redirect_uri`, `response_type=code`, all six tenancy scopes (`user:` / `org:` / `project:` `connections:read` and `:write`), `state`, `code_challenge`, `code_challenge_method=S256`, optional `permission_set` and `login_hint`.
4. **`GET /api/one/callback`** verifies that the returned `state` has its cookie (no cookie means forged or stale, so never exchange the code), then POSTs `grant_type=authorization_code` to `https://api.withone.ai/oauth/token` with **HTTP Basic** client auth (`client_secret_post` is not supported), stores `access_token`, `refresh_token` and `expiresAt` encrypted and keyed by your own user id, and redirects to any same-origin URL with `?one_connect=success` (or `?one_connect=error&one_connect_message=…`).
5. **Check before every call; refresh near expiry, and on a schedule.** Before each call compare `expiresAt` against now and refresh only when it is close, rather than refreshing every time. Access tokens live for the lifetime you chose; refresh tokens live 30 days from their last use and **rotate on every use**, so always store both new tokens. With a 90-day or 1-year access token the refresh token can expire long before the access token does, and the user then has to reconnect, so also refresh on a schedule (a fortnightly cron job is enough) rather than only when the access token is near expiry. Reusing an old refresh token revokes the whole family. Serialize refreshes per user.
6. **Use the grant** with `Authorization: Bearer <token>` on One's normal API: `GET /v1/connections/reachable` lists only what the user granted, each row with its `key` and `access` policy; `GET /v1/knowledge?connectionPlatform=<platform>&limit=100&page=N` lists actions; `{method} /v1/passthrough{path}` with `x-one-connection-key` and `x-one-action-id` executes. The same bearer authenticates the remote MCP server at `https://mcp.withone.ai/mcp` with the same four tools and the same grant. The One CLI does **not** accept grant tokens; use HTTP or MCP for a user's grant.

Two status codes carry the whole security model: **401** means the token is expired, revoked or invalid, so clear the stored tokens and show "Reconnect"; **403** means the call is outside what the user granted, so do not retry. The user chose that.

The full playbook (button variants, both routes verbatim, refresh with rotation handling, and a five-point done checklist) is the `one-connect` skill in the Connect repo. Install it next to this one:

```bash
npx skills add withoneai/connect
```

Or read it at https://github.com/withoneai/connect/blob/main/skills/one-connect/SKILL.md; the repo README (https://github.com/withoneai/connect) has the same routes with a sequence diagram.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| The four tools do not appear, or every call is 401 (remote) | The client is not authenticated with One | Re-authenticate the One server in the client (Claude Code: `/mcp` → One → Authenticate) |
| `execute_one_action` is missing | Knowledge-only mode was chosen on the consent screen | Clear authentication and sign in again with execution enabled, or write code instead |
| A platform is not listed | Not connected, or not selected on the consent screen, or wrong environment | `one add <platform>`; re-authenticate to widen the scope; check `live` vs `test` |
| `list_one_integrations` returns `[]` from a script or crew | `ONE_SECRET` and your connections are from different One environments | Use a key from the same environment. `ONE_BASE_URL` is read by `@withone/mcp` only; the CLI ignores it |
| `expected boolean, received null` (CrewAI) | `dropping_nulls` not applied | Apply both helpers before building agents |
| Empty `data` reaching One from CrewAI | JSON-object args arrive as `{}` | Apply `harden_execute` and write tasks against `dataJson` / `pathVariablesJson` / `queryParamsJson` |
| MCP connect timeout on first run | `npx` is still downloading `@withone/mcp` | Run `npx -y @withone/mcp --help` once, or raise `connect_timeout` |
| "You are missing the 'mcp' package" | mcp 2.x installed | `pip install "mcp~=1.26.0"` |
| 422 from You.com search | Extra filters, or `include_domains` combined with `exclude_domains` / `boost_domains` | Send only `query` and `count`; drop the conflicting domain lists |
| 400 / 422 from any platform | Request does not match the schema | Re-read the knowledge; move values to the right place; retry once |
| Slow `one` commands | Cold cache | Knowledge and search are cached for an hour under `~/.one/cache/`; `one cache list`, `one cache clear` |

## Track playbooks

Every team builds with You.com, One, CrewAI and Parasail. Here is how they fit for each track.

### The Exorcism Protocol (autonomous agent swarms)

A paranormal outbreak spreads through a live facility simulation. Your swarm must sense, share intel and coordinate containment in real time. Judges score containment speed, false-alarm rate and civilians saved.

- **CrewAI** runs the swarm: three or more agents with distinct roles (for example Sentinel, Analyst, Dispatcher) and only partial knowledge each. Use the swarm pattern under "CrewAI with One".
- **Parasail** runs every agent's model. See "Parasail with One".
- **One** is how agents act and talk: post sightings to Slack, file each containment in Linear, keep shared state in Notion. Scope each agent's connections with `ONE_CONNECTION_KEYS`.
- **You.com** gives agents outside context when the sim calls for it: search for live reports, read a page, research a threat.
- Starting point: https://github.com/withoneai/you-hackathon/tree/main/templates/exorcism-swarm. The facility simulation and scoreboard come from You.com's starter repo, which is not public yet (ask in the Discord); the template ships a small local mock feed until then.

### The Haunted Dashboard (generative UI pipelines)

Take real-time, unstructured "Spooky Incident Logs" and build a working Spooky Tactical Command Station on the fly, served over WebSockets.

- **You.com** brings in live data: Search or Get Web Page Contents for the incident feed and any context it needs.
- **CrewAI** splits the work: one agent structures the logs, one decides what the dashboard should show, one writes the UI.
- **Parasail** runs the inference, including the step that generates the UI. Ask for JSON (`response_format`) so the server can render it.
- **One** handles every action the dashboard triggers: alerts to Slack, tickets to Linear, a daily brief by Gmail.
- Starting point: https://github.com/withoneai/you-hackathon/tree/main/templates/haunted-command-station.

Keep `ONE_CONNECTION_KEYS` tight, confirm before writes, and read the knowledge every time. Ask in the Discord when stuck: https://discord.gg/pn8QmHQ4p. The One engineers are there all day.
