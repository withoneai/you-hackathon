"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

type Props = {
  items: TabItem[];
  defaultId?: string;
  className?: string;
  listClassName?: string;
  /** "segmented" is the pill switcher; "underline" is a quieter row of text tabs. */
  variant?: "segmented" | "underline";
  ariaLabel?: string;
};

export function Tabs({
  items,
  defaultId,
  className,
  listClassName,
  variant = "segmented",
  ariaLabel,
}: Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const baseId = useId();

  return (
    <div className={className}>
      <div className={cn("max-w-full", variant === "segmented" && "overflow-x-auto")}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          variant === "segmented"
            ? "inline-flex items-center gap-1 rounded-[14px] border border-border bg-surface p-1"
            : "flex flex-wrap gap-1 border-b border-border",
          listClassName,
        )}
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              onClick={() => setActive(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-lime/40",
                variant === "segmented"
                  ? cn(
                      "h-8 rounded-control px-3.5 text-13",
                      selected
                        ? "bg-surface-3 text-foreground shadow-sm"
                        : "text-secondary hover:text-foreground",
                    )
                  : cn(
                      "-mb-px h-10 border-b-2 px-3 text-13",
                      selected
                        ? "border-spring text-foreground"
                        : "border-transparent text-secondary hover:text-foreground",
                    ),
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          className="mt-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
