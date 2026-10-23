import type { HackathonEvent } from "./types";

/**
 * You.com's "Hack With YOU @ AWS Builder Loft, Halloween Edition", San Francisco,
 * October 28, 2026. Paper (the backoffice's light Clockwork) with pumpkin and hex accents.
 * Every team builds with You.com, One, CrewAI and Parasail; Parasail is the model, not a
 * One connector. DISCORD_URL is the NYC invite, which expired on 2026-10-10: replace it here
 * and in content/events/sf-halloween-2026/skill.md before launch.
 */
export const sfHalloween2026: HackathonEvent = {
  slug: "sf-halloween-2026",
  name: "Hack With YOU",
  subtitle: "Halloween Edition",
  host: "You.com",
  city: "San Francisco",
  edition: "San Francisco / Edition 003",
  summary:
    "Two tracks at the AWS Builder Loft: agent swarms that contain a paranormal outbreak, and dashboards that build themselves from spooky incident logs.",
  startsAt: "2026-10-28T09:00:00-07:00",
  endsAt: "2026-10-28T20:30:00-07:00",
  date: "Wednesday, October 28, 2026",
  dateShort: "Oct 28, 2026",
  time: "9:00 AM to 8:30 PM PDT",
  venue: "AWS Builder Loft, 525 Market St, San Francisco",
  stack: ["You.com", "One", "CrewAI", "Parasail"],

  lumaUrl: "https://luma.com/you-halloween",
  discordUrl: "https://discord.gg/pn8QmHQ4p",
  couponCode: "YOU-SF-PRO",
  appCountLabel: "1,000+",

  headerLabel: "× Hack With YOU",
  headline: "Build with One at Hack With YOU: Halloween Edition.",
  subhead:
    "Managed auth and 1,000+ apps behind three tools. Install the skill, connect your apps, and spend the day on the agent, not the plumbing.",
  facts: [
    { label: "Date", value: "Wednesday, October 28, 2026" },
    { label: "Time", value: "9:00 AM to 8:30 PM PDT" },
    { label: "Venue", value: "AWS Builder Loft, 525 Market St, San Francisco" },
    { label: "Tracks", value: "The Exorcism Protocol · The Haunted Dashboard" },
  ],
  hostsLine:
    "Presented by You.com with One, Parasail, CrewAI, AWS, UpScaleX and Founders Bay. Every team builds with You.com, One, CrewAI and Parasail.",
  tracks: [
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
  ],
  heroArt: "halloween",
  signal: {
    out: "OUTBREAK",
    back: "CONTAINED",
    outColor: "var(--pumpkin)",
    backColor: "var(--hex)",
    pulseColor: "var(--pumpkin)",
  },
  accentDot: "pumpkin",

  perk: { prizeLine: "Win, and it's a free year.", prizeRest: "Second place gets six months, third gets three." },
  skill: {
    teaches: [
      "Setup for the remote MCP server, the CLI, the local MCP server and the API",
      "The three-tool loop: list, find the action and its docs, execute",
      "Playbooks for You.com, CrewAI and Parasail with One",
      "Starter patterns for both tracks: The Exorcism Protocol and The Haunted Dashboard",
      "Scoping, error codes and one troubleshooting table",
    ],
    pageDescription:
      "The primary skill for building with One at Hack With YOU: Halloween Edition: setup, the three-tool loop, playbooks for You.com, CrewAI and Parasail, and both track playbooks.",
  },
  setup: {
    connectHelp: "Paste the key from api.you.com. Slack opens the browser.",
    connectCommands: ["one add you", "one add slack"],
  },
  loopDemo: { secondConnection: "slack", query: "haunted house sightings" },
  partners: {
    lede: "Every build uses the same four: You.com for live web data, One for apps and auth, CrewAI to orchestrate the agents, and Parasail for inference.",
    cards: [
      {
        slug: "you",
        name: "You.com",
        logo: "/partners/you.svg",
        logoStyle: "round",
        tagline: "Live web search, research, and page reading.",
        onOne:
          "The `you` platform: Search, Research, Finance Research and Get Web Page Contents through the same three tools.",
        command: "one add you",
        keyLabel: "Get a You.com API key",
        keyUrl: "https://api.you.com",
        playbookAnchor: "youcom-via-one",
      },
      {
        slug: "crewai",
        name: "CrewAI",
        logo: "/partners/crewai.svg",
        logoStyle: "tile",
        mono: true,
        tagline: "Orchestrate a crew of agents that act on real apps.",
        onOne:
          "Hand a crew One's three tools through MCPServerAdapter and `npx -y @withone/mcp`. Two small helpers make the calls reliable.",
        command: 'pip install "crewai-tools[mcp]==1.15.2"',
        keyLabel: "CrewAI docs",
        keyUrl: "https://docs.crewai.com",
        playbookAnchor: "crewai-with-one",
      },
      {
        slug: "parasail",
        name: "Parasail",
        logo: "/partners/parasail.svg",
        logoStyle: "tile",
        tagline: "Fast, low-cost inference on open models.",
        onOne:
          "Parasail runs the model, One gives it the apps. Point your crew's LLM at Parasail's OpenAI-compatible API and keep One's three tools for every action. Add a payment method or credits first: without one, every inference call returns 403.",
        command: "export PARASAIL_API_KEY=...",
        keyLabel: "Get a Parasail API key",
        keyUrl: "https://www.saas.parasail.io/keys",
        playbookAnchor: "parasail-with-one",
      },
    ],
    co: [
      { name: "AWS", logo: "/partners/aws.svg", url: "https://aws.amazon.com", height: 28 },
      { name: "UpScaleX", logo: "/partners/upscalex.png", url: "https://www.upscalex.ai" },
      { name: "Founders Bay", logo: "/partners/founders-bay-light.png", url: "https://www.foundersbay.com" },
    ],
  },
  templates: {
    title: "Starting points for both tracks.",
    lede: "Clone one, fill in .env, and run it. Each one uses You.com, One, CrewAI and Parasail, and works end to end before you change a line.",
    items: [
      {
        slug: "exorcism-swarm",
        title: "Exorcism swarm",
        track: 1,
        body: "A CrewAI crew of three agents (Sentinel, Analyst, Dispatcher) running on a Parasail model, each scoped to different One tools and seeing only part of the facility. They check live reports with You.com, share sightings in Slack, file each containment in Linear, and the Dispatcher decides who moves where.",
        prompt:
          "Watch the facility feed, flag any outbreak, agree on a containment plan as a crew, and log every action to #containment.",
        platforms: ["you", "parasail", "slack", "linear"],
        framework: "CrewAI",
      },
      {
        slug: "haunted-command-station",
        title: "Haunted command station",
        track: 2,
        body: "A small CrewAI crew pulls live incident data with You.com Search, sends it to a model on Parasail to decide what the dashboard should show, and streams the generated UI to the browser over WebSockets. One sends the alerts it raises to Slack and Linear.",
        prompt:
          "Turn the latest incident logs into a live command station with a threat map, an activity chart and the top three alerts.",
        platforms: ["you", "parasail", "slack", "linear"],
      },
    ],
  },
  helpVenueLine: "Or find the One team at the AWS Builder Loft.",
  footerLine: "Hack With YOU · Halloween Edition · San Francisco",
  og: {
    tag: "SF",
    headline: "Build with One at Hack With YOU: Halloween Edition.",
    subline: "Install the skill, connect your apps, and build with You.com, CrewAI and Parasail.",
  },
};
