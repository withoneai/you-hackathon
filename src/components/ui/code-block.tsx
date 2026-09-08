import { highlight } from "sugar-high";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

type Props = {
  code: string;
  /** Used for the header label and to decide whether to syntax-highlight. */
  lang?: string;
  title?: string;
  className?: string;
  /** Hide the header bar and float the copy button instead. */
  bare?: boolean;
};

const HIGHLIGHT = new Set(["ts", "tsx", "js", "jsx", "json", "typescript", "javascript", "python", "py", "toml", "yaml", "yml"]);

export function CodeBlock({ code, lang = "text", title, className, bare = false }: Props) {
  const trimmed = code.replace(/\n+$/, "");
  const shouldHighlight = HIGHLIGHT.has(lang);
  const html = shouldHighlight ? highlight(trimmed) : null;

  const body = (
    <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.65] text-foreground">
      {html ? (
        <code dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code>{trimmed}</code>
      )}
    </pre>
  );

  if (bare) {
    return (
      <div className={cn("relative overflow-hidden rounded-panel border border-border bg-surface", className)}>
        {body}
        <CopyButton text={trimmed} size="sm" className="absolute right-2 top-2" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-panel border border-border bg-surface", className)}>
      <div className="flex h-9 items-center justify-between border-b border-border bg-surface-2/60 pl-4 pr-1.5">
        <span className="font-mono text-11 text-foreground/50">{title ?? lang}</span>
        <CopyButton text={trimmed} size="sm" />
      </div>
      {body}
    </div>
  );
}
