import { ArrowLeft, ArrowUpRight, DiscordLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { HackathonEvent } from "@/events";
import { LINKS } from "@/lib/site";

const nav = [
  { label: "Skill", href: "#skill" },
  { label: "Setup", href: "#setup" },
  { label: "Partners", href: "#partners" },
  { label: "Templates", href: "#templates" },
  { label: "Help", href: "#help" },
];

/** The One logo in both modes; CSS shows the one that matches `data-theme`. */
export function OneLogo({ className }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logo-full-light.svg" alt="One" width={86} height={27} className={`${className} dark:hidden`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logo-full-dark.svg" alt="One" width={86} height={27} className={`${className} hidden dark:block`} />
    </>
  );
}

/**
 * With an event, the event page's header: section anchors, its Discord and "Get the skill".
 * `sectionBase` prefixes the anchors on pages that are not the event page itself (the skill).
 * Without an event (the hub), just One's own links.
 */
export function Header({ event, sectionBase = "" }: { event?: HackathonEvent; sectionBase?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-6 px-5 sm:px-8">
        <Link href={event ? `/${event.slug}` : "/"} className="flex items-center gap-3" aria-label={event ? `${event.name} home` : "All hackathons"}>
          <OneLogo className="h-[26px] w-auto" />
          <span className="hidden font-mono text-10 uppercase tracking-label text-muted sm:inline">
            {event ? event.headerLabel : "Hackathons"}
          </span>
        </Link>
        {event && (
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-control px-2 py-1.5 text-13 text-secondary transition-colors hover:bg-surface-2 hover:text-foreground lg:inline-flex"
          >
            <ArrowLeft size={13} /> All events
          </Link>
        )}

        {event && (
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Sections">
            {(event.connectSection ? [{ label: "Connect", href: "#connect" }, ...nav] : nav).map((item) => (
              <a
                key={item.href}
                href={`${sectionBase}${item.href}`}
                className="rounded-control px-3 py-1.5 text-13 text-secondary transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className={event ? "ml-auto flex items-center gap-1.5 md:ml-0" : "ml-auto flex items-center gap-1.5"}>
          <a
            href={LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-control px-3 py-1.5 text-13 text-secondary transition-colors hover:bg-surface-2 hover:text-foreground sm:inline-flex"
          >
            Docs <ArrowUpRight size={13} />
          </a>
          <a
            href={LINKS.dashboard}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-control px-3 py-1.5 text-13 text-secondary transition-colors hover:bg-surface-2 hover:text-foreground sm:inline-flex"
          >
            Dashboard <ArrowUpRight size={13} />
          </a>
          <ThemeToggle />
          {event ? (
            <>
              <a
                href={event.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join the Discord"
                className="inline-flex h-9 w-9 items-center justify-center rounded-control text-secondary transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <DiscordLogo size={18} weight="fill" />
              </a>
              <Button href={`${sectionBase}#skill`} variant="ink" size="sm" className="ml-1">
                Get the skill
              </Button>
            </>
          ) : (
            <Button href={LINKS.home} variant="ink" size="sm" className="ml-1">
              withone.ai <ArrowUpRight />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
