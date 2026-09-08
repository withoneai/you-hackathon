import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EVENT, LINKS } from "@/lib/site";
import { LogoWall } from "./logo-wall";
import { SignalLine } from "./signal-line";

const facts = [
  { label: "Date", value: EVENT.date },
  { label: "Time", value: EVENT.time },
  { label: "Venue", value: EVENT.venue },
  { label: "Theme", value: EVENT.theme },
];

export function Hero({ platformLabel }: { platformLabel: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <LogoWall />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgb(63 227 165 / 0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-5 pb-8 pt-16 sm:px-8 md:pt-24">
        <div className="animate-fade-up">
          <Eyebrow dot="lime">
            {EVENT.host} × One · {EVENT.edition} · {EVENT.dateShort}
          </Eyebrow>
        </div>
        <h1
          className="animate-fade-up mt-6 max-w-[16ch] font-serif text-[40px] leading-[1.04] tracking-display text-foreground sm:text-[56px] lg:text-[68px]"
          style={{ animationDelay: "80ms" }}
        >
          Build with One at the Live Web Agent Hackathon.
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-[60ch] text-15 text-secondary sm:text-[17px]"
          style={{ animationDelay: "160ms" }}
        >
          One gives your agent managed auth and {platformLabel} apps behind four tools. Install
          the skill, connect You.com, Daytona and the apps your idea needs, and spend the day on
          the agent instead of the plumbing.
        </p>

        <div
          className="animate-fade-up relative mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <span aria-hidden className="halo absolute -left-16 -top-14 -z-10 h-[190px] w-[340px]" />
          <Button href="#skill" variant="lime" size="lg">
            Install the skill
          </Button>
          <Button href={LINKS.dashboard} variant="outline" size="lg">
            Open the dashboard <ArrowUpRight />
          </Button>
          <a
            href="#setup"
            className="ml-1 text-13 text-secondary underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-spring"
          >
            or see the three ways to use One
          </a>
        </div>
      </div>

      <div className="relative mx-auto hidden max-w-[1180px] px-5 sm:px-8 md:block">
        <SignalLine className="relative" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 pb-10 pt-6 sm:px-8 md:pt-2">
        <dl className="grid grid-cols-2 overflow-hidden rounded-card border border-border bg-surface/70 backdrop-blur-sm md:grid-cols-4">
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
            Event page and registration on Luma <ArrowUpRight size={12} />
          </a>
          <span className="hidden sm:inline">·</span>
          <span>Hosted by {EVENT.host}. In partnership with One, Daytona, CrewAI, Founders Bay and Clean Data Alliance.</span>
        </p>
      </div>
    </section>
  );
}
