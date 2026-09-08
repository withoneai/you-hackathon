import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** The "one · zsh" window chrome from the dashboard install page. */
export function TerminalFrame({
  title = "one · zsh",
  right,
  children,
  className,
  bodyClassName,
}: FrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-surface shadow-lift",
        className,
      )}
    >
      <div className="relative flex h-9 items-center border-b border-border px-3.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-11 text-foreground/45">
          {title}
        </span>
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </div>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </div>
  );
}

type CommandRowProps = {
  children: ReactNode;
  action?: ReactNode;
  prompt?: boolean;
  className?: string;
  multiline?: boolean;
};

/** One command line inside a terminal: `$ cmd` + an action slot (usually CopyButton). */
export function CommandRow({
  children,
  action,
  prompt = true,
  className,
  multiline = false,
}: CommandRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-panel border border-foreground/10 bg-foreground/[0.04] py-2.5 pl-3.5 pr-2",
        className,
      )}
    >
      <code
        className={cn(
          "min-w-0 flex-1 font-mono text-13 leading-relaxed text-foreground",
          prompt && "terminal-prompt",
          multiline ? "whitespace-pre-wrap break-words" : "overflow-x-auto whitespace-nowrap",
        )}
      >
        {children}
      </code>
      {action && <div className="-my-0.5 shrink-0">{action}</div>}
    </div>
  );
}

type StepProps = {
  n: number;
  title: string;
  help?: ReactNode;
  children?: ReactNode;
  last?: boolean;
};

/** Numbered step on a vertical rail. */
export function Step({ n, title, help, children, last = false }: StepProps) {
  return (
    <div className="relative flex gap-3.5">
      <div className="flex flex-col items-center">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-foreground/25 font-mono text-11 font-semibold text-foreground">
          {n}
        </span>
        {!last && <span className="mt-1.5 w-px flex-1 bg-foreground/10" aria-hidden />}
      </div>
      <div className={cn("min-w-0 flex-1", last ? "pb-0" : "pb-5")}>
        <p className="text-13 font-medium text-foreground">{title}</p>
        {help && <p className="mt-0.5 text-13 text-secondary">{help}</p>}
        {children && <div className="mt-2.5 space-y-2">{children}</div>}
      </div>
    </div>
  );
}
