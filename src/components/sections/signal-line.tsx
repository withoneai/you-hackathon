/**
 * Decorative "signal line" echoing the event graphic's build timeline:
 * a run that faults, retries, and recovers. Pure SVG + CSS, no JS.
 */
export function SignalLine({ className }: { className?: string }) {
  const path =
    "M0 40 H260 C275 40 285 70 305 88 C325 106 350 110 400 110 H720 C770 110 795 106 815 88 C835 70 845 40 860 40 H1200";
  const stops = [
    { x: 0, y: 40, label: "doors" },
    { x: 130, y: 40, label: "keynote" },
    { x: 260, y: 40, label: "workshops" },
    { x: 470, y: 110, label: "build" },
    { x: 600, y: 110, label: "retry" },
    { x: 700, y: 110, label: "submit" },
    { x: 860, y: 40, label: "demos" },
    { x: 1200, y: 40, label: "awards" },
  ];
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="-14 0 1228 150"
        preserveAspectRatio="none"
        className="h-[150px] w-full overflow-visible"
        fill="none"
      >
        {/* faint rails */}
        <path d="M-14 10 H1214" stroke="var(--carbon-border)" strokeWidth="1" />
        <path d="M-14 140 H1214" stroke="var(--carbon-border)" strokeWidth="1" />
        {/* the run */}
        <path d={path} stroke="var(--carbon-border-strong)" strokeWidth="1.5" />
        <path d={path} className="dash-line" stroke="var(--spring)" strokeOpacity="0.55" strokeWidth="1.5" />
        {/* the run that faulted: continues straight from WORKSHOPS to the fault, then fades */}
        <path d="M264 40 H514" stroke="var(--alert)" strokeOpacity="0.55" strokeWidth="1.25" />
        <path d="M526 40 H790" stroke="var(--alert)" strokeOpacity="0.3" strokeWidth="1.25" strokeDasharray="4 6" />
        <circle cx="520" cy="40" r="6" fill="var(--carbon-0)" stroke="var(--alert)" strokeOpacity="0.85" strokeWidth="1.5" />
        <path d="M517 37 L523 43 M523 37 L517 43" stroke="var(--alert)" strokeOpacity="0.85" strokeWidth="1.5" />
        <text x="520" y="26" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="var(--alert)" fillOpacity="0.85">
          FAULT
        </text>
        {stops.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={s.y} r="3.5" fill="var(--carbon-0)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text
              x={s.x}
              y={s.y + (s.y > 60 ? 26 : -14)}
              textAnchor={s.x === 0 ? "start" : s.x === 1200 ? "end" : "middle"}
              fontFamily="var(--font-mono)"
              fontSize="9"
              letterSpacing="2"
              fill="var(--ink-muted)"
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* retry loop glyph */}
        <circle cx="600" cy="110" r="10" stroke="var(--spring)" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="44 20" />
      </svg>
      {/* travelling pulse rides the same path via offset-path */}
      <div className="pointer-events-none absolute inset-0">
        <span
          className="signal-pulse absolute h-2.5 w-2.5 rounded-full bg-spring shadow-[0_0_12px_2px_rgba(63,227,165,0.55)]"
          style={{ offsetPath: `path("${path}")`, offsetRotate: "0deg" } as React.CSSProperties}
        />
        <span
          className="signal-pulse delay absolute h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_12px_2px_rgba(204,255,0,0.45)]"
          style={{ offsetPath: `path("${path}")`, offsetRotate: "0deg" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
