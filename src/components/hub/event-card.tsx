import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { HeroArt } from "@/components/sections/hero-art";
import type { EventStatus, HackathonEvent } from "@/events";
import { cn } from "@/lib/utils";

const STATUS: Record<EventStatus, { label: string; className: string }> = {
  live: { label: "Happening now", className: "border-transparent bg-lime text-on-lime" },
  upcoming: { label: "Upcoming", className: "border-spring/30 bg-spring-tint text-spring" },
  past: { label: "Past", className: "border-border bg-surface-2 text-secondary" },
};

/** The card's cover: the moon for Halloween, the signal line for the rest. */
function Cover({ event }: { event: HackathonEvent }) {
  const halloween = event.heroArt === "halloween";
  return (
    <div
      className={cn(
        "relative h-40 overflow-hidden border-b border-border",
        halloween && "bg-[linear-gradient(120deg,var(--pumpkin-tint),var(--hex-tint))]",
      )}
    >
      {halloween ? (
        <HeroArt className="pointer-events-none absolute -right-24 -top-16 h-[260px] w-[347px] opacity-80" />
      ) : (
        <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 160" fill="none">
          <path d="M0 52 H120 C150 52 150 110 180 110 H400" stroke="var(--line-strong)" strokeWidth="1.5" />
          <path d="M0 52 H120 C150 52 150 110 180 110 H400" className="dash-line" stroke="var(--spring)" strokeOpacity="0.6" strokeWidth="1.5" />
        </svg>
      )}
      <div className="relative flex h-full flex-col justify-between p-5">
        <p className="font-mono text-10 uppercase tracking-label text-muted">
          {event.host} × One · {event.city}
        </p>
        <p className="max-w-[18ch] font-serif text-[26px] leading-[1.05] text-foreground">{event.name}</p>
      </div>
    </div>
  );
}

export function EventCard({ event, status }: { event: HackathonEvent; status: EventStatus }) {
  const s = STATUS[status];
  return (
    <Link
      href={`/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-lift transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-lift-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-spring/30"
    >
      <Cover event={event} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-0.5 text-11 font-medium", s.className)}>{s.label}</span>
          <span className="text-13 text-secondary">{event.dateShort}</span>
        </div>
        <h3 className="mt-3 text-[17px] font-semibold text-foreground">
          {event.name}: {event.subtitle}
        </h3>
        <p className="mt-1 text-13 text-muted">{event.venue}</p>
        <p className="mt-3 text-13 leading-relaxed text-secondary">{event.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
          {event.stack.map((tool) => (
            <li key={tool} className="rounded-panel border border-border bg-background px-2 py-0.5 font-mono text-11 text-secondary">
              {tool}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-13 font-medium text-foreground">
          {status === "past" ? "Event page, skill and templates" : "Event page and skill"}
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
