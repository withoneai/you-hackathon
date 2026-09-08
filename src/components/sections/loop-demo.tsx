"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** Reads the OS reduced-motion preference without a setState-in-effect. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}
import { TerminalFrame } from "@/components/ui/terminal";

type Frame = { cmd: string; out: string[] };

const SCRIPT: Frame[] = [
  {
    cmd: "one --agent list",
    out: [
      "● you       operational   live::you::default::7f3a…",
      "● daytona   operational   live::daytona::default::c21e…",
      "● gmail     operational   live::gmail::default::9b0d…",
    ],
  },
  {
    cmd: 'one --agent actions search you "search web and news" -t execute',
    out: [
      "GET   /v1/search    Search Unified Web and News Results",
      "POST  /v1/search    Search Unified Web and News Results",
      "POST  /v1/research  Research",
    ],
  },
  {
    cmd: "one --agent actions knowledge you <actionId>",
    out: [
      "queryParams · query (required), count, freshness, country",
      "gotcha · never combine include_domains with exclude_domains",
    ],
  },
  {
    cmd: `one --agent actions execute you <actionId> <key> --query-params '{"query":"self-repairing agents","count":5}'`,
    out: ["✓ 200   results.web[5]   results.news[3]   412ms"],
  },
];

export function LoopDemo() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [outCount, setOutCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const current = SCRIPT[step];
    let t: number;
    if (typed < current.cmd.length) {
      t = window.setTimeout(() => setTyped((n) => n + 1), 14 + Math.random() * 26);
    } else if (outCount < current.out.length) {
      t = window.setTimeout(() => setOutCount((n) => n + 1), outCount === 0 ? 480 : 150);
    } else {
      t = window.setTimeout(() => {
        setStep((s) => (s + 1) % SCRIPT.length);
        setTyped(0);
        setOutCount(0);
      }, 2800);
    }
    return () => window.clearTimeout(t);
  }, [reduced, step, typed, outCount]);

  const frames = reduced
    ? SCRIPT.map((f) => ({ ...f, typed: f.cmd.length, shown: f.out.length, live: false }))
    : SCRIPT.slice(0, step + 1).map((f, i) =>
        i < step
          ? { ...f, typed: f.cmd.length, shown: f.out.length, live: false }
          : { ...f, typed, shown: outCount, live: true },
      );

  return (
    <TerminalFrame
      title="the loop · one"
      bodyClassName="min-h-[300px] font-mono text-[12px] leading-[1.7]"
      right={
        <span className="hidden font-mono text-10 uppercase tracking-label text-muted sm:inline">
          list → search → knowledge → execute
        </span>
      }
    >
      <div className="space-y-3" aria-live="off">
        {frames.map((f, i) => (
          <div key={i} className={f.live ? "" : "opacity-55"}>
            <div className="flex gap-2 text-foreground">
              <span className="select-none text-muted">$</span>
              <span className="whitespace-pre-wrap break-all">
                {f.cmd.slice(0, f.typed)}
                {f.live && f.typed < f.cmd.length && (
                  <span className="animate-blink ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-spring" />
                )}
              </span>
            </div>
            {f.out.slice(0, f.shown).map((line, j) => (
              <div key={j} className="pl-4 text-secondary">
                {line.startsWith("✓") ? (
                  <span className="text-spring">{line}</span>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </TerminalFrame>
  );
}
