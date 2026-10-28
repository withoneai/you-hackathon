/**
 * Site-wide URLs and catalogues shared by every event. Each event's own facts, links,
 * partners and templates live in src/events/<slug>.ts.
 */

export const SITE_URL = "https://hackathon.withone.ai";
export const SKILL_NAME = "one-hackathon";

export const REDEEM_URL = "https://app.withone.ai/settings/billing";
export const MCP_URL = "https://mcp.withone.ai/mcp";

/**
 * The use-case templates live in this repo under templates/. Flip TEMPLATES_PUBLIC to true
 * once the repository is public; until then the cards say "coming soon" and link nowhere,
 * because a link into a private repo is a 404 for every builder.
 */
export const TEMPLATES_PUBLIC = true;
export const TEMPLATES_URL = "https://github.com/withoneai/you-hackathon/tree/main/templates";

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
  docsConnect: "https://www.withone.ai/docs/connect",
  connectSetup: "https://www.withone.ai/docs/connect/setup",
  connectManagement: "https://www.withone.ai/docs/connect/management",
  connectDashboard: "https://app.withone.ai/developers/connect",
  knowledge: "https://www.withone.ai/knowledge",
  pricing: "https://www.withone.ai/pricing",
  github: "https://github.com/withoneai",
  x: "https://x.com/onedotnew",
  support: "mailto:support@withone.ai",
  npmCli: "https://www.npmjs.com/package/@withone/cli",
  npmMcp: "https://www.npmjs.com/package/@withone/mcp",
  templates: TEMPLATES_URL,
} as const;

/** Sponsor slugs whose mark lives in /public/partners rather than /public/platforms. */
export const PARTNER_MARKS = new Set(["you", "daytona", "parasail"]);

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
  parasail: "Parasail",
  crewai: "CrewAI",
};

export type AgentClient = {
  id: string;
  name: string;
  logo: string;
  /** Monochrome marks are white; light mode inverts them. Colored marks render as-is. */
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
