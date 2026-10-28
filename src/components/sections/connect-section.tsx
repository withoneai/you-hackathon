import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { CopyButton } from "@/components/ui/copy-button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { CommandRow, TerminalFrame } from "@/components/ui/terminal";
import { LINKS } from "@/lib/site";

const STEPS = [
  {
    title: "Create a Connect app",
    body: "Dashboard → Developers → Connect → New app. The skill tells you which values to copy and where they go.",
    href: LINKS.connectDashboard,
  },
  {
    title: "Add the button and two routes",
    body: "Your agent installs @withone/connect, adds a <ConnectButton> to your UI and the authorize and callback routes to your server.",
    href: LINKS.connectSetup,
  },
  {
    title: "Let your agent act for each user",
    body: "Your agent finds and runs actions in each user's tools, the same loop as the CLI, limited to what that user granted.",
    href: LINKS.connectManagement,
  },
];

const SKILL_COMMANDS = ["npx skills add withoneai/connect", "one skills add connect"];

const DOC_LINKS = [
  { label: "Overview", href: LINKS.docsConnect },
  { label: "Setup guide", href: LINKS.connectSetup },
  { label: "Using the grant", href: LINKS.connectManagement },
  { label: "withoneai/connect", href: LINKS.connectRepo },
];

/** One Connect: the app's users connect their own tools, and the app acts with their grant. */
export function ConnectSection() {
  return (
    <section id="connect" className="relative border-t border-border">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal className="min-w-0">
            <SectionIntro
              eyebrow="One Connect"
              title="Let your users connect their own apps."
              lede="Want the people using your app to connect their own Gmail, Slack or Stripe, so your agent can act in them? Add a Connect button. Each user picks their tools on One's hosted page and sets the access for each. Your agent then works in those tools on their behalf, and One checks every call against what they granted. 1,000+ apps, and no provider tokens in your database."
            />
            <div className="mt-8">
              <Eyebrow>Start here: give your coding agent the Connect skill</Eyebrow>
              <TerminalFrame className="mt-3" bodyClassName="space-y-2">
                {SKILL_COMMANDS.map((cmd) => (
                  <CommandRow key={cmd} action={<CopyButton text={cmd} size="sm" />}>
                    {cmd}
                  </CommandRow>
                ))}
              </TerminalFrame>
              <p className="mt-3 text-13 text-secondary">
                Either command installs it. Then ask your agent to add One Connect to your app. The skill is its
                guide end to end: what to set up in the dashboard, the button, both routes and your first call.
              </p>
            </div>
            <Eyebrow className="mt-10">What the skill sets up with you</Eyebrow>
            <ol className="mt-4 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-foreground/25 font-mono text-11 font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-15 font-medium text-foreground transition-colors hover:text-spring"
                    >
                      {s.title} <ArrowUpRight size={12} />
                    </a>
                    <p className="mt-1 text-13 text-secondary">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120} className="min-w-0">
            <figure>
              <div className="overflow-hidden rounded-card border border-border bg-surface shadow-lift">
                <Image
                  src="/connect/connect-hero.png"
                  alt="One's hosted consent page: a user connects Stripe, Gmail, Google Calendar and Slack to Acme Inc and sets the access for each"
                  width={1162}
                  height={1220}
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-13 text-muted">
                What your users see: One&apos;s hosted page, with your app&apos;s name, the tools you ask for and
                the access for each. They can narrow it, never widen it.
              </figcaption>
            </figure>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {DOC_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-13 text-secondary transition-colors hover:text-foreground"
                >
                  {l.label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
