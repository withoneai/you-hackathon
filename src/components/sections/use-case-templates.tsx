import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { PLATFORM_LABELS, TEMPLATES_PUBLIC, TEMPLATES_URL } from "@/lib/site";

type Template = {
  slug: string;
  title: string;
  body: string;
  prompt: string;
  platforms: string[];
  framework?: string;
};

const TEMPLATES: Template[] = [
  {
    slug: "self-repairing-research",
    title: "Self-repairing research agent",
    body: "Researches with You.com, charts the result in a Daytona sandbox, repairs the script from the error, emails the PNG, and remembers the fix so the next run passes first time.",
    prompt: "Research the most cited papers on self-repairing agents, chart their citation counts in a sandbox, and email me the PNG.",
    platforms: ["you", "daytona", "gmail"],
  },
  {
    slug: "support-triage-crew",
    title: "Support triage crew",
    body: "A crew reads the inbox, skips reports it already filed, reproduces each new bug in a sandbox through One's MCP tools, files it in Linear and posts to Slack.",
    prompt: "Triage every unread support email, file real bugs in Linear with repro steps, and post the list to #support.",
    platforms: ["gmail", "daytona", "linear", "slack"],
    framework: "CrewAI",
  },
  {
    slug: "market-watch",
    title: "Market watch",
    body: "Finance Research on a watchlist, written to Notion and digested in Slack. Tell it what you prefer and the next brief follows it, with a section on what changed since the last one.",
    prompt: "Every morning at 8, research what moved for my watchlist, save the sourced brief to Notion, and ping #markets.",
    platforms: ["you", "notion", "slack"],
  },
  {
    slug: "pr-reviewer-that-learns",
    title: "An agent that learns",
    body: "Reviews a pull request, then turns your replies into rules it applies on the next one. Every review lists which learned rules it used.",
    prompt: "When a PR is opened, review it using the rules you learned from my earlier feedback, and remember the outcome.",
    platforms: ["github"],
  },
];

function Mark({ slug }: { slug: string }) {
  const src = slug === "you" || slug === "daytona" ? `/partners/${slug}.svg` : `/platforms/${slug}.svg`;
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

function Badge({ slug }: { slug: string }) {
  const cls =
    "rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-10 uppercase tracking-label";
  if (!TEMPLATES_PUBLIC) {
    return <span className={`${cls} text-muted`}>Template · coming soon</span>;
  }
  return (
    <a
      href={`${TEMPLATES_URL}/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center gap-1 text-foreground transition-colors hover:border-border-strong hover:text-spring`}
    >
      Template · ready <ArrowUpRight size={11} />
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
            title="Starting points for the theme: agents that repair and learn."
            lede={
              TEMPLATES_PUBLIC
                ? "Four working templates. Clone one, fill in .env, run it twice and watch the second run use what the first one learned."
                : "Four working templates are ready. The links go live when the repository is public. Until then the prompts are yours to steal."
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
                  <Badge slug={t.slug} />
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
