import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { Tabs } from "@/components/ui/tabs";
import { CommandRow, Step, TerminalFrame } from "@/components/ui/terminal";
import { LINKS, MCP_URL } from "@/lib/site";
import { LoopDemo } from "./loop-demo";

const STEPPER = [
  {
    title: "Create your workspace",
    body: "Free at app.withone.ai.",
    href: LINKS.dashboard,
  },
  {
    title: "Connect your apps",
    body: "`one add <platform>` or the Connect page.",
    href: LINKS.dashboard,
  },
  {
    title: "Pick a path",
    body: "MCP for editors, the CLI for terminals, the API for app code.",
  },
];

const HTTP_JSON = `{
  "mcpServers": {
    "one": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`;

type Client = {
  id: string;
  name: string;
  logo: string;
  docs: string;
  note: string;
  code: string;
  lang: string;
  title?: string;
};

const CLIENTS: Client[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    logo: "/agents/claudecode-color.svg",
    docs: `${LINKS.docsInstall}/claude-code`,
    lang: "bash",
    title: "terminal",
    code: `claude mcp add --transport http one ${MCP_URL}

# or install the plugin (bundles the skills)
/plugin marketplace add withoneai/claude-plugin
/plugin install one@one`,
    note: "Claude Code opens your browser to sign in and scope access. Add --scope project to write the entry to the repo's .mcp.json.",
  },
  {
    id: "cursor",
    name: "Cursor",
    logo: "/agents/cursor.svg",
    docs: `${LINKS.docsInstall}/cursor`,
    lang: "json",
    title: "~/.cursor/mcp.json",
    code: HTTP_JSON,
    note: "Cursor menu → MCP Settings, or edit the file (project-local: .cursor/mcp.json). Click Connect on the \"Needs authentication\" row.",
  },
  {
    id: "codex",
    name: "Codex",
    logo: "/agents/codex-color.svg",
    docs: `${LINKS.docsInstall}/codex`,
    lang: "toml",
    title: "~/.codex/config.toml",
    code: `[mcp_servers.one]
url = "${MCP_URL}"

# then, in your shell
# codex mcp login one`,
    note: "auth defaults to oauth, so there is no token to configure. codex mcp list confirms the server is registered.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "/agents/chatgpt.svg",
    docs: `${LINKS.docsInstall}/chatgpt`,
    lang: "text",
    title: "Settings → Apps → Create app",
    code: `Name:            One
Connection:      ${MCP_URL}
Authentication:  OAuth`,
    note: "Advanced settings → Create app, then Sign in with One on the consent screen.",
  },
  {
    id: "claude",
    name: "Claude",
    logo: "/agents/claude-color.svg",
    docs: `${LINKS.docsInstall}/claude-cowork`,
    lang: "text",
    title: "Settings → Connectors → Add custom connector",
    code: `Name:  One
URL:   ${MCP_URL}`,
    note: "Works for Claude Cowork and the Claude apps. Sign in and scope which connections this client may use.",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    logo: "/agents/openclaw-color.svg",
    docs: `${LINKS.docsInstall}/openclaw`,
    lang: "bash",
    title: "terminal",
    code: `openclaw mcp add one \\
  --url ${MCP_URL} \\
  --transport streamable-http \\
  --auth oauth
openclaw mcp login one`,
    note: "openclaw mcp login prints an authorization URL; approve it in the browser. openclaw mcp doctor one --probe checks the wiring.",
  },
  {
    id: "hermes",
    name: "Hermes",
    logo: "/agents/hermes.svg",
    docs: `${LINKS.docsInstall}/hermes`,
    lang: "yaml",
    title: "~/.hermes/config.yaml",
    code: `mcp_servers:
  one:
    url: "${MCP_URL}"
    auth: oauth

# then: hermes mcp login one`,
    note: "Run hermes mcp login from a separate terminal, not inside a running Hermes session.",
  },
  {
    id: "kiro",
    name: "Kiro",
    logo: "/agents/kiro-color.svg",
    docs: `${LINKS.docsInstall}/kiro`,
    lang: "json",
    title: "~/.kiro/settings/mcp.json",
    code: HTTP_JSON,
    note: "Project-local: .kiro/settings/mcp.json.",
  },
];

const FETCH_EXAMPLE = `// Any action, through One's passthrough proxy. One injects the platform's
// credentials; your code never sees an OAuth token. All three headers are required.
const res = await fetch(
  "https://api.withone.ai/v1/passthrough/v1/search?query=self-repairing+agents&count=5",
  {
    headers: {
      "x-one-secret": process.env.ONE_SECRET!,
      "x-one-connection-key": process.env.ONE_YOU_CONNECTION_KEY!,
      "x-one-action-id": process.env.ONE_YOU_SEARCH_ACTION_ID!, // from \`one actions search\`
    },
  },
);
const { results } = await res.json();`;

const SDK_EXAMPLE = `import { One } from "@withone/sdk";
import * as gmail from "@withone/sdk/gmail"; // typed actions live on per-platform subpaths

const one = new One(process.env.ONE_SECRET!);

// Every action is typed: inputs, output, and the auth it needs.
const res = await one
  .connection(process.env.ONE_GMAIL_CONNECTION_KEY!)
  .run(
    gmail.createUsersDraft({
      path: { userId: "me" },
      body: { message: { raw: base64Email } },
    }),
  );

console.log(res.status, res.data);`;

function McpPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-10">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[19px] font-medium text-foreground">Remote MCP server</h3>
          <span className="rounded-full border border-spring-deep bg-spring-tint px-2 py-0.5 font-mono text-10 uppercase tracking-label text-spring">
            Recommended
          </span>
        </div>
        <p className="mt-2 text-15 text-secondary">
          Point any MCP client at One&apos;s hosted server and sign in with OAuth. Nothing to
          install, no API key.
        </p>
        <div className="mt-5">
          <Eyebrow>Server URL</Eyebrow>
          <CommandRow prompt={false} className="mt-2" action={<CopyButton text={MCP_URL} size="sm" />}>
            {MCP_URL}
          </CommandRow>
        </div>
        <div className="mt-5">
          <Eyebrow>On the consent screen</Eyebrow>
          <ul className="mt-2 space-y-1.5 text-13 text-secondary">
            <li>Choose which connections this client may use.</li>
            <li>Per connection: read only, read-write, or specific actions.</li>
            <li>
              <span className="text-foreground">Knowledge-only mode</span> removes execute, for code
              generation.
            </li>
          </ul>
        </div>
        <a
          href={LINKS.docsMcp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
        >
          MCP docs <ArrowUpRight size={12} />
        </a>
      </div>

      <div className="min-w-0">
        <Tabs
          variant="underline"
          ariaLabel="MCP client"
          items={CLIENTS.map((c) => ({
            id: c.id,
            label: (
              <span className="inline-flex items-center gap-2">
                <Logo src={c.logo} alt="" size={16} />
                {c.name}
              </span>
            ),
            content: (
              <div className="space-y-3">
                <CodeBlock code={c.code} lang={c.lang} title={c.title} />
                <p className="text-13 text-secondary">{c.note}</p>
                <a
                  href={c.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-13 text-muted transition-colors hover:text-foreground"
                >
                  {c.name} install guide <ArrowUpRight size={12} />
                </a>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
}

function CliPanel() {
  const onboard = 'Please run "one onboard"';
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="min-w-0">
        <h3 className="text-[19px] font-medium text-foreground">The CLI</h3>
        <p className="mt-2 text-15 text-secondary">
          Four commands, JSON output with <code className="font-mono text-foreground">--agent</code>.
          Also how you connect platforms.
        </p>
        <TerminalFrame className="mt-5" title="setup · zsh">
          <Step n={1} title="Install the CLI" help="Node 18+.">
            <CommandRow action={<CopyButton text="npm i -g @withone/cli" size="sm" />}>
              npm i -g @withone/cli
            </CommandRow>
          </Step>
          <Step n={2} title="Sign in" help="Opens a browser window and saves your key.">
            <CommandRow action={<CopyButton text="one init --auth browser" size="sm" />}>
              one init --auth browser
            </CommandRow>
          </Step>
          <Step n={3} title="Connect the hackathon platforms" help="Paste the keys from api.you.com and app.daytona.io.">
            <CommandRow action={<CopyButton text="one add you" size="sm" />}>one add you</CommandRow>
            <CommandRow action={<CopyButton text="one add daytona" size="sm" />}>one add daytona</CommandRow>
          </Step>
          <Step n={4} title="Hand it to your agent" help="Tell Claude, Codex or Cursor:" last>
            <CommandRow prompt={false} action={<CopyButton text={onboard} size="sm" />}>
              {onboard}
            </CommandRow>
          </Step>
        </TerminalFrame>
        <a
          href={LINKS.docsCli}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
        >
          CLI docs <ArrowUpRight size={12} />
        </a>
      </div>
      <div className="min-w-0">
        <p className="mb-3 text-13 text-secondary">The same loop, from the CLI or the MCP tools:</p>
        <LoopDemo />
      </div>
    </div>
  );
}

function ApiPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-10">
      <div className="min-w-0">
        <h3 className="text-[19px] font-medium text-foreground">API and SDK</h3>
        <p className="mt-2 text-15 text-secondary">
          For app code. Three headers on every request; One resolves the platform&apos;s
          credentials server-side.
        </p>
        <ul className="mt-5 space-y-2 text-13 text-secondary">
          <li>
            <code className="font-mono text-foreground">x-one-secret</code> from{" "}
            <a href={LINKS.apiKeys} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong underline-offset-4 hover:text-foreground">
              Settings → API keys
            </a>{" "}
            (<code className="font-mono">sk_live_…</code> or <code className="font-mono">sk_test_…</code>)
          </li>
          <li>
            <code className="font-mono text-foreground">x-one-connection-key</code> from{" "}
            <code className="font-mono">one --agent list</code> (<code className="font-mono">live::gmail::default::…</code>)
          </li>
          <li>
            <code className="font-mono text-foreground">x-one-action-id</code> from{" "}
            <code className="font-mono">one --agent actions search</code>. The proxy answers 400 without it.
          </li>
          <li>
            The path after <code className="font-mono">/v1/passthrough/</code> is the action&apos;s own
            path from its knowledge. Read it first.
          </li>
        </ul>
        <a
          href={LINKS.docsApi}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
        >
          API reference <ArrowUpRight size={12} />
        </a>

        <div className="mt-6 rounded-panel border border-border bg-background/50 p-4">
          <p className="text-13 font-medium text-foreground">
            Building a product your users connect their own apps to?
          </p>
          <p className="mt-1 text-13 text-secondary">
            One Connect: each user grants your app scoped, revocable access to their own tools.
            One button, two backend routes.
          </p>
          <CommandRow className="mt-3" action={<CopyButton text="npx skills add withoneai/connect" size="sm" />}>
            npx skills add withoneai/connect
          </CommandRow>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href="/skill#embed-one-in-your-product-one-connect"
              className="inline-flex items-center gap-1 text-13 font-medium text-foreground transition-colors hover:text-spring"
            >
              How it fits, in the skill <ArrowRight size={13} />
            </Link>
            <a
              href={LINKS.connectRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
            >
              withoneai/connect <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <Tabs
          variant="underline"
          ariaLabel="Code example"
          items={[
            { id: "fetch", label: "fetch (passthrough)", content: <CodeBlock code={FETCH_EXAMPLE} lang="ts" title="route.ts" /> },
            { id: "sdk", label: "@withone/sdk (typed)", content: <CodeBlock code={SDK_EXAMPLE} lang="ts" title="index.ts" /> },
          ]}
        />
      </div>
    </div>
  );
}

export function SetupPaths() {
  return (
    <section id="setup" className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Get started"
            title="Three ways to use One."
            lede="Same account, same four tools. Choose by where your agent lives."
          />
        </Reveal>

        <Reveal delay={80}>
          <ol className="mt-10 grid gap-3 md:grid-cols-3">
            {STEPPER.map((s, i) => (
              <li key={s.title} className="flex gap-3.5 rounded-card border border-border bg-surface p-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-11 font-semibold text-background">
                  {i + 1}
                </span>
                <div>
                  <p className="text-15 font-medium text-foreground">
                    {s.href ? (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-spring">
                        {s.title} <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      s.title
                    )}
                  </p>
                  <p className="mt-1 text-13 text-secondary">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={140} className="mt-10">
          <Tabs
            ariaLabel="Integration path"
            listClassName="mb-2"
            items={[
              { id: "mcp", label: "Remote MCP", content: <div className="rounded-card border border-border bg-surface/60 p-6 sm:p-8"><McpPanel /></div> },
              { id: "cli", label: "CLI", content: <div className="rounded-card border border-border bg-surface/60 p-6 sm:p-8"><CliPanel /></div> },
              { id: "api", label: "API / SDK", content: <div className="rounded-card border border-border bg-surface/60 p-6 sm:p-8"><ApiPanel /></div> },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
