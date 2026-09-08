import { ArrowRight, ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";
import { CopySkillButton } from "@/components/ui/copy-skill-button";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { Tabs } from "@/components/ui/tabs";
import { CommandRow, TerminalFrame } from "@/components/ui/terminal";
import { SKILL_NAME, SKILL_RAW_URL } from "@/lib/site";

const TEACHES = [
  "Setup for the remote MCP server, the CLI, the local MCP server and the API, with the exact config for every client",
  "The four-tool loop every One call follows: list, search, read the knowledge, execute",
  "Playbooks for You.com, Daytona and CrewAI through One, including the fixes that make them reliable",
  "Scoping, environment variables, error codes and one merged troubleshooting table",
  "When to reach for One Connect so the users of your product can connect their own apps",
];

const PASTE_PROMPT = `Read ${SKILL_RAW_URL} and follow it to set me up with One, then tell me what I'm connected to.`;
const CLAUDE_CODE = `mkdir -p ~/.claude/skills/${SKILL_NAME} && curl -fsSL ${SKILL_RAW_URL} -o ~/.claude/skills/${SKILL_NAME}/SKILL.md`;
const CURSOR = `mkdir -p .cursor/rules && curl -fsSL ${SKILL_RAW_URL} -o .cursor/rules/${SKILL_NAME}.mdc`;
const AGENTS_DIR = `mkdir -p ~/.agents/skills/${SKILL_NAME} && curl -fsSL ${SKILL_RAW_URL} -o ~/.agents/skills/${SKILL_NAME}/SKILL.md`;
const AGENTS_MD = `echo "Before touching any third-party app, read ~/.agents/skills/${SKILL_NAME}/SKILL.md" >> AGENTS.md`;

function Help({ children }: { children: React.ReactNode }) {
  return <p className="text-13 text-secondary">{children}</p>;
}

export function SkillCallout() {
  return (
    <section id="skill" className="relative border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionIntro
              eyebrow="The primary skill"
              title="One skill. Everything your agent needs to build here."
              lede="Install it in Claude Code, Cursor, Codex or any agent that reads markdown. It teaches the agent how to set up One, how the four-tool loop works, and exactly how to use You.com, Daytona and CrewAI through One."
            />
            <ul className="mt-8 space-y-3">
              {TEACHES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-15 text-secondary">
                  <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-spring" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/skill"
                className="inline-flex items-center gap-1.5 text-13 font-medium text-foreground transition-colors hover:text-spring"
              >
                Review the skill <ArrowRight size={14} />
              </Link>
              <a
                href="/skill.md"
                className="inline-flex items-center gap-1.5 text-13 text-secondary transition-colors hover:text-foreground"
              >
                Raw markdown <ArrowUpRight size={13} />
              </a>
              <CopySkillButton />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <TerminalFrame title={`install · ${SKILL_NAME}`}>
              <Tabs
                ariaLabel="Install method"
                items={[
                  {
                    id: "paste",
                    label: "Paste into your agent",
                    content: (
                      <div className="space-y-3">
                        <CommandRow prompt={false} multiline action={<CopyButton text={PASTE_PROMPT} size="sm" />}>
                          {PASTE_PROMPT}
                        </CommandRow>
                        <Help>
                          Works in any agent with web access. It reads the skill, installs the CLI or
                          points itself at the remote MCP server, and reports what you are connected to.
                        </Help>
                      </div>
                    ),
                  },
                  {
                    id: "claude-code",
                    label: "Claude Code",
                    content: (
                      <div className="space-y-3">
                        <CommandRow multiline action={<CopyButton text={CLAUDE_CODE} size="sm" />}>
                          {CLAUDE_CODE}
                        </CommandRow>
                        <Help>
                          Project scope: use <code className="font-mono text-foreground">.claude/skills/</code>{" "}
                          inside your repo instead of <code className="font-mono text-foreground">~/.claude</code>.
                          Then type <code className="font-mono text-foreground">/{SKILL_NAME}</code> or just ask.
                        </Help>
                      </div>
                    ),
                  },
                  {
                    id: "cursor",
                    label: "Cursor",
                    content: (
                      <div className="space-y-3">
                        <CommandRow multiline action={<CopyButton text={CURSOR} size="sm" />}>
                          {CURSOR}
                        </CommandRow>
                        <Help>
                          Cursor loads <code className="font-mono text-foreground">.mdc</code> rules from
                          the project. Pair it with knowledge-only mode on the One consent screen if you
                          only want code generation.
                        </Help>
                      </div>
                    ),
                  },
                  {
                    id: "any",
                    label: "Any agent",
                    content: (
                      <div className="space-y-3">
                        <CommandRow multiline action={<CopyButton text={AGENTS_DIR} size="sm" />}>
                          {AGENTS_DIR}
                        </CommandRow>
                        <CommandRow multiline action={<CopyButton text={AGENTS_MD} size="sm" />}>
                          {AGENTS_MD}
                        </CommandRow>
                        <Help>
                          The Agent Skills path Codex, OpenClaw, Hermes and Gemini CLI read, plus a
                          one-line pointer in <code className="font-mono text-foreground">AGENTS.md</code>{" "}
                          so the agent knows it is there.
                        </Help>
                      </div>
                    ),
                  },
                ]}
              />
            </TerminalFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
