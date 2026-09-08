import { MARQUEE_PLATFORMS, PLATFORM_LABELS } from "@/lib/site";

/** Static, dimmed grid of connector marks used as the hero backdrop. */
export function LogoWall() {
  const slugs = [...MARQUEE_PLATFORMS, "you", "daytona", ...MARQUEE_PLATFORMS.slice(0, 9)];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 65% 40%, black 0%, rgba(0,0,0,0.6) 35%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 65% 40%, black 0%, rgba(0,0,0,0.6) 35%, transparent 72%)",
      }}
    >
      <div className="grid grid-cols-8 gap-5 pl-[38%] pt-10 opacity-[0.16] md:grid-cols-8 lg:grid-cols-8">
        {slugs.map((slug, i) => (
          <span
            key={`${slug}-${i}`}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-2/60"
            style={{ transform: `translateY(${(i % 2) * 22}px)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slug === "you" || slug === "daytona" ? `/partners/${slug}.svg` : `/platforms/${slug}.svg`}
              alt={PLATFORM_LABELS[slug] ?? slug}
              width={26}
              height={26}
              loading="lazy"
              className="h-[26px] w-[26px] rounded-full grayscale"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
