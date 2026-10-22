/**
 * Single source of truth for every URL, code, and event fact on the page.
 * DISCORD_URL is the same invite the NYC edition used (an invite to You.com's
 * Discord). Discord reports it expired on 2026-10-10, so it must be replaced with
 * a live, non-expiring invite before launch.
 */

export const SITE_URL = "https://hackathon.withone.ai";
export const SKILL_RAW_URL = `${SITE_URL}/skill.md`;
export const SKILL_PAGE_URL = `${SITE_URL}/skill`;
export const SKILL_NAME = "one-hackathon";

export const COUPON_CODE = "YOU-SF-PRO";
export const REDEEM_URL = "https://app.withone.ai/settings/billing";

export const DISCORD_URL = "https://discord.gg/pn8QmHQ4p";

export const MCP_URL = "https://mcp.withone.ai/mcp";

/**
 * The use-case templates live in this repo under templates/. Flip TEMPLATES_PUBLIC to true
 * once the repository is public; until then the cards say "coming soon" and link nowhere,
 * because a link into a private repo is a 404 for every builder.
 */
export const TEMPLATES_PUBLIC = true;
export const TEMPLATES_URL = "https://github.com/withoneai/you-hackathon/tree/main/templates";
export const LUMA_URL = "https://luma.com/you-halloween";
/** The You.com starter repo (CrewAI starter and the facility simulation). Empty until You.com shares it. */
export const STARTER_REPO_URL = "";

/** How the page counts One's apps. A fixed label, so it matches the skill and the event copy. */
export const APP_COUNT_LABEL = "1,000+";

export const EVENT = {
  name: "Hack With YOU",
  subtitle: "Halloween Edition",
  host: "You.com",
  city: "San Francisco",
  edition: "San Francisco / Edition 003",
  date: "Wednesday, October 28, 2026",
  dateShort: "Oct 28, 2026",
  time: "9:00 AM to 8:30 PM PDT",
  venue: "AWS Builder Loft, 525 Market St, San Francisco",
  venueShort: "the AWS Builder Loft",
} as const;

export type Track = {
  slug: "exorcism-protocol" | "haunted-dashboard";
  number: 1 | 2;
  name: string;
  kind: string;
  body: string;
};

export const TRACKS: Track[] = [
  {
    slug: "exorcism-protocol",
    number: 1,
    name: "The Exorcism Protocol",
    kind: "Autonomous agent swarms",
    body: "A paranormal outbreak is spreading through a live facility sim. Build a supervised CrewAI swarm where each agent has its own role, tools and partial knowledge, and they coordinate containment in real time. Scored on containment speed, false alarms and civilians saved.",
  },
  {
    slug: "haunted-dashboard",
    number: 2,
    name: "The Haunted Dashboard",
    kind: "Generative UI pipelines",
    body: "Take live, messy “Spooky Incident Logs” and turn them into a working tactical command station. Parasail runs the inference, and the UI builds itself on the fly over WebSockets.",
  },
];

export const LINKS = {
  dashboard: "https://app.withone.ai",
  apiKeys: "https://app.withone.ai/settings/api-keys",
  billing: REDEEM_URL,
  logs: "https://app.withone.ai/logs",
  home: "https://www.withone.ai",
  docs: "https://www.withone.ai/docs/welcome",
  docsGettingStarted: "https://www.withone.ai/docs/getting-started",
  docsCli: "https://www.withone.ai/docs/cli",
  docsMcp: "https://www.withone.ai/docs/mcp",
  docsInstall: "https://www.withone.ai/docs/install",
  docsRelay: "https://www.withone.ai/docs/relay",
  docsPlugin: "https://www.withone.ai/docs/plugin",
  docsApi: "https://www.withone.ai/docs/api-reference/introduction",
  connectRepo: "https://github.com/withoneai/connect",
  knowledge: "https://www.withone.ai/knowledge",
  pricing: "https://www.withone.ai/pricing",
  github: "https://github.com/withoneai",
  x: "https://x.com/onedotnew",
  support: "mailto:support@withone.ai",
  npmCli: "https://www.npmjs.com/package/@withone/cli",
  npmMcp: "https://www.npmjs.com/package/@withone/mcp",
  discord: DISCORD_URL,
  luma: LUMA_URL,
  templates: TEMPLATES_URL,
} as const;

export type Partner = {
  slug: "you" | "crewai" | "parasail";
  name: string;
  logo: string;
  tagline: string;
  onOne: string;
  command: string;
  keyLabel: string;
  keyUrl: string;
  docsUrl: string;
  playbookAnchor: string;
};

export const PARTNERS: Partner[] = [
  {
    slug: "you",
    name: "You.com",
    logo: "/partners/you.svg",
    tagline: "Live web search, research, and page reading.",
    onOne: "The `you` platform: Search, Research, Finance Research and Get Web Page Contents through the same four tools.",
    command: "one add you",
    keyLabel: "Get a You.com API key",
    keyUrl: "https://api.you.com",
    docsUrl: "https://documentation.you.com",
    playbookAnchor: "youcom-via-one",
  },
  {
    slug: "crewai",
    name: "CrewAI",
    logo: "/partners/crewai.svg",
    tagline: "Orchestrate a crew of agents that act on real apps.",
    onOne: "Hand a crew One's four tools through MCPServerAdapter and `npx -y @withone/mcp`. Two small helpers make the calls reliable.",
    command: "npx -y @withone/mcp --help",
    keyLabel: "CrewAI docs",
    keyUrl: "https://docs.crewai.com",
    docsUrl: "https://docs.crewai.com",
    playbookAnchor: "crewai-with-one",
  },
  {
    slug: "parasail",
    name: "Parasail",
    logo: "/partners/parasail.svg",
    tagline: "Fast, low-cost inference on open models.",
    onOne: "Parasail runs the model, One gives it the apps. Point your crew's LLM at Parasail's OpenAI-compatible API and keep One's four tools for every action.",
    command: "export PARASAIL_API_KEY=...",
    keyLabel: "Get a Parasail API key",
    keyUrl: "https://www.saas.parasail.io/keys",
    docsUrl: "https://docs.parasail.io",
    playbookAnchor: "parasail-with-one",
  },
];

export const CO_PARTNERS = [
  { name: "AWS", logo: "/partners/aws.svg", url: "https://aws.amazon.com" },
  { name: "UpScaleX", logo: "/partners/upscalex.png", url: "https://www.upscalex.ai" },
  { name: "Founders Bay", logo: "/partners/founders-bay.png", url: "https://www.foundersbay.com" },
] as const;

/** Platform marks bundled under /public/platforms (from assets.withone.ai/connectors). */
export const PLATFORM_SLUGS = [
  "gmail",
  "slack",
  "notion",
  "github",
  "linear",
  "stripe",
  "hubspot",
  "google-calendar",
  "discord",
  "airtable",
  "google-sheets",
  "salesforce",
  "shopify",
  "jira",
  "zendesk",
  "intercom",
  "asana",
  "google-drive",
  "openai",
  "twilio",
  "quickbooks",
] as const;

export const PLATFORM_LABELS: Record<string, string> = {
  gmail: "Gmail",
  slack: "Slack",
  notion: "Notion",
  github: "GitHub",
  linear: "Linear",
  stripe: "Stripe",
  hubspot: "HubSpot",
  "google-calendar": "Google Calendar",
  discord: "Discord",
  airtable: "Airtable",
  "google-sheets": "Google Sheets",
  salesforce: "Salesforce",
  shopify: "Shopify",
  jira: "Jira",
  zendesk: "Zendesk",
  intercom: "Intercom",
  asana: "Asana",
  "google-drive": "Google Drive",
  openai: "OpenAI",
  twilio: "Twilio",
  quickbooks: "QuickBooks",
  you: "You.com",
  parasail: "Parasail",
  crewai: "CrewAI",
};

export type AgentClient = {
  id: string;
  name: string;
  logo: string;
  /** Monochrome marks are white on carbon already; colored marks render as-is. */
  mono?: boolean;
};

export const AGENT_CLIENTS: AgentClient[] = [
  { id: "claude-code", name: "Claude Code", logo: "/agents/claudecode-color.svg" },
  { id: "codex", name: "Codex", logo: "/agents/codex-color.svg" },
  { id: "cursor", name: "Cursor", logo: "/agents/cursor.svg", mono: true },
  { id: "chatgpt", name: "ChatGPT", logo: "/agents/chatgpt.svg", mono: true },
  { id: "claude", name: "Claude", logo: "/agents/claude-color.svg" },
  { id: "openclaw", name: "OpenClaw", logo: "/agents/openclaw-color.svg" },
  { id: "hermes", name: "Hermes", logo: "/agents/hermes.svg", mono: true },
  { id: "kiro", name: "Kiro", logo: "/agents/kiro-color.svg" },
  { id: "gemini", name: "Gemini CLI", logo: "/agents/gemini-color.svg" },
  { id: "windsurf", name: "Windsurf", logo: "/agents/windsurf.svg", mono: true },
  { id: "crewai", name: "CrewAI", logo: "/agents/crewai.svg", mono: true },
  { id: "langchain", name: "LangChain", logo: "/agents/langchain.svg", mono: true },
  { id: "vercel-ai", name: "Vercel AI SDK", logo: "/agents/vercel-ai.svg", mono: true },
  { id: "mastra", name: "Mastra", logo: "/agents/mastra.svg", mono: true },
  { id: "openai-agents", name: "OpenAI Agents", logo: "/agents/openai-agents.svg", mono: true },
];
