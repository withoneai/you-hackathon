import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  /** Round tile with a hairline border, like the dashboard connector grid. */
  tile?: boolean;
};

/** Plain <img> for bundled SVG/PNG marks; no optimisation needed for icons. */
export function Logo({ src, alt, size = 28, className, tile = false }: Props) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn("shrink-0 object-contain", !tile && className)}
      style={{ width: size, height: size }}
    />
  );
  if (!tile) return img;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-surface-2",
        className,
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      {img}
    </span>
  );
}
