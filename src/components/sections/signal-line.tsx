/**
 * Decorative "signal line" telling the day's story as one run:
 * doors → keynote → workshops on the top rail, then down to the build rail,
 * a fault, a red retry hop back onto the rail, submit, and up again for
 * demos and awards. Pure SVG + CSS, no JS.
 */
const TOP = 40;
const LOW = 110;

// One continuous route; the pulses ride this so they travel the retry hop too.
const ROUTE =
  `M0 ${TOP} H260 C275 ${TOP} 285 70 305 88 C325 106 350 ${LOW} 400 ${LOW} ` + // down after workshops
  `H545 ` + // build → fault
  `C570 72 615 72 640 ${LOW} ` + // the retry hop (drawn red)
  `H745 C795 ${LOW} 820 106 840 88 C860 70 870 ${TOP} 885 ${TOP} ` + // up after submit
  `H1200`;

// The same route split into what worked (green) and the recovery hop (red).
const GREEN_A = `M0 ${TOP} H260 C275 ${TOP} 285 70 305 88 C325 106 350 ${LOW} 400 ${LOW} H545`;
const RED_HOP = `M545 ${LOW} C570 72 615 72 640 ${LOW}`;
const GREEN_B = `M640 ${LOW} H745 C795 ${LOW} 820 106 840 88 C860 70 870 ${TOP} 885 ${TOP} H1200`;

const stops = [
  { x: 0, y: TOP, label: "doors" },
  { x: 130, y: TOP, label: "keynote" },
  { x: 260, y: TOP, label: "workshops" },
  { x: 450, y: LOW, label: "build" },
  { x: 730, y: LOW, label: "submit" },
  { x: 900, y: TOP, label: "demos" },
  { x: 1200, y: TOP, label: "awards" },
];

const mono = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: 2,
} as const;


function Pulse({ color, begin }: { color: string; begin: string }) {
  const dur = "9s";
  return (
    <>
      <circle r="11" fill={color} opacity="0">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={ROUTE} calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0;0.22;0.22;0" keyTimes="0;0.08;0.92;1" dur={dur} begin={begin} repeatCount="indefinite" />
      </circle>
      <circle r="4.5" fill={color} opacity="0">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={ROUTE} calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur={dur} begin={begin} repeatCount="indefinite" />
      </circle>
    </>
  );
}

export function SignalLine({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="-14 0 1228 150" preserveAspectRatio="none" className="h-[150px] w-full overflow-visible" fill="none">
        {/* faint rails */}
        <path d={`M-14 10 H1214`} stroke="var(--carbon-border)" strokeWidth="1" />
        <path d={`M-14 140 H1214`} stroke="var(--carbon-border)" strokeWidth="1" />

        {/* the track, then the run flowing along it */}
        <path d={ROUTE} stroke="var(--carbon-border-strong)" strokeWidth="1.5" />
        <path d={GREEN_A} className="dash-line" stroke="var(--spring)" strokeOpacity="0.55" strokeWidth="1.5" />
        <path d={GREEN_B} className="dash-line" stroke="var(--spring)" strokeOpacity="0.55" strokeWidth="1.5" />
        {/* the recovery hop: fault → retry */}
        <path d={RED_HOP} className="dash-line" stroke="var(--alert)" strokeOpacity="0.8" strokeWidth="1.5" />

        {/* ordinary stops */}
        {stops.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={s.y} r="3.5" fill="var(--carbon-0)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text
              x={s.x}
              y={s.y + (s.y === LOW ? 26 : -14)}
              textAnchor={s.x === 0 ? "start" : s.x === 1200 ? "end" : "middle"}
              fill="var(--ink-muted)"
              {...mono}
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* FAULT: where the run broke */}
        <circle cx="545" cy={LOW} r="6" fill="var(--carbon-0)" stroke="var(--alert)" strokeOpacity="0.9" strokeWidth="1.5" />
        <path d={`M542 ${LOW - 3} L548 ${LOW + 3} M548 ${LOW - 3} L542 ${LOW + 3}`} stroke="var(--alert)" strokeOpacity="0.9" strokeWidth="1.5" />
        <text x="545" y={LOW + 26} textAnchor="middle" fill="var(--alert)" fillOpacity="0.9" {...mono}>
          FAULT
        </text>

        {/* RETRY: where it picked back up (a loop glyph interrupting the rail) */}
        <circle cx="640" cy={LOW} r="13" fill="var(--carbon-0)" />
        <path
          d={`M640 ${LOW - 9} A9 9 0 1 1 631 ${LOW}`}
          stroke="var(--spring)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d={`M631 ${LOW} L627.5 ${LOW + 4} M631 ${LOW} L634.5 ${LOW + 4}`}
          stroke="var(--spring)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="640" cy={LOW} r="2" fill="var(--spring)" />
        <text x="640" y={LOW + 26} textAnchor="middle" fill="var(--spring)" fillOpacity="0.85" {...mono}>
          RETRY
        </text>

        {/* travelling pulses ride the whole route, including the red hop */}
        <g className="signal-pulse">
          <Pulse color="var(--spring)" begin="0s" />
          <Pulse color="var(--lime)" begin="4.5s" />
        </g>
      </svg>
    </div>
  );
}
