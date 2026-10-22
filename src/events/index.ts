import { SITE_URL } from "@/lib/site";
import { nyc2026 } from "./nyc-2026";
import { sfHalloween2026 } from "./sf-halloween-2026";
import type { HackathonEvent } from "./types";

export type { HackathonEvent } from "./types";

/** Every event, newest first. Add a new one here and give it a skill under content/events/<slug>/. */
export const EVENTS: HackathonEvent[] = [sfHalloween2026, nyc2026].sort(
  (a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt),
);

export function getEvent(slug: string): HackathonEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export type EventStatus = "upcoming" | "live" | "past";

export function eventStatus(event: HackathonEvent, now = Date.now()): EventStatus {
  if (now > Date.parse(event.endsAt)) return "past";
  if (now >= Date.parse(event.startsAt)) return "live";
  return "upcoming";
}

export type EventWithStatus = { event: HackathonEvent; status: EventStatus };

/** The hub's two lists: soonest first for what is coming, most recent first for what has passed. */
export function splitEvents(now = Date.now()): { upcoming: EventWithStatus[]; past: EventWithStatus[] } {
  const all = EVENTS.map((event) => ({ event, status: eventStatus(event, now) }));
  return {
    upcoming: all
      .filter((e) => e.status !== "past")
      .sort((a, b) => Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt)),
    past: all.filter((e) => e.status === "past"),
  };
}

/**
 * The event that /skill and /skill.md serve: the next one that has not ended, else the
 * most recent. Install prompts shared before the hub existed point at those paths.
 */
export function currentEvent(now = Date.now()): HackathonEvent {
  const open = EVENTS.filter((e) => eventStatus(e, now) !== "past").sort(
    (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
  );
  return open[0] ?? EVENTS[0];
}

export function eventUrls(event: HackathonEvent) {
  const page = `${SITE_URL}/${event.slug}`;
  return {
    page,
    pagePath: `/${event.slug}`,
    skillPage: `${page}/skill`,
    skillPagePath: `/${event.slug}/skill`,
    skillRaw: `${page}/skill.md`,
    skillRawPath: `/${event.slug}/skill.md`,
  };
}
