"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export function CouponCode({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied ? "true" : "false"}
      aria-label={copied ? "Coupon code copied" : `Copy coupon code ${code}`}
      className={cn(
        "group inline-flex items-center gap-4 rounded-panel border border-dashed bg-surface pl-5 pr-3 py-3 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-lime/40",
        copied ? "border-spring-dim bg-spring-tint" : "border-border-strong hover:border-muted hover:bg-surface-2",
        className,
      )}
    >
      <span className="font-mono text-[22px] font-medium tracking-[0.18em] text-foreground sm:text-[26px]">
        {code}
      </span>
      <span
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-control px-3 font-mono text-11 uppercase tracking-label transition-colors",
          copied ? "bg-spring/15 text-spring" : "bg-surface-3 text-secondary group-hover:text-foreground",
        )}
      >
        {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
