import { MARQUEE_PLATFORMS, PLATFORM_LABELS } from "@/lib/site";

function Row({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const list = [...MARQUEE_PLATFORMS.slice(offset), ...MARQUEE_PLATFORMS.slice(0, offset)];
  const items = [...list, ...list];
  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track flex w-max gap-3 pr-3"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {items.map((slug, i) => (
          <span
            key={`${slug}-${i}`}
            className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/platforms/${slug}.svg`}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              className="h-6 w-6 rounded-full"
            />
            <span className="text-13 text-secondary">{PLATFORM_LABELS[slug] ?? slug}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function PlatformMarquee() {
  return (
    <div className="space-y-3" aria-hidden>
      <Row />
      <Row reverse offset={7} />
    </div>
  );
}
