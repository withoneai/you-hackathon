import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { PLATFORM_LABELS } from "@/lib/site";

type Template = {
  title: string;
  body: string;
  prompt: string;
  platforms: string[];
  framework?: string;
};

const TEMPLATES: Template[] = [
  {
    title: "Self-repairing research agent",
    body: "Search with You.com, run the analysis in a Daytona sandbox, retry on failure, email the result.",
    prompt: "Research the top three self-repairing agent papers this month, chart their citation counts in a sandbox, and email me the PNG.",
    platforms: ["you", "daytona", "gmail"],
  },
  {
    title: "Support triage crew",
    body: "A crew reads the inbox, reproduces the bug in a sandbox, files it in Linear, posts to Slack.",
    prompt: "Triage every unread support email, file real bugs in Linear with repro steps, and post the list to #support.",
    platforms: ["gmail", "daytona", "linear", "slack"],
    framework: "CrewAI",
  },
  {
    title: "Market watch",
    body: "Finance Research on a watchlist every morning, written to Notion, digested in Slack.",
    prompt: "Every morning at 8, research what moved for my watchlist, save the sourced brief to Notion, and ping #markets.",
    platforms: ["you", "notion", "slack"],
  },
  {
    title: "An agent that learns",
    body: "Each run stores what worked in One memory; a GitHub relay wakes it when a PR lands.",
    prompt: "When a PR is opened, review it using what you learned from the last five reviews, and remember the outcome.",
    platforms: ["github", "slack"],
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

export function UseCaseTemplates() {
  return (
    <section id="templates" className="border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Use-case templates"
            title="Starting points for the theme: agents that repair and learn."
            lede="Templates land here before doors open. The prompts are yours to steal."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.title} delay={i * 70} className="flex">
              <article className="flex w-full flex-col rounded-card border border-dashed border-border-strong bg-surface/50 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex -space-x-2">
                    {t.platforms.map((p) => (
                      <Mark key={p} slug={p} />
                    ))}
                  </div>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-10 uppercase tracking-label text-muted">
                    Template · coming soon
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-medium text-foreground">
                  {t.title}
                  {t.framework && <span className="ml-2 font-mono text-11 text-muted">via {t.framework}</span>}
                </h3>
                <p className="mt-2 text-13 leading-relaxed text-secondary">{t.body}</p>
                <blockquote className="mt-4 rounded-panel border border-border bg-surface px-4 py-3 font-mono text-[12px] leading-relaxed text-secondary">
                  “{t.prompt}”
                </blockquote>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
