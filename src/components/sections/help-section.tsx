import { ArrowUpRight, DiscordLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { LINKS } from "@/lib/site";

const OTHER = [
  { label: "Docs", body: "Welcome, CLI, MCP, install guides, API reference.", href: LINKS.docs },
  { label: "Every call you made", body: "Request and response logs for debugging.", href: LINKS.logs },
  { label: "Email", body: "support@withone.ai for account or billing questions.", href: LINKS.support },
];

export function HelpSection() {
  return (
    <section id="help" className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <div className="grid gap-8 overflow-hidden rounded-surface border border-border bg-surface p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>Get help</Eyebrow>
              <h2 className="mt-4 font-serif text-[32px] leading-[1.1] tracking-display text-foreground sm:text-[40px]">
                Stuck? The One team is in the Discord all day.
              </h2>
              <p className="mt-4 max-w-[52ch] text-15 text-secondary">
                Engineers from One answer setup, connection and action questions in real time
                during the hackathon. Bring the exact command or tool call and the error, and
                you will be unblocked fast. Jacob Rissman, Head of GTM at One, is on site too.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button href={LINKS.discord} variant="lime" size="lg">
                  <DiscordLogo weight="fill" /> Join the Discord
                </Button>
                <span className="text-13 text-muted">Or find the One table at the venue.</span>
              </div>
            </div>
            <ul className="grid gap-3 self-center">
              {OTHER.map((o) => (
                <li key={o.label}>
                  <a
                    href={o.href}
                    target={o.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 rounded-panel border border-border bg-background/50 px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface-2"
                  >
                    <span>
                      <span className="block text-13 font-medium text-foreground">{o.label}</span>
                      <span className="block text-13 text-secondary">{o.body}</span>
                    </span>
                    <ArrowUpRight size={14} className="mt-1 shrink-0 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
