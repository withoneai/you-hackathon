import { ArrowRight, ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CopySkillButton } from "@/components/ui/copy-skill-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { eventUrls, type HackathonEvent } from "@/events";
import { SkillInstaller } from "./skill-installer";

export function SkillCallout({ event }: { event: HackathonEvent }) {
  const urls = eventUrls(event);
  return (
    <section id="skill" className="relative border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionIntro
              eyebrow="The primary skill"
              title="One skill. Everything your agent needs to build here."
              lede="Works in Claude Code, Cursor, Codex or any agent that reads markdown."
            />
            <ul className="mt-8 space-y-3">
              {event.skill.teaches.map((item) => (
                <li key={item} className="flex items-start gap-3 text-15 text-secondary">
                  <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-spring" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={urls.skillPagePath}
                className="inline-flex items-center gap-1.5 text-13 font-medium text-foreground transition-colors hover:text-spring"
              >
                Review the skill <ArrowRight size={14} />
              </Link>
              <a
                href={urls.skillRawPath}
                className="inline-flex items-center gap-1.5 text-13 text-secondary transition-colors hover:text-foreground"
              >
                Raw markdown <ArrowUpRight size={13} />
              </a>
              <CopySkillButton path={urls.skillRawPath} />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SkillInstaller skillRawUrl={urls.skillRaw} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
