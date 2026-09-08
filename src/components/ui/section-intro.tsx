import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionIntro({ eyebrow, title, lede, className, align = "left" }: Props) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-[60ch]", className)}>
      <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-serif text-[30px] leading-[1.12] tracking-display text-foreground sm:text-[38px]">
        {title}
      </h2>
      {lede && <p className="mt-4 text-15 text-secondary">{lede}</p>}
    </div>
  );
}
