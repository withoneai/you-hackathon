import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { eventUrls, type HackathonEvent } from "@/events";
import { LINKS } from "@/lib/site";
import { HeroArt } from "./hero-art";
import { SignalLine } from "./signal-line";
import { pastePrompt, SkillInstaller } from "./skill-installer";

export function Hero({ event }: { event: HackathonEvent }) {
  const urls = eventUrls(event);
  return (
    <section className="relative overflow-hidden border-b border-border">
      {event.heroArt === "halloween" && (
        <HeroArt className="pointer-events-none absolute -top-10 right-[-140px] hidden h-[440px] w-[586px] opacity-60 md:block lg:right-[-60px] xl:right-[max(-20px,calc((100vw-1180px)/2-160px))]" />
      )}
      <div className="relative mx-auto max-w-[1180px] px-5 pb-8 pt-14 sm:px-8 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <div className="animate-fade-up">
              <Eyebrow dot={event.accentDot}>
                {event.host} × One · {event.edition} · {event.dateShort}
              </Eyebrow>
            </div>
            <h1
              className="animate-fade-up mt-6 max-w-[16ch] font-serif text-[40px] leading-[1.04] tracking-display text-foreground sm:text-[52px] lg:text-[60px]"
              style={{ animationDelay: "80ms" }}
            >
              {event.headline}
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-[46ch] text-15 text-secondary sm:text-[17px]"
              style={{ animationDelay: "160ms" }}
            >
              {event.subhead}
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <CopyButton
                variant="lime"
                text={pastePrompt(urls.skillRaw)}
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
            <SkillInstaller id="install" skillRawUrl={urls.skillRaw} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto hidden max-w-[1180px] px-5 sm:px-8 md:block">
        <SignalLine className="relative" signal={event.signal} />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 pb-10 pt-6 sm:px-8 md:pt-2">
        <dl className="grid grid-cols-2 overflow-hidden rounded-card border border-border bg-surface md:grid-cols-4">
          {event.facts.map((f, i) => (
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
            href={event.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-secondary transition-colors hover:text-foreground"
          >
            Event page on Luma <ArrowUpRight size={12} />
          </a>
          <span className="hidden sm:inline">·</span>
          <span>{event.hostsLine}</span>
        </p>

        {event.tracks && (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {event.tracks.map((t) => (
              <li
                key={t.slug}
                className={[
                  "rounded-card border p-5",
                  t.number === 1 ? "border-pumpkin/25 bg-pumpkin-tint/60" : "border-hex/25 bg-hex-tint/60",
                ].join(" ")}
              >
                <Eyebrow dot={t.number === 1 ? "pumpkin" : "hex"}>
                  Track {t.number} · {t.kind}
                </Eyebrow>
                <h3 className="mt-2 text-[17px] font-medium text-foreground">{t.name}</h3>
                <p className="mt-1.5 text-13 leading-relaxed text-secondary">{t.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
