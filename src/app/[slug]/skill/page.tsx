import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { SkillMarkdown } from "@/components/skill-markdown";
import { CopySkillButton } from "@/components/ui/copy-skill-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { notFound } from "next/navigation";
import { EVENTS, eventUrls, getEvent } from "@/events";
import { getSkill } from "@/lib/skill";

export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]/skill">): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return {
    title: `The one-hackathon skill · ${event.name}: ${event.subtitle}`,
    description: event.skill.pageDescription,
    alternates: { canonical: eventUrls(event).skillPage },
  };
}

export default async function SkillPage({ params }: PageProps<"/[slug]/skill">) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  const urls = eventUrls(event);
  const skill = getSkill(event.slug);
  const firstLine = skill.description.split("\n")[0]?.trim();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header event={event} sectionBase={urls.pagePath} />
      <main className="flex-1">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 md:py-16">
          <Link
            href={urls.pagePath}
            className="inline-flex items-center gap-1.5 text-13 text-secondary transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to {event.name}: {event.subtitle}
          </Link>

          <div className="mt-6 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[70ch]">
              <Eyebrow>Skill · v1 · {skill.headings.filter((h) => h.depth === 2).length} sections</Eyebrow>
              <h1 className="mt-3 font-mono text-[30px] font-medium tracking-tight text-foreground sm:text-[36px]">
                {skill.name}
              </h1>
              <p className="mt-3 text-15 text-secondary">{firstLine}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CopySkillButton variant="lime" path={urls.skillRawPath} />
              <a
                href={urls.skillRawPath}
                className="inline-flex h-10 items-center gap-1.5 rounded-control border border-border-strong bg-surface/40 px-4 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                Raw markdown <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className="min-w-0">
              <SkillMarkdown content={skill.content} />
            </article>
            <aside className="hidden lg:block">
              <nav className="sticky top-24" aria-label="On this page">
                <p className="eyebrow">On this page</p>
                <ol className="mt-3 space-y-1 border-l border-border">
                  {skill.headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={[
                          "-ml-px block border-l border-transparent py-1 text-13 text-secondary transition-colors hover:border-spring hover:text-foreground",
                          h.depth === 3 ? "pl-6 text-muted" : "pl-3",
                        ].join(" ")}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-11 text-muted">
                  Install path and raw URL:
                  <br />
                  <code className="font-mono text-secondary break-all">{urls.skillRaw}</code>
                </p>
              </nav>
            </aside>
          </div>
        </div>
      </main>
      <Footer event={event} />
    </div>
  );
}
