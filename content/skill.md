---
name: one-hackathon
description: |
  Build with One at You.com's "Build with YOU: The Live Web Agent Hackathon" (New York, September 11, 2026). One is the trust layer between AI agents and the apps they act on: 780+ platforms (Gmail, Slack, Notion, GitHub, Linear, Stripe, You.com, Daytona and more) behind four tools, with managed auth, access control and an audit log. This skill covers setup (remote MCP server, CLI, local MCP server, API), the list → search → knowledge → execute loop every call follows, scoping, and playbooks for You.com, Daytona and CrewAI through One.

  TRIGGER when the user wants to:
  - Set up One, install the One CLI, or connect an agent (Claude Code, Cursor, Codex, ChatGPT, Claude, OpenClaw, Hermes, Kiro, Gemini CLI, CrewAI) to One's MCP server
  - Take ANY action in a third-party app: send an email, post to Slack, create a Linear issue, read a calendar, look up a customer, run code somewhere safe
  - Search the web, research a topic or company, or read a page with You.com through One
  - Create, run commands in, upload files to, or tear down a Daytona sandbox through One
  - Build a CrewAI crew whose agents act on real apps through One, or fix "expected boolean, received null" and empty-data errors from One tools inside CrewAI
  - Let the users of a product connect their own apps to it (One Connect: an OAuth app, `@withone/connect`, two backend routes)
  - Redeem the hackathon coupon, or find the One dashboard, docs, logs or Discord

  DO NOT TRIGGER for:
  - Calling the You.com or Daytona APIs directly with their own SDKs and keys, with no One involved
  - CrewAI questions that have nothing to do with tools or integrations
---

# Build with One (hackathon edition)

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
| Hackathon perk: **a free month of One Pro for every builder** | code `1U-PRO`, entered at checkout on the Pro plan. The winning team gets a free year (second place six months, third place three) |
| Remote MCP server (Streamable HTTP, OAuth) | `https://mcp.withone.ai/mcp` |
| Docs | https://www.withone.ai/docs/welcome · CLI https://www.withone.ai/docs/cli · MCP https://www.withone.ai/docs/mcp · Install guides https://www.withone.ai/docs/install · Relay https://www.withone.ai/docs/relay |
| Every platform and action, searchable | https://www.withone.ai/knowledge |
| One Connect (let your users connect their own apps) | https://github.com/withoneai/connect · skill: `npx skills add withoneai/connect` |
| This skill (latest version) | https://hackathon.withone.ai/skill.md · rendered at https://hackathon.withone.ai/skill |
| Hackathon page and Discord | https://hackathon.withone.ai (the Discord link is in the header and the Help section) |
| Event page | https://luma.com/agentic-hackathon-ny |

Platform slugs are lowercase kebab-case: `gmail`, `slack`, `google-calendar`, `hub-spot`, `you`, `daytona`. Run `one platforms` or browse the knowledge base to find one.

## Pick your path

| Your agent lives in… | Use | Why |
|---|---|---|
| An editor or chat client (Claude Code, Cursor, Codex, ChatGPT, Claude, OpenClaw, Hermes, Kiro, Gemini CLI) | **A. Remote MCP server** | Nothing to install, OAuth sign-in in the browser, scope exactly what the client may touch on the consent screen |
| A terminal, a shell script, a cron job, or you need to connect platforms | **B. The CLI** | `one add <platform>` lives here; `--agent` gives JSON for anything that can run a command |
| A Python or Node framework such as CrewAI, LangChain, Mastra, the Vercel AI SDK | **C. Local MCP server** (`npx -y @withone/mcp` + `ONE_SECRET`) | Frameworks cannot complete a browser OAuth flow; the local server takes a key from the environment |
| Application code you are shipping | **D. Passthrough API or `@withone/sdk`** | Two headers, no per-platform tokens or refresh logic in your code |
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

Every action is also a plain HTTP call through One's proxy. Base URL `https://api.withone.ai`. Headers: `x-one-secret` (your key) and `x-one-connection-key` (the connection to act on). The path after `/v1/passthrough/` is the action's own path, which you get from its knowledge.

```ts
const res = await fetch(
  "https://api.withone.ai/v1/passthrough/v1/search?query=self-repairing+agents&count=5",
  {
    headers: {
      "x-one-secret": process.env.ONE_SECRET!,
      "x-one-connection-key": process.env.ONE_YOU_CONNECTION_KEY!,
    },
  },
);
```

Typed Node SDK (`npm i @withone/sdk`, Node 18+):

```ts
import { One, gmail } from "@withone/sdk";

const one = new One(process.env.ONE_SECRET!); // or One.fromEnv()
const res = await one
  .connection(process.env.ONE_GMAIL_CONNECTION_KEY!)
  .run(gmail.createUsersDraft({ path: { userId: "me" }, body: { message: { raw: base64Email } } }));
```

Keys belong in the environment, never in source. Add the variable names to `.env.example`. Browser bundles cannot hold a One secret; route through a server.

## Connect platforms

Connections are made once, then shared by every path above.

```bash
one add you            # You.com: paste the key from https://api.you.com
one add daytona        # Daytona: paste the key from https://app.daytona.io/dashboard/keys
one add gmail          # OAuth platforms open the browser
one add slack --tag work   # tag when you will have several accounts on one platform
```

Or use the Connect page at https://app.withone.ai. Then verify:

```bash
one --agent list --search you
```

One row with an `operational` status and a key like `live::you::default::<32hex>` means you are ready; that key is `<connectionKey>` everywhere below. **Empty output means the platform is not connected, or your key belongs to a different One environment (`live` vs `test`) than your connections.** Most "my code is broken" time in a short hackathon is really this. Keys are `sk_live_` for production and `sk_test_` for sandbox; connections created in one environment are invisible from the other.

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
2. **Search by outcome.** `query` describes what you want to happen ("send an email", "create a sandbox", "search web and news"), not an endpoint name. Pass `agent_type: "execute"` when the user wants something done, `"knowledge"` when they want code or documentation. If nothing fits, broaden the query. When several actions share a title, pick by `method` and `path`.
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
- Never retry a write more than once. The first attempt may have succeeded. If a call fails twice with the same error, change the request based on the error instead of repeating it.
- List actions are paginated. Fetch a bounded page (`limit`, `cursor`, `page`, `pageToken`, whichever the knowledge names), summarize it, and say it was a page.
- Chain reads before writes across platforms: pull from every source, reconcile, then write once per target.
- Report the created record's id or link, the count read, or the platform's response, so the user can verify.

### When a call fails

The error comes from the platform, not from One. Read it.

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
- **Flows.** Multi-step workflows as JSON at `.one/flows/<key>/flow.json` with action, transform, code, condition, loop, parallel, while, paginate, bash and sub-flow steps and `$.input.x` / `$.steps.id.response` selectors. `one flow scaffold basic`, `one flow validate <key>`, `one flow execute <key> -i name=value`, `--dry-run`, `--stop-after <stepId>`, `one flow inspect <runId>`. Read `one guide flows` before writing one; never guess the schema.
- **Relay (inbound webhooks).** A relay receives events from a source platform (Stripe, GitHub, Airtable, Attio, Google Calendar and 80+ more) and forwards them to another platform's action, an agent, or a URL, with Handlebars templates like `{{payload.data.object.email}}`. `one --agent relay platforms`, `relay event-types <platform>`, `relay create --connection-key <key> --create-webhook --event-filters '["customer.created"]'`, then `relay activate <id> --actions '[{"type":"passthrough","actionId":"…","connectionKey":"…","body":{…}}]'`. GitHub needs `--metadata '{"GITHUB_OWNER":"…","GITHUB_REPOSITORY":"…"}'`. Never pass `--webhook-secret` on activate. Read `one guide relay` first.
- **Memory and sync (agents that learn).** `one mem add note '{"content":"…"}' --tags run --weight 7`, `one mem search "…"` (hybrid full-text + semantic once an OpenAI key is set via `one mem config set embedding.apiKey sk-…`), `one mem find-by-key email:jane@acme.com`. `one sync init <platform> <model>` then `one sync run <platform>` pulls platform data (Gmail threads, Stripe customers, Attio people…) into the same store, with `one sync schedule add <platform> --every 1h`. Read `one guide memory` and `one guide sync`.

## Scoping and environment variables

Local server and CLI read these from the environment, a `.onerc` in the working directory, the project config (`~/.one/projects/<slug>/config.json`) or the global config (`~/.one/config.json`), in that order. The remote server takes the same choices from the consent screen and enforces them server-side.

| Variable | Values | Effect |
|---|---|---|
| `ONE_SECRET` | `sk_live_…` / `sk_test_…` | The only credential. Redacted from every response |
| `ONE_CONNECTION_KEYS` | comma-separated keys | Allowlist: the agent can only see and use these connections. **Set it for any crew or script**; a confused agent cannot reach anything else, and `list_one_integrations` stays fast on big accounts |
| `ONE_PERMISSIONS` | `read` / `write` / `admin` (default) | `read` = GET only; `write` = GET/POST/PUT/PATCH; `admin` = everything |
| `ONE_ACTION_IDS` | comma-separated ids | Only these actions are visible and executable |
| `ONE_KNOWLEDGE_AGENT` | `true` | Removes `execute_one_action` entirely (code generation mode) |
| `ONE_BASE_URL` | URL | Read by `@withone/mcp` **only**; the CLI ignores it and uses `apiBase` from its config. Leave it unset unless you are on a non-default One environment, and never set it to an empty string |
| `ONE_CACHE_TTL` | seconds | Knowledge/search cache TTL (default 1 hour). Execution is never cached |

Add `.onerc` to `.gitignore`. `one config` writes the same scoping into every installed agent config at once; `one config path` shows which config is active.

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

**Example 3: found a page, now read the whole thing.** Search returns snippets. When the agent needs the full article behind one hit, it searches `you` for the page contents action, reads its knowledge for the body field name, and sends that hit's `url`. Back comes clean text ready to summarize.

Gotchas:

- Search (GET) fields go in `--query-params` / `query_params`, never in `-d` / `data`. The body-taking actions are the reverse.
- On Search, do not combine `include_domains` with `exclude_domains` or `boost_domains`. You.com returns 422.
- Research and Finance Research take domain lists as arrays inside `source_control`; Search takes one comma-separated string.

## Daytona via One

One exposes Daytona as the platform `daytona`: the sandbox management side (create, start, stop, delete, snapshots, volumes) and the inside-the-sandbox side (run a command, run code, files, git, terminal sessions, computer use). A sandbox sits in the same connection list and activity log as every other app, and `ONE_CONNECTION_KEYS` limits which Daytona account an agent can touch. Get a key at https://app.daytona.io/dashboard/keys, then `one add daytona` and `one --agent list --search daytona`.

| Family | What it covers | Path variable |
|---|---|---|
| Sandboxes | Create, start or resume, stop, delete, fork, SSH access, secrets | `sandboxIdOrName` |
| Snapshots, volumes | The images a sandbox boots from; shared storage to mount | |
| Process | Execute a shell command, run a code snippet, interpreter contexts, shell sessions, PTY | `sandboxId` |
| Files | Upload, download, list, search, find text | `sandboxId` |
| Git | Clone, init, add, branch, checkout, remotes | `sandboxId` |
| Computer use | Screenshots, mouse, keyboard, recordings | `sandboxId` |
| Organizations, API keys, regions, runners | Account and infrastructure management | |

Sandbox actions take the id as `sandboxIdOrName`; every inside-the-sandbox action takes it as `sandboxId`. Same value, two names. Resolve the three ids you need instead of pasting them:

```bash
CREATE=$(one --agent actions search daytona "create sandbox" -t execute | jq -r '.actions[0].actionId')
EXEC=$(one --agent actions search daytona "execute command in sandbox" -t execute | jq -r '.actions[0].actionId')
DELETE=$(one --agent actions search daytona "delete sandbox" -t execute | jq -r '.actions[0].actionId')
```

Check `.actions[]` first when several match; `actions[0]` is not always the one you want.

**Example 1: create, run, delete from the CLI.** Handy for checking the connection before wiring an agent.

```bash
KEY=<connectionKey>

SANDBOX_ID=$(one --agent actions execute daytona "$CREATE" "$KEY" \
  --skip-validation -d '{"name":"hack-box","ttlMinutes":30}' | jq -r .response.id)

one --agent actions execute daytona "$EXEC" "$KEY" \
  --path-vars "{\"sandboxId\":\"$SANDBOX_ID\"}" \
  -d '{"command":"python3 --version && echo hello-from-one","timeout":30}'

one --agent actions execute daytona "$DELETE" "$KEY" \
  --path-vars "{\"sandboxIdOrName\":\"$SANDBOX_ID\"}"
```

Every Create field is optional; always set `ttlMinutes` so a forgotten sandbox destroys itself. The default sandbox has Debian, Python 3.14, Node, npm, git, and internet.

**Example 2: spin up a box, run a script, tear it down from Python.** Three One actions and nothing else, with the delete in a `finally` so it runs even if the script fails. Needs `pip install 'crewai-tools[mcp]'`, Python 3.10 to 3.13, and `ONE_SECRET` in the environment.

```python
import json, os
from crewai_tools import MCPServerAdapter
from mcp import StdioServerParameters

CREATE = "<actionId of POST /api/sandbox>"
EXEC   = "<actionId of POST /toolbox/{sandboxId}/process/execute>"
DELETE = "<actionId of DELETE /api/sandbox/{sandboxIdOrName}>"
KEY = "<connectionKey>"

def call(execute, **kw):
    return json.loads(str(execute._run(**kw)))["responseData"]

with MCPServerAdapter(StdioServerParameters(command="npx", args=["-y", "@withone/mcp"], env={**os.environ}), connect_timeout=120) as tools:
    execute = next(t for t in tools if t.name == "execute_one_action")

    sandbox_id = call(execute, platform="daytona", actionId=CREATE, connectionKey=KEY,
                      data={"name": "hack-box", "ttlMinutes": 30})["id"]
    try:
        run = call(execute, platform="daytona", actionId=EXEC, connectionKey=KEY,
                   pathVariables={"sandboxId": sandbox_id},
                   data={"command": "python3 -c 'print(2 + 2)'", "cwd": "/home/daytona", "timeout": 60})
        print(run["exitCode"], run["result"])
    finally:
        call(execute, platform="daytona", actionId=DELETE, connectionKey=KEY,
             pathVariables={"sandboxIdOrName": sandbox_id})
```

**Example 3: let an agent try generated code somewhere safe.** A crew writes a small script and, instead of running it on your laptop, asks for a sandbox. The agent calls create with `{"name":"try-1","ttlMinutes":10}`, writes the script into the box with one execute call (`"command": "cat > /home/daytona/main.py <<'EOF'\n<the script>\nEOF"`), runs it with a second (`"command": "python3 main.py", "cwd": "/home/daytona"`), reads `exitCode` and `result`, and calls delete when it is done. If the script breaks, nothing real is harmed, and the ten-minute TTL cleans up anything the agent forgets. For larger files use the `files/upload-v2` action (multipart, destination in the `path` query param); for a whole project use `git/clone`. This is the self-repair loop for the hackathon theme: run, read the error, fix, run again.

**Locking down what the sandbox can reach.** Three optional fields on Create turn a sandbox into a real jail. Worth setting when the code inside was written by a model:

| Field | Type | Effect |
|---|---|---|
| `networkBlockAll` | boolean | No outbound network at all |
| `networkAllowList` | string | Comma-separated CIDRs the sandbox may reach |
| `domainAllowList` | string | Comma-separated domains, wildcards allowed |

```json
{"name": "untrusted", "ttlMinutes": 10,
 "domainAllowList": "api.github.com,pypi.org,files.pythonhosted.org"}
```

Set them at create time; they are visible on the returned sandbox object. A sandbox with `networkBlockAll: true` still runs code and returns `exitCode` and `result`, it just cannot phone home.

**The other direction: One inside Daytona.** Run the agent itself inside the sandbox and let it reach Gmail, HubSpot, Slack and the rest through One from in there; then the whole crew is disposable. Pass One's credentials through the create action's `env` field, never as an uploaded file, and use `npx -y @withone/mcp` (crew) or `npm i -g @withone/cli` (scripts) inside, since Node is on the default image.

```python
sandbox_id = call(execute, platform="daytona", actionId=CREATE, connectionKey=KEY,
                  data={"name": "crew-box", "ttlMinutes": 30,
                        "env": {"ONE_SECRET": os.environ["ONE_SECRET"],
                                "ONE_CONNECTION_KEYS": os.environ["ONE_CONNECTION_KEYS"]}})["id"]

call(execute, platform="daytona", actionId=EXEC, connectionKey=KEY,
     pathVariables={"sandboxId": sandbox_id},
     data={"command": "npm i -g @withone/cli && one --agent list", "timeout": 240})
```

> **Known issue as of 2026-09-07, re-check on event day.** Daytona's sandbox egress inspects the TLS ClientHello and resets any connection whose SNI is not on a platform-level allowlist. `*.withone.ai` was not on that list, so from inside a sandbox the One CLI reported `fetch failed` and `curl` reported `Connection reset by peer`. Raw TCP to port 443 succeeds and only the TLS handshake is killed; swapping SNI and IP proves the SNI decides. The same reset hit `wikipedia.org`, `anthropic.com` and `daytona.io` itself, so anything that fetches a public page fails the same way. Allowed at the time: `github.com`, `registry.npmjs.org`, `openai.com`, `api.openai.com`, `claude.ai`, `you.com`, `api.you.com`, `vercel.com`, `cloudflare.com`. If `one --agent list` inside a sandbox fails with a reset, keep the agent outside the sandbox and use Examples 1 to 3, or ask the Daytona engineers on site to confirm `*.withone.ai` is allowlisted.

Gotchas:

- The CLI needs `--skip-validation` on create: One's schema wrongly marks `buildInfo` as required. The MCP tool accepts the minimal body as is.
- Do not set `ONE_BASE_URL` to an empty string in the create `env`. Leave it out entirely unless you are pointing at a non-default One environment.
- Do not pass `cpu`, `memory`, or `disk` with the default snapshot. Daytona returns 400 "Cannot specify Sandbox resources when using a snapshot".
- Execute defaults to a 10 second timeout. Pass `timeout` (seconds) for anything that installs packages or runs longer.
- The default image ships Python 3.14, which some libraries do not support yet (CrewAI needs below 3.14). If installs fail inside the sandbox, run `curl -LsSf https://astral.sh/uv/install.sh | sh` then `uv python install 3.12 && uv venv --python 3.12 .venv` in an execute call, and use `.venv/bin/python` after that.
- `list_one_integrations` with no `ONE_CONNECTION_KEYS` set returns every connection on the account and can be slow on large accounts. Set the allowlist.

## CrewAI with One

CrewAI is not a platform on One; it is the program that runs your agents in order and passes each one's output to the next. `@withone/mcp` is the small Node program that exposes One's four tools; CrewAI runs it as a local child process through `MCPServerAdapter` and hands those tools to your agents, which can then act on any app you have connected. Two small fixes make those tool calls reliable inside CrewAI.

**Setup.** Python 3.10 to 3.13 (3.14 does not work yet), Node 18+, the `one` CLI signed in, and the platforms you need connected with `one add <platform>`. 3.12 or 3.13 is the smoothest; on 3.10 or 3.11 pip installs a slightly older `mcpadapt` (0.1.19), which works but is one version behind. Check your setup before writing any code: `one --agent list --search <platform>` for each platform the crew will use, and confirm an `operational` row with a `live::<platform>::default::<32hex>` key.

`requirements.txt`. These are exact pins, not floors: `crewai[anthropic]>=0.140.0` resolves to 1.15.20 today, which is not the version this was tested on, and `dropping_nulls` below reaches into a pydantic internal that can shift between releases. `crewai` and `crewai-tools` move in lockstep, so keep them equal. `mcp~=1.26.0` is what crewai 1.15.2 itself requires (mcp 2.x breaks the adapter).

```text
crewai[anthropic]==1.15.2
crewai-tools[mcp]==1.15.2
mcp~=1.26.0
mcpadapt>=0.1.9,<0.2
python-dotenv
```

`.env`. `ONE_SECRET` is the same key the `one` CLI uses. `ONE_CONNECTION_KEYS` is an allowlist: the crew can only touch the connections you name here.

```text
ANTHROPIC_API_KEY=<anthropicKey>
ONE_SECRET=<oneSecret>
ONE_CONNECTION_KEYS=live::you::default::<32hex>,live::gmail::default::<32hex>
```

```bash
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
npx -y @withone/mcp --help   # downloads the MCP server once so the first crew run is not slow
```

**Wiring.** Three functions. `one_mcp_params` starts the MCP server. `dropping_nulls` fixes one problem: CrewAI sends unset optional fields as `null`, and One's server rejects `null`. `harden_execute` fixes another: JSON-object arguments sometimes arrive as `{}` through CrewAI, so it takes them as JSON strings and parses them right before the call. Apply both before building agents.

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
    def execute_one_action(platform: str, actionId: str, connectionKey: str, dataJson: str = "", pathVariablesJson: str = "", queryParamsJson: str = "") -> str:
        """Execute an API action on a connected platform via One. Pass request parts as JSON-encoded STRINGS. Omit or pass "" for parts the action does not need."""
        kwargs = {"platform": platform, "actionId": actionId, "connectionKey": connectionKey}
        for key, raw in (("data", dataJson), ("pathVariables", pathVariablesJson), ("queryParams", queryParamsJson)):
            if raw and raw.strip() and raw.strip() != "{}":
                kwargs[key] = json.loads(raw)
        return mcp_execute._run(**kwargs)
    return [t for t in tools if t.name != "execute_one_action"] + [execute_one_action]
```

After `harden_execute`, the agent-facing `execute_one_action` takes `dataJson`, `pathVariablesJson`, and `queryParamsJson`. Write task descriptions against those names.

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
    llm = LLM(model="anthropic/claude-sonnet-5")  # or anthropic/claude-opus-5 for the demo: picking the right action out of 700 platforms is where the stronger model earns its cost

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

A crew built this way runs unchanged inside a Daytona sandbox (see above): upload `main.py` and `requirements.txt`, install with `uv`, and start it with an execute call. Its `MCPServerAdapter` launches `npx -y @withone/mcp` in the sandbox and picks up `ONE_SECRET` from the environment you injected.

## Embed One in your product (One Connect)

Everything above is about **your** agent acting on **your** connections. When the thing you are building is a product whose **users** should connect **their own** Gmail, Slack, Notion or Stripe to it, use **One Connect**: a drop-in OAuth 2.1 flow (authorization code + PKCE) in which your user grants your app scoped, revocable access to their own One-connected tools. The user owns the connections in their One account. You hold a bearer token scoped to exactly what they granted, they can narrow or revoke it at any time, and One enforces the grant on every call.

Connect is not Auth. `@withone/auth` (AuthKit in the dashboard) puts connections in **your** One project, so you own them. Connect puts them in the **user's** One account and hands you a grant. For a hackathon product where each user brings their own accounts, Connect is the shape you want.

What you build is one button and two backend routes. Everything sensitive (state, the PKCE verifier, your client secret, the tokens) lives on your server; the SDK only navigates the tab to One's hosted connect page and watches for `?one_connect=success` on the way back, so there is no completion page to build.

1. **Create the OAuth app** at https://app.withone.ai → Settings → OAuth Apps → New OAuth app (client type Confidential). You get a Client ID and a Client Secret (shown once, server-only), register an `https` redirect URI that must match your callback route exactly, pick the access-token lifetime (7 days, 30 days, 90 days or 1 year), and optionally a permission set that pre-fills the consent screen (users can only narrow it). Env: `ONE_CLIENT_ID`, `ONE_CLIENT_SECRET`, `ONE_REDIRECT_URI`, optional `ONE_PERMISSION_SET`.
2. **The button.** `npm i @withone/connect`, then `<ConnectButton authorizeUrl="/api/one/authorize" platforms={[{ name: "Stripe" }]} onSuccess={…} />` from `@withone/connect/react` (Vue, Svelte and a plain `<one-connect-button>` custom element exist too), or the headless `useOneConnect({ authorize: { url }, onSuccess })` hook on your own element. Platform logos derive from `https://assets.withone.ai/connectors/<slug>.svg`.
3. **`GET /api/one/authorize`** mints `state` and a PKCE verifier, stores the verifier in an httpOnly cookie named per flow (`one_tx_<state>`, `path: "/"`, 10-minute expiry), and 302s to `https://api.withone.ai/oauth/authorize` with `client_id`, `redirect_uri`, `response_type=code`, all six tenancy scopes (`user:` / `org:` / `project:` `connections:read` and `:write`), `state`, `code_challenge`, `code_challenge_method=S256`, optional `permission_set` and `login_hint`.
4. **`GET /api/one/callback`** verifies that the returned `state` has its cookie (no cookie means forged or stale, so never exchange the code), then POSTs `grant_type=authorization_code` to `https://api.withone.ai/oauth/token` with **HTTP Basic** client auth (`client_secret_post` is not supported), stores `access_token`, `refresh_token` and `expiresAt` encrypted and keyed by your own user id, and redirects to any same-origin URL with `?one_connect=success` (or `?one_connect=error&one_connect_message=…`).
5. **Refresh before every call.** Access tokens live for the lifetime you chose; refresh tokens live 30 days and **rotate on every use**, so always store both new tokens. Reusing an old refresh token revokes the whole family. Serialize refreshes per user.
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
| 400 "Cannot specify Sandbox resources when using a snapshot" (Daytona) | `cpu` / `memory` / `disk` passed with the default snapshot | Remove them |
| Daytona create fails validation from the CLI | Schema wrongly requires `buildInfo` | Add `--skip-validation` |
| `fetch failed` / `Connection reset by peer` inside a Daytona sandbox | Sandbox egress SNI allowlist (see the dated note above) | Keep the agent outside the sandbox, or confirm `*.withone.ai` is allowlisted |
| 400 / 422 from any platform | Request does not match the schema | Re-read the knowledge; move values to the right place; retry once |
| Slow `one` commands | Cold cache | Knowledge and search are cached for an hour under `~/.one/cache/`; `one cache list`, `one cache clear` |

## Hackathon tips: agents that repair and learn

The challenge is **self-improving and learning agents**. Three One features map straight onto it:

- **Repair loop.** Generate the code, run it in a Daytona sandbox through One, read `exitCode` and `result`, fix from the error, run again. Nothing on the laptop breaks, and `ttlMinutes` cleans up.
- **Memory.** After each run, `one mem add` what worked and what did not (`--tags`, `--weight`); `one mem search` before the next attempt so the agent starts from its last lesson. Sync a platform (`one sync run gmail`) so the agent can search real history, not just its own notes.
- **Triggers.** A relay wakes the agent on a real event (a PR opened, a customer created, a calendar invite) instead of polling, so the improvement loop runs on its own.

Keep `ONE_CONNECTION_KEYS` tight, confirm before writes, and read the knowledge every time. That is the difference between an agent that demos and an agent that ships. Ask in the Discord when stuck; the One engineers are there all day.
