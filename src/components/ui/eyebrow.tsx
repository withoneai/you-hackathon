import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Leading dot colour. Defaults to spring; use "lime" only inside the hero. Pumpkin and hex are the Halloween accents. */
  dot?: "spring" | "lime" | "muted" | "pumpkin" | "hex" | "none";
  as?: "p" | "span" | "div";
};

export function Eyebrow({ children, className, dot = "spring", as: Tag = "p" }: Props) {
  return (
    <Tag className={cn("eyebrow inline-flex items-start gap-2", className)}>
      {dot !== "none" && (
        <span
          aria-hidden
          className={cn(
            "mt-[5px] inline-block h-1.5 w-1.5 shrink-0 rounded-full",
            dot === "spring" && "bg-spring",
            dot === "lime" && "bg-lime",
            dot === "muted" && "bg-muted",
            dot === "pumpkin" && "bg-pumpkin",
            dot === "hex" && "bg-hex",
          )}
        />
      )}
      {children}
    </Tag>
  );
}
