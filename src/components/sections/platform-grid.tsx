import { PLATFORM_SLUGS, PLATFORM_LABELS } from "@/lib/site";

/** Static row of connector marks. No motion. */
export function PlatformGrid() {
  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Platforms">
      {PLATFORM_SLUGS.map((slug) => (
        <li
          key={slug}
          className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/platforms/${slug}.svg`} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-full" />
          <span className="text-13 text-secondary">{PLATFORM_LABELS[slug] ?? slug}</span>
        </li>
      ))}
    </ul>
  );
}
