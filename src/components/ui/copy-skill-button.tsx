"use client";

import { CopyButton } from "./copy-button";

/** Copies the full raw skill markdown fetched from an event's skill.md path. */
export function CopySkillButton({ path, variant = "pill" as const }: { path: string; variant?: "pill" | "lime" }) {
  return (
    <CopyButton
      variant={variant}
      label="Copy the entire skill"
      copiedLabel="Skill copied"
      getText={async () => {
        const res = await fetch(path, { cache: "no-store" });
        return res.ok ? res.text() : "";
      }}
    />
  );
}
