/**
 * One hackathon, described as data. Every event page, skill route and hub card
 * reads from one of these, so adding an event is a new file in src/events/ plus
 * its skill at content/events/<slug>/skill.md.
 */

/** The design system an event page renders in. Tokens for each live in globals.css. */
export type EventTheme = "carbon" | "paper";

export type Partner = {
  slug: string;
  name: string;
  logo: string;
  /** "round" shows the mark as a 40px circle; "tile" puts a smaller mark on a bordered tile. */
  logoStyle: "round" | "tile";
  /** A white mark that needs inverting on a light theme. */
  mono?: boolean;
  tagline: string;
  onOne: string;
  command: string;
  keyLabel: string;
  keyUrl: string;
  /** Section anchor in this event's skill. */
  playbookAnchor: string;
};

export type CoPartner = {
  name: string;
  logo: string;
  url: string;
  /** Show the name next to a mark that does not spell it out. */
  showName?: boolean;
  /** Logo height in px. Defaults to 32. */
  height?: number;
};

export type Track = {
  slug: string;
  number: number;
  name: string;
  kind: string;
  body: string;
};

export type Template = {
  slug: string;
  title: string;
  body: string;
  prompt: string;
  platforms: string[];
  framework?: string;
  track?: number;
};

export type HackathonEvent = {
  slug: string;
  /** Short name, e.g. "Hack With YOU". */
  name: string;
  /** e.g. "Halloween Edition". */
  subtitle: string;
  host: string;
  city: string;
  /** The hero eyebrow's middle part, e.g. "San Francisco / Edition 003". */
  edition: string;
  /** One or two sentences for the hub card. */
  summary: string;
  /** ISO timestamps with offset. The hub sorts and splits upcoming and past on these. */
  startsAt: string;
  endsAt: string;
  date: string;
  dateShort: string;
  time: string;
  venue: string;
  theme: EventTheme;
  /** The tools every team builds with, shown on the hub card. */
  stack: string[];

  lumaUrl: string;
  discordUrl: string;
  couponCode: string;
  appCountLabel: string;

  headerLabel: string;
  headline: string;
  subhead: string;
  facts: { label: string; value: string }[];
  hostsLine: string;
  tracks?: Track[];
  heroArt?: "halloween";
  /** Labels and colours for the detour on the hero's day-timeline. */
  signal: { out: string; back: string; outColor: string; backColor: string; pulseColor: string };
  /** The hero eyebrow's dot. */
  accentDot: "lime" | "pumpkin";

  perk: { prizeLine: string; prizeRest: string };
  skill: { teaches: string[]; pageDescription: string };
  setup: { connectHelp: string; connectCommands: string[] };
  loopDemo: { secondConnection: string; query: string };
  partners: { lede: string; cards: Partner[]; co: CoPartner[] };
  templates: { title: string; lede: string; items: Template[] };
  helpVenueLine: string;
  footerLine: string;
  og: { tag: string; headline: string; subline: string };
};
