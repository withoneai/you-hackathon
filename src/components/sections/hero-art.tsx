/**
 * The Halloween edition's one piece of hero art: a pumpkin moon behind a
 * corner web, with three bats crossing it. Purely decorative, pure SVG; the
 * bats drift with a CSS animation that reduced motion switches off.
 */
const BAT =
  "M0 4 C-3 1 -6 -1 -9 0 C-12 -6 -18 -8 -24 -5 C-20 -3 -19 1 -20 4 C-16 2 -12 3 -10 6 C-7 4 -3 5 0 8 C3 5 7 4 10 6 C12 3 16 2 20 4 C19 1 20 -3 24 -5 C18 -8 12 -6 9 0 C6 -1 3 1 0 4 Z M-3 1 L-2 -4 L0 -1 L2 -4 L3 1 Z";

const bats = [
  { x: 150, y: 120, scale: 1.25, delay: "0s" },
  { x: 236, y: 196, scale: 0.85, delay: "-2.3s" },
  { x: 92, y: 214, scale: 0.65, delay: "-4.6s" },
];

// Corner web: spokes from the top-right corner, joined by sagging threads.
const WEB_ORIGIN = { x: 560, y: 0 };
const SPOKES = [100, 120, 140, 160, 180].map((deg) => (deg * Math.PI) / 180);
const RINGS = [60, 120, 185, 250];

function point(angle: number, r: number) {
  return { x: WEB_ORIGIN.x + Math.cos(angle) * r, y: WEB_ORIGIN.y + Math.sin(angle) * r };
}

function thread(r: number) {
  return SPOKES.slice(1)
    .map((a, i) => {
      const from = point(SPOKES[i], r);
      const to = point(a, r);
      const mid = point((SPOKES[i] + a) / 2, r * 0.9);
      return `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${mid.x.toFixed(1)} ${mid.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    })
    .join(" ");
}

export function HeroArt({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 560 420" className="h-full w-full" fill="none">
        <defs>
          <radialGradient id="moon-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--pumpkin)" stopOpacity="0.32" />
            <stop offset="0.55" stopColor="var(--pumpkin)" stopOpacity="0.08" />
            <stop offset="1" stopColor="var(--pumpkin)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon-face" cx="0.38" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#ffb36b" />
            <stop offset="0.6" stopColor="var(--pumpkin)" />
            <stop offset="1" stopColor="#c4570d" />
          </radialGradient>
          <linearGradient id="web-fade" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ink-secondary)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--ink-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* moon, its glow, and a hex ring orbiting it */}
        <circle cx="330" cy="150" r="190" fill="url(#moon-glow)" />
        <circle cx="330" cy="150" r="128" stroke="var(--hex)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="330" cy="150" r="92" fill="url(#moon-face)" fillOpacity="0.9" />
        <g fill="#000" fillOpacity="0.14">
          <circle cx="300" cy="120" r="14" />
          <circle cx="358" cy="178" r="20" />
          <circle cx="364" cy="112" r="8" />
          <circle cx="296" cy="186" r="6" />
        </g>

        {/* corner web */}
        <g stroke="url(#web-fade)" strokeWidth="1">
          {SPOKES.map((a) => {
            const end = point(a, 300);
            return <path key={a} d={`M${WEB_ORIGIN.x} ${WEB_ORIGIN.y} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`} />;
          })}
          {RINGS.map((r) => (
            <path key={r} d={thread(r)} />
          ))}
        </g>
        <line x1="470" y1="0" x2="470" y2="96" stroke="var(--ink-muted)" strokeOpacity="0.6" strokeWidth="1" />
        <g transform="translate(470 104)" fill="var(--bg-0)" stroke="var(--hex)" strokeWidth="1.5">
          <ellipse cx="0" cy="0" rx="6" ry="8" />
          <path d="M-5 -2 L-13 -8 M-5 2 L-14 2 M-5 5 L-12 11 M5 -2 L13 -8 M5 2 L14 2 M5 5 L12 11" strokeLinecap="round" />
        </g>

        {/* bats */}
        {bats.map((b) => (
          <g key={b.x} transform={`translate(${b.x} ${b.y}) scale(${b.scale})`}>
            <path
              d={BAT}
              fill="var(--hex)"
              fillOpacity="0.85"
              className="animate-flutter"
              style={{ animationDelay: b.delay, transformBox: "fill-box", transformOrigin: "center" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
