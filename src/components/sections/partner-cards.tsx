import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { InlineCode } from "@/components/ui/inline-code";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { CommandRow } from "@/components/ui/terminal";
import { AGENT_CLIENTS, CO_PARTNERS, PARTNERS } from "@/lib/site";
import { PlatformGrid } from "./platform-grid";

export function PartnerCards({ platformLabel }: { platformLabel: string }) {
  return (
    <section id="partners" className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Build with the sponsors"
            title="Everyone here builds on the same stack. One wires it together."
            lede="You.com and Daytona are platforms on One. CrewAI runs One's four tools as a local MCP server."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} className="flex">
              <article className="flex w-full flex-col rounded-card border border-border bg-surface p-6 transition-colors hover:border-border-strong">
                <div className="flex items-center gap-3">
                  <Logo src={p.logo} alt={p.name} size={p.slug === "crewai" ? 26 : 40} tile={p.slug === "crewai"} className={p.slug === "crewai" ? "" : "rounded-full"} />
                  <div>
                    <h3 className="text-[17px] font-medium text-foreground">{p.name}</h3>
                    <p className="text-13 text-muted">{p.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 text-13 leading-relaxed text-secondary">
                  <InlineCode text={p.onOne} />
                </p>
                <div className="mt-auto pt-5">
                  <CommandRow className="bg-background/60" action={<CopyButton text={p.command} size="sm" />}>
                    {p.command}
                  </CommandRow>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <a
                      href={p.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
                    >
                      {p.keyLabel} <ArrowUpRight size={12} />
                    </a>
                    <Link
                      href={`/skill#${p.playbookAnchor}`}
                      className="inline-flex items-center gap-1 text-13 font-medium text-foreground transition-colors hover:text-spring"
                    >
                      Playbook <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12">
          <div className="flex flex-col gap-4 rounded-card border border-border bg-surface/60 p-5 sm:flex-row sm:items-center sm:justify-between">
            <Eyebrow dot="muted">Also in partnership with</Eyebrow>
            <div className="flex flex-wrap items-center gap-6">
              {CO_PARTNERS.map((c) => (
                <a
                  key={c.name}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt={c.name} className="h-8 w-auto" loading="lazy" />
                  {c.name === "Clean Data Alliance" && (
                    <span className="text-13 font-medium text-foreground">{c.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={160} className="mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <Eyebrow>…and {platformLabel} more apps</Eyebrow>
            <a
              href="https://www.withone.ai/knowledge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
            >
              Browse every platform <ArrowUpRight size={12} />
            </a>
          </div>
          <PlatformGrid />
        </Reveal>

        <Reveal delay={200} className="mt-14">
          <Eyebrow dot="muted">Works in</Eyebrow>
          <ul className="mt-4 flex flex-wrap gap-2">
            {AGENT_CLIENTS.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-2 pr-3.5 text-13 text-secondary"
              >
                <Logo src={a.logo} alt="" size={18} />
                {a.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
