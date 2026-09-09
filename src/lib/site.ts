/**
 * Single source of truth for every URL, code, and event fact on the page.
 * Swap DISCORD_URL once the invite exists.
 */

export const SITE_URL = "https://hackathon.withone.ai";
export const SKILL_RAW_URL = `${SITE_URL}/skill.md`;
export const SKILL_PAGE_URL = `${SITE_URL}/skill`;
export const SKILL_NAME = "one-hackathon";

export const COUPON_CODE = "YOU-NYC-PRO";
export const REDEEM_URL = "https://app.withone.ai/settings/billing";

// TODO: replace with the real invite before launch.
export const DISCORD_URL = "https://discord.gg/REPLACE_ME";

export const MCP_URL = "https://mcp.withone.ai/mcp";
export const LUMA_URL = "https://luma.com/agentic-hackathon-ny";

/** Fallback when the live count endpoint is unreachable (measured 2026-09-08). */
export const PLATFORM_COUNT_FALLBACK = 786;
export const TOOL_COUNT_FALLBACK = 102000;

export const EVENT = {
  name: "Build with YOU",
  subtitle: "The Live Web Agent Hackathon",
  host: "You.com",
  edition: "New York City / Edition 002",
  date: "Friday, September 11, 2026",
  dateShort: "Sep 11, 2026",
  time: "9:30 AM to 6:00 PM EDT",
  venue: "124 E 14th St, New York",
  theme: "Self-repairing & learning agents",
  challenge: "Self-improving and learning agents",
} as const;

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
  x: "https://x.com/withoneai",
  support: "mailto:support@withone.ai",
  npmCli: "https://www.npmjs.com/package/@withone/cli",
  npmMcp: "https://www.npmjs.com/package/@withone/mcp",
  discord: DISCORD_URL,
  luma: LUMA_URL,
} as const;

export type Partner = {
  slug: "you" | "daytona" | "crewai";
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
    slug: "daytona",
    name: "Daytona",
    logo: "/partners/daytona.svg",
    tagline: "Throwaway Linux sandboxes your agent can fail safely in.",
    onOne: "The `daytona` platform: create a sandbox, run commands, move files, delete it. No Daytona SDK in your code.",
    command: "one add daytona",
    keyLabel: "Get a Daytona API key",
    keyUrl: "https://app.daytona.io/dashboard/keys",
    docsUrl: "https://www.daytona.io/docs",
    playbookAnchor: "daytona-via-one",
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
];

export const CO_PARTNERS = [
  { name: "Founders Bay", logo: "/partners/founders-bay.png", url: "https://www.foundersbay.com" },
  {
    name: "Clean Data Alliance",
    logo: "/partners/clean-data-alliance.png",
    url: "https://www.cleandataalliance.org",
  },
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
  daytona: "Daytona",
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
