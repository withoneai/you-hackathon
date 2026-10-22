import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { PLATFORM_LABELS, TEMPLATES_PUBLIC, TEMPLATES_URL } from "@/lib/site";

type Template = {
  slug: string;
  title: string;
  track: 1 | 2;
  body: string;
  prompt: string;
  platforms: string[];
  framework?: string;
};

const TEMPLATES: Template[] = [
  {
    slug: "exorcism-swarm",
    title: "Exorcism swarm",
    track: 1,
    body: "A CrewAI crew of three agents (Sentinel, Analyst, Dispatcher) running on a Parasail model, each scoped to different One tools and seeing only part of the facility. They check live reports with You.com, share sightings in Slack, file each containment in Linear, and the Dispatcher decides who moves where.",
    prompt: "Watch the facility feed, flag any outbreak, agree on a containment plan as a crew, and log every action to #containment.",
    platforms: ["you", "parasail", "slack", "linear"],
    framework: "CrewAI",
  },
  {
    slug: "haunted-command-station",
    title: "Haunted command station",
    track: 2,
    body: "A small CrewAI crew pulls live incident data with You.com Search, sends it to a model on Parasail to decide what the dashboard should show, and streams the generated UI to the browser over WebSockets. One sends the alerts it raises to Slack and Linear.",
    prompt: "Turn the latest incident logs into a live command station with a threat map, an activity chart and the top three alerts.",
    platforms: ["you", "parasail", "slack", "linear"],
  },
];

function Mark({ slug }: { slug: string }) {
  const src = slug === "you" || slug === "parasail" ? `/partners/${slug}.svg` : `/platforms/${slug}.svg`;
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

function Badge({ slug, track }: { slug: string; track: number }) {
  const cls =
    "rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-10 uppercase tracking-label";
  if (!TEMPLATES_PUBLIC) {
    return <span className={`${cls} text-muted`}>Template · coming soon · Track {track}</span>;
  }
  return (
    <a
      href={`${TEMPLATES_URL}/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center gap-1 text-foreground transition-colors hover:border-border-strong hover:text-spring`}
    >
      Template · ready · Track {track} <ArrowUpRight size={11} />
    </a>
  );
}

export function UseCaseTemplates() {
  return (
    <section id="templates" className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Use-case templates"
            title="Starting points for both tracks."
            lede={
              TEMPLATES_PUBLIC
                ? "Clone one, fill in .env, and run it. Each one uses You.com, One, CrewAI and Parasail, and works end to end before you change a line."
                : "Two working templates are ready. The links go live when the repository is public. Until then the prompts are yours to steal."
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEMPLATES.map((t, i) => (
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
