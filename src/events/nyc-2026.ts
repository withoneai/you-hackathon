import type { HackathonEvent } from "./types";

/**
 * You.com's "Build with YOU: The Live Web Agent Hackathon", New York, September 11, 2026.
 * Archived as it ran: Clockwork dark, Daytona as a sponsor, the four "agents that repair
 * and learn" templates. The Discord invite expired on 2026-10-10.
 */
export const nyc2026: HackathonEvent = {
  slug: "nyc-2026",
  name: "Build with YOU",
  subtitle: "The Live Web Agent Hackathon",
  host: "You.com",
  city: "New York",
  edition: "New York City / Edition 002",
  summary:
    "A day of self-repairing and learning agents, built on You.com, Daytona and CrewAI with One wiring in the apps.",
  startsAt: "2026-09-11T09:30:00-04:00",
  endsAt: "2026-09-11T18:00:00-04:00",
  date: "Friday, September 11, 2026",
  dateShort: "Sep 11, 2026",
  time: "9:30 AM to 6:00 PM EDT",
  venue: "124 E 14th St, New York",
  theme: "carbon",
  stack: ["You.com", "One", "Daytona", "CrewAI"],

  lumaUrl: "https://luma.com/agentic-hackathon-ny",
  discordUrl: "https://discord.gg/pn8QmHQ4p",
  couponCode: "YOU-NYC-PRO",
  appCountLabel: "780+",

  headerLabel: "× You.com Hackathon",
  headline: "Build with One at the Live Web Agent Hackathon.",
  subhead: "Managed auth and 780+ apps behind four tools. Install the skill, connect your apps, and spend the day on the agent.",
  facts: [
    { label: "Date", value: "Friday, September 11, 2026" },
    { label: "Time", value: "9:30 AM to 6:00 PM EDT" },
    { label: "Venue", value: "124 E 14th St, New York" },
    { label: "Theme", value: "Self-repairing & learning agents" },
  ],
  hostsLine: "Hosted by You.com with One, Daytona, CrewAI, Founders Bay and Clean Data Alliance.",
  signal: {
    out: "FAULT",
    back: "RETRY",
    outColor: "var(--alert)",
    backColor: "var(--spring)",
    pulseColor: "var(--lime)",
  },
  accentDot: "lime",

  perk: { prizeLine: "Win, and it is a free year.", prizeRest: "Second place gets six months, third gets three." },
  skill: {
    teaches: [
      "Setup for the remote MCP server, the CLI, the local MCP server and the API",
      "The four-tool loop: list, search, read the knowledge, execute",
      "Playbooks for You.com, Daytona and CrewAI through One",
      "Scoping, error codes and one troubleshooting table",
      "When to use One Connect so your users can connect their own apps",
    ],
    pageDescription:
      "The primary skill for building with One at the You.com hackathon: setup, the four-tool loop, and playbooks for You.com, Daytona and CrewAI.",
  },
  setup: {
    connectHelp: "Paste the keys from api.you.com and app.daytona.io.",
    connectCommands: ["one add you", "one add daytona"],
  },
  loopDemo: { secondConnection: "daytona", query: "self-repairing agents" },
  partners: {
    lede: "You.com and Daytona are platforms on One. CrewAI runs One's four tools as a local MCP server.",
    cards: [
      {
        slug: "you",
        name: "You.com",
        logo: "/partners/you.svg",
        logoStyle: "round",
        tagline: "Live web search, research, and page reading.",
        onOne:
          "The `you` platform: Search, Research, Finance Research and Get Web Page Contents through the same four tools.",
        command: "one add you",
        keyLabel: "Get a You.com API key",
        keyUrl: "https://api.you.com",
        playbookAnchor: "youcom-via-one",
      },
      {
        slug: "daytona",
        name: "Daytona",
        logo: "/partners/daytona.svg",
        logoStyle: "round",
        tagline: "Throwaway Linux sandboxes your agent can fail safely in.",
        onOne:
          "The `daytona` platform: create a sandbox, run commands, move files, delete it. No Daytona SDK in your code.",
        command: "one add daytona",
        keyLabel: "Get a Daytona API key",
        keyUrl: "https://app.daytona.io/dashboard/keys",
        playbookAnchor: "daytona-via-one",
      },
      {
        slug: "crewai",
        name: "CrewAI",
        logo: "/partners/crewai.svg",
        logoStyle: "tile",
        mono: true,
        tagline: "Orchestrate a crew of agents that act on real apps.",
        onOne:
          "Hand a crew One's four tools through MCPServerAdapter and `npx -y @withone/mcp`. Two small helpers make the calls reliable.",
        command: "npx -y @withone/mcp --help",
        keyLabel: "CrewAI docs",
        keyUrl: "https://docs.crewai.com",
        playbookAnchor: "crewai-with-one",
      },
    ],
    co: [
      { name: "Founders Bay", logo: "/partners/founders-bay.png", url: "https://www.foundersbay.com" },
      {
        name: "Clean Data Alliance",
        logo: "/partners/clean-data-alliance.png",
        url: "https://www.cleandataalliance.org",
        showName: true,
      },
    ],
  },
  templates: {
    title: "Starting points for the theme: agents that repair and learn.",
    lede: "Four working templates. Clone one, fill in .env, run it twice and watch the second run use what the first one learned.",
    items: [
      {
        slug: "self-repairing-research",
        title: "Self-repairing research agent",
        body: "Researches with You.com, charts the result in a Daytona sandbox, repairs the script from the error, emails the PNG, and remembers the fix so the next run passes first time.",
        prompt:
          "Research the most cited papers on self-repairing agents, chart their citation counts in a sandbox, and email me the PNG.",
        platforms: ["you", "daytona", "gmail"],
      },
      {
        slug: "support-triage-crew",
        title: "Support triage crew",
        body: "A crew reads the inbox, skips reports it already filed, reproduces each new bug in a sandbox through One's MCP tools, files it in Linear and posts to Slack.",
        prompt: "Triage every unread support email, file real bugs in Linear with repro steps, and post the list to #support.",
        platforms: ["gmail", "daytona", "linear", "slack"],
        framework: "CrewAI",
      },
      {
        slug: "market-watch",
        title: "Market watch",
        body: "Finance Research on a watchlist, written to Notion and digested in Slack. Tell it what you prefer and the next brief follows it, with a section on what changed since the last one.",
        prompt:
          "Every morning at 8, research what moved for my watchlist, save the sourced brief to Notion, and ping #markets.",
        platforms: ["you", "notion", "slack"],
      },
      {
        slug: "pr-reviewer-that-learns",
        title: "An agent that learns",
        body: "Reviews a pull request, then turns your replies into rules it applies on the next one. Every review lists which learned rules it used.",
        prompt: "When a PR is opened, review it using the rules you learned from my earlier feedback, and remember the outcome.",
        platforms: ["github"],
      },
    ],
  },
  helpVenueLine: "Or find the One table at the venue.",
  footerLine: "Build with YOU · Hosted by You.com · NYC",
  og: {
    tag: "NYC",
    headline: "Build with One at the Live Web Agent Hackathon.",
    subline: "Install the skill, connect You.com, Daytona and your apps, and spend the day on the agent.",
  },
};
