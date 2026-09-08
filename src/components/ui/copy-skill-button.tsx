"use client";

import { CopyButton } from "./copy-button";

/** Copies the full raw skill markdown fetched from /skill.md. */
export function CopySkillButton({ variant = "pill" as const }: { variant?: "pill" | "lime" }) {
  return (
    <CopyButton
      variant={variant}
      label="Copy the entire skill"
      copiedLabel="Skill copied"
      getText={async () => {
        const res = await fetch("/skill.md", { cache: "no-store" });
        return res.ok ? res.text() : "";
      }}
    />
  );
}
