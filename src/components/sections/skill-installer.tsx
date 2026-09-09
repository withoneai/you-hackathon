import { CopyButton } from "@/components/ui/copy-button";
import { Tabs } from "@/components/ui/tabs";
import { CommandRow, TerminalFrame } from "@/components/ui/terminal";
import { SKILL_NAME, SKILL_RAW_URL } from "@/lib/site";

export const PASTE_PROMPT = `Read ${SKILL_RAW_URL} and follow it to set me up with One, then tell me what I'm connected to.`;
const CLAUDE_CODE = `mkdir -p ~/.claude/skills/${SKILL_NAME} && curl -fsSL ${SKILL_RAW_URL} -o ~/.claude/skills/${SKILL_NAME}/SKILL.md`;
const CURSOR = `mkdir -p .cursor/rules && curl -fsSL ${SKILL_RAW_URL} -o .cursor/rules/${SKILL_NAME}.mdc`;
const AGENTS_DIR = `mkdir -p ~/.agents/skills/${SKILL_NAME} && curl -fsSL ${SKILL_RAW_URL} -o ~/.agents/skills/${SKILL_NAME}/SKILL.md`;
const AGENTS_MD = `echo "Before touching any third-party app, read ~/.agents/skills/${SKILL_NAME}/SKILL.md" >> AGENTS.md`;

function Help({ children }: { children: React.ReactNode }) {
  return <p className="text-13 text-secondary">{children}</p>;
}

/** The install card: one tab per way of getting the skill into an agent. */
export function SkillInstaller({ id }: { id?: string }) {
  return (
    <TerminalFrame title={`install · ${SKILL_NAME}`} id={id}>
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
                <Help>Any agent with web access reads the skill and sets itself up.</Help>
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
                  Use <code className="font-mono text-foreground">.claude/skills/</code> in the repo for
                  project scope. Then type <code className="font-mono text-foreground">/{SKILL_NAME}</code>.
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
                <Help>Pair with knowledge-only mode on the One consent screen for code generation.</Help>
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
                <Help>The Agent Skills path Codex, OpenClaw, Hermes and Gemini CLI read.</Help>
              </div>
            ),
          },
        ]}
      />
    </TerminalFrame>
  );
}
