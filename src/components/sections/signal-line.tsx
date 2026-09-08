/**
 * Decorative "signal line" telling the day's story as one run:
 * doors → keynote → workshops on the top rail, down to the build rail,
 * build → submit, then back up for demos and awards. Off the build rail a
 * side loop shows what a self-repairing agent does when a run faults: the
 * red branch leaves the rail, hits FAULT, and comes back green to rejoin at
 * RETRY. One pulse rides straight through; the other takes the detour.
 * Pure SVG + SMIL, no JS.
 */
const TOP = 40;
const LOW = 110;

const DOWN = `C275 ${TOP} 285 70 305 88 C325 106 350 ${LOW} 400 ${LOW}`;
const UP = `C795 ${LOW} 820 106 840 88 C860 70 870 ${TOP} 885 ${TOP}`;

// The clean route: the main line every run follows.
const ROUTE = `M0 ${TOP} H260 ${DOWN} H745 ${UP} H1200`;

// The same route, but taking the fault/retry detour between x=545 and x=640.
const DETOUR_ARC = `C570 72 615 72 640 ${LOW}`;
const ROUTE_WITH_DETOUR = `M0 ${TOP} H260 ${DOWN} H545 ${DETOUR_ARC} H745 ${UP} H1200`;

// The detour split at its apex (de Casteljau at t = 0.5): red out, green back.
const APEX = { x: 592.5, y: 81.5 };
const FAULT_OUT = `M545 ${LOW} C557.5 91 575 81.5 ${APEX.x} ${APEX.y}`;
const REPAIR_BACK = `M${APEX.x} ${APEX.y} C610 81.5 627.5 91 640 ${LOW}`;

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

function Pulse({ color, begin, path }: { color: string; begin: string; path: string }) {
  const dur = "9s";
  return (
    <>
      <circle r="11" fill={color} opacity="0">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
        <animate attributeName="opacity" values="0;0.22;0.22;0" keyTimes="0;0.08;0.92;1" dur={dur} begin={begin} repeatCount="indefinite" />
      </circle>
      <circle r="4.5" fill={color} opacity="0">
        <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
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
        <path d="M-14 10 H1214" stroke="var(--carbon-border)" strokeWidth="1" />
        <path d="M-14 140 H1214" stroke="var(--carbon-border)" strokeWidth="1" />

        {/* the track, then the run flowing along it */}
        <path d={ROUTE} stroke="var(--carbon-border-strong)" strokeWidth="1.5" />
        <path d={ROUTE} className="dash-line" stroke="var(--spring)" strokeOpacity="0.55" strokeWidth="1.5" />

        {/* the side loop: a run that faulted and repaired itself */}
        <path d={`M545 ${LOW} ${DETOUR_ARC}`} stroke="var(--carbon-border-strong)" strokeWidth="1.5" />
        <path d={FAULT_OUT} stroke="var(--alert)" strokeOpacity="0.75" strokeWidth="1.5" />
        <path d={REPAIR_BACK} className="dash-line" stroke="var(--spring)" strokeOpacity="0.75" strokeWidth="1.5" />
        <circle cx="545" cy={LOW} r="2.5" fill="var(--ink-secondary)" />

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

        {/* FAULT: at the top of the loop, off the main line */}
        <circle cx={APEX.x} cy={APEX.y} r="6" fill="var(--carbon-0)" stroke="var(--alert)" strokeOpacity="0.9" strokeWidth="1.5" />
        <path
          d={`M${APEX.x - 3} ${APEX.y - 3} L${APEX.x + 3} ${APEX.y + 3} M${APEX.x + 3} ${APEX.y - 3} L${APEX.x - 3} ${APEX.y + 3}`}
          stroke="var(--alert)"
          strokeOpacity="0.9"
          strokeWidth="1.5"
        />
        <text x={APEX.x} y={APEX.y - 13} textAnchor="middle" fill="var(--alert)" fillOpacity="0.9" {...mono}>
          FAULT
        </text>

        {/* RETRY: where the repaired run rejoins the main line */}
        <circle cx="640" cy={LOW} r="13" fill="var(--carbon-0)" />
        <path d={`M640 ${LOW - 9} A9 9 0 1 1 631 ${LOW}`} stroke="var(--spring)" strokeWidth="1.5" strokeLinecap="round" />
        <path d={`M631 ${LOW} L627.5 ${LOW + 4} M631 ${LOW} L634.5 ${LOW + 4}`} stroke="var(--spring)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="640" cy={LOW} r="2" fill="var(--spring)" />
        <text x="640" y={LOW + 26} textAnchor="middle" fill="var(--spring)" fillOpacity="0.85" {...mono}>
          RETRY
        </text>

        {/* travelling pulses: one straight through, one taking the detour */}
        <g className="signal-pulse">
          <Pulse color="var(--spring)" begin="0s" path={ROUTE} />
          <Pulse color="var(--lime)" begin="4.5s" path={ROUTE_WITH_DETOUR} />
        </g>
      </svg>
    </div>
  );
}
