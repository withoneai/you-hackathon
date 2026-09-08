import Link from "next/link";
import { LINKS } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string; internal?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: LINKS.dashboard },
      { label: "API keys", href: LINKS.apiKeys },
      { label: "Logs", href: LINKS.logs },
      { label: "Billing", href: LINKS.billing },
      { label: "Pricing", href: LINKS.pricing },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Welcome", href: LINKS.docs },
      { label: "Getting started", href: LINKS.docsGettingStarted },
      { label: "CLI", href: LINKS.docsCli },
      { label: "MCP", href: LINKS.docsMcp },
      { label: "Install guides", href: LINKS.docsInstall },
      { label: "Relay", href: LINKS.docsRelay },
      { label: "API reference", href: LINKS.docsApi },
      { label: "Connect (embed in your product)", href: LINKS.connectRepo },
    ],
  },
  {
    title: "Hackathon",
    links: [
      { label: "Event page (Luma)", href: LINKS.luma },
      { label: "Discord", href: LINKS.discord },
      { label: "The skill", href: "/skill", internal: true },
      { label: "Raw skill (skill.md)", href: "/skill.md" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Knowledge base", href: LINKS.knowledge },
      { label: "GitHub", href: LINKS.github },
      { label: "X", href: LINKS.x },
      { label: "Support", href: LINKS.support },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo-full-dark.svg" alt="One" className="h-7 w-auto" />
            <p className="mt-4 max-w-[30ch] text-13 text-secondary">
              The trust layer for AI agents. Managed auth, access control and audit for every app
              your agent touches.
            </p>
            <a
              href={LINKS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-13 text-muted transition-colors hover:text-foreground"
            >
              withone.ai
            </a>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.internal ? (
                      <Link href={l.href} className="text-13 text-secondary transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-13 text-secondary transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-11 text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 One Systems, Inc.</span>
          <span className="font-mono uppercase tracking-label">Build with YOU · Hosted by You.com · NYC</span>
        </div>
      </div>
    </footer>
  );
}
