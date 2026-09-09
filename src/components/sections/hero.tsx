import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EVENT, LINKS } from "@/lib/site";
import { SignalLine } from "./signal-line";
import { PASTE_PROMPT, SkillInstaller } from "./skill-installer";

const facts = [
  { label: "Date", value: EVENT.date },
  { label: "Time", value: EVENT.time },
  { label: "Venue", value: EVENT.venue },
  { label: "Theme", value: EVENT.theme },
];

export function Hero({ platformLabel }: { platformLabel: string }) {
  return (
    <section className="relative border-b border-border">
      <div className="mx-auto max-w-[1180px] px-5 pb-8 pt-14 sm:px-8 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <div className="animate-fade-up">
              <Eyebrow dot="lime">
                {EVENT.host} × One · {EVENT.edition} · {EVENT.dateShort}
              </Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 max-w-[16ch] font-serif text-[40px] leading-[1.04] tracking-display text-foreground sm:text-[52px] lg:text-[60px]"
              style={{ animationDelay: "80ms" }}
            >
              Build with One at the Live Web Agent Hackathon.
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-[46ch] text-15 text-secondary sm:text-[17px]"
              style={{ animationDelay: "160ms" }}
            >
              Managed auth and {platformLabel} apps behind four tools. Install the skill, connect
              your apps, and spend the day on the agent.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <CopyButton
                variant="lime"
                text={PASTE_PROMPT}
                label="Install the skill"
                copiedLabel="Prompt copied. Paste it into your agent."
              />
              <Button href={LINKS.dashboard} variant="outline" size="md">
                Open the dashboard <ArrowUpRight />
              </Button>
            </div>
            <p className="animate-fade-up mt-3 text-13 text-muted" style={{ animationDelay: "300ms" }}>
              Copies the one-line install prompt. Or pick your client{" "}
              <span className="lg:hidden">below</span>
              <span className="hidden lg:inline">on the right</span>.
            </p>
          </div>

          <div className="animate-fade-up min-w-0" style={{ animationDelay: "200ms" }}>
            <SkillInstaller id="install" />
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-[1180px] px-5 sm:px-8 md:block">
        <SignalLine className="relative" />
      </div>

      <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-6 sm:px-8 md:pt-2">
        <dl className="grid grid-cols-2 overflow-hidden rounded-card border border-border bg-surface md:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={[
                "px-5 py-4",
                i % 2 === 1 ? "border-l border-border" : "",
                i >= 2 ? "border-t border-border md:border-t-0" : "",
                i >= 1 ? "md:border-l" : "",
              ].join(" ")}
            >
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1.5 text-15 text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-13 text-muted">
          <a
            href={LINKS.luma}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary transition-colors hover:text-foreground"
          >
            Event page on Luma <ArrowUpRight size={12} />
          </a>
          <span className="hidden sm:inline">·</span>
          <span>Hosted by {EVENT.host} with One, Daytona, CrewAI, Founders Bay and Clean Data Alliance.</span>
        </p>
      </div>
    </section>
  );
}
