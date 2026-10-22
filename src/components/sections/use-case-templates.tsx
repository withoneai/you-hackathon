import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import type { HackathonEvent } from "@/events";
import { PARTNER_MARKS, PLATFORM_LABELS, TEMPLATES_PUBLIC, TEMPLATES_URL } from "@/lib/site";


function Mark({ slug }: { slug: string }) {
  const src = PARTNER_MARKS.has(slug) ? `/partners/${slug}.svg` : `/platforms/${slug}.svg`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={PLATFORM_LABELS[slug] ?? slug}
      title={PLATFORM_LABELS[slug] ?? slug}
      width={26}
      height={26}
      loading="lazy"
      className="h-[26px] w-[26px] rounded-full ring-2 ring-surface"
    />
  );
}

function Badge({ slug, track }: { slug: string; track?: number }) {
  const trackLabel = track ? ` · Track ${track}` : "";
  const cls =
    "rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-10 uppercase tracking-label";
  if (!TEMPLATES_PUBLIC) {
    return <span className={`${cls} text-muted`}>Template · coming soon{trackLabel}</span>;
  }
  return (
    <a
      href={`${TEMPLATES_URL}/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center gap-1 text-foreground transition-colors hover:border-border-strong hover:text-spring`}
    >
      Template · ready{trackLabel} <ArrowUpRight size={11} />
    </a>
  );
}

export function UseCaseTemplates({ event }: { event: HackathonEvent }) {
  const { title, lede, items } = event.templates;
  return (
    <section id="templates" className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Use-case templates"
            title={title}
            lede={TEMPLATES_PUBLIC ? lede : "Working templates are ready. The links go live when the repository is public. Until then the prompts are yours to steal."}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={t.slug} delay={i * 70} className="flex">
              <article className="flex w-full flex-col rounded-card border border-dashed border-border-strong bg-surface/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex -space-x-2">
                    {t.platforms.map((p) => (
                      <Mark key={p} slug={p} />
                    ))}
                  </div>
                  <Badge slug={t.slug} track={t.track} />
                </div>
                <h3 className="mt-4 text-[17px] font-medium text-foreground">
                  {t.title}
                  {t.framework && <span className="ml-2 font-mono text-11 text-muted">via {t.framework}</span>}
                </h3>
                <p className="mt-2 text-13 leading-relaxed text-secondary">{t.body}</p>
                <blockquote className="mt-4 rounded-panel border border-border bg-surface px-4 py-3 font-mono text-[12px] leading-relaxed text-secondary">
                  “{t.prompt}”
                </blockquote>
                {TEMPLATES_PUBLIC && (
                  <a
                    href={`${TEMPLATES_URL}/${t.slug}#readme`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-13 font-medium text-foreground transition-colors hover:text-spring"
                  >
                    Read the guide <ArrowUpRight size={12} />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
