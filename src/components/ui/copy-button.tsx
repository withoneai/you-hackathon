"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

type Props = {
  /** Text to copy. Either this or `getText` is required. */
  text?: string;
  /** Lazily resolve the text (used for "copy the whole skill"). */
  getText?: () => Promise<string>;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Icon-only square button (default) or a labelled pill. */
  variant?: "icon" | "pill" | "lime";
  size?: "sm" | "md";
  title?: string;
};

export function CopyButton({
  text,
  getText,
  label,
  copiedLabel = "Copied",
  className,
  variant = "icon",
  size = "md",
  title = "Copy to clipboard",
}: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const onClick = useCallback(async () => {
    const value = text ?? (getText ? await getText() : "");
    if (!value) return;
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1400);
  }, [text, getText]);

  const Icon = copied ? Check : Copy;
  const iconSize = size === "sm" ? 14 : 16;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={copied ? copiedLabel : title}
        title={title}
        data-copied={copied ? "true" : "false"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[9px] border border-transparent transition-colors duration-150",
          size === "sm" ? "h-7 w-7" : "h-8 w-8",
          copied
            ? "text-spring bg-spring-tint"
            : "text-muted hover:text-foreground hover:bg-foreground/[0.06]",
          className,
        )}
      >
        <Icon size={iconSize} weight={copied ? "bold" : "regular"} />
      </button>
    );
  }

  const isLime = variant === "lime";
  return (
    <button
      type="button"
      onClick={onClick}
      data-copied={copied ? "true" : "false"}
      className={cn(
        "inline-flex items-center gap-2 rounded-control font-medium text-xs transition-all duration-200 active:scale-[0.97] active:transition-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-lime/40",
        size === "sm" ? "h-8 px-3" : "h-10 px-4",
        isLime
          ? "bg-lime text-on-lime hover:bg-lime-hover"
          : copied
            ? "border border-spring-deep bg-spring-tint text-spring"
            : "border border-border-strong bg-surface/40 text-foreground hover:bg-surface-2",
        className,
      )}
    >
      <Icon size={iconSize} weight={copied ? "bold" : "regular"} />
      <span>{copied ? copiedLabel : label ?? "Copy"}</span>
    </button>
  );
}
