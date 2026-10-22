import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { EVENTS, getEvent } from "@/events";
import { SITE_URL } from "@/lib/site";

export const alt = "Build with One at a You.com hackathon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

/** Per-event card, in that event's theme: carbon (dark) or paper (light). */
const PALETTES = {
  carbon: { bg: "#0A0C0B", ink: "#E9EFEC", secondary: "#9CACA6", muted: "#7C8C86", logo: "logo-full-dark.svg" },
  paper: { bg: "#F6F8F6", ink: "#0C1A16", secondary: "#4E5F59", muted: "#5F6E68", logo: "logo-full-light.svg" },
} as const;

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const event = getEvent((await params).slug) ?? EVENTS[0];
  const p = PALETTES[event.theme];
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "logo", p.logo), "utf8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const bars = event.heroArt === "halloween" ? ["#FF8A2A", "#A98BFF"] : ["#CCFF00"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: p.bg,
          color: p.ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logo} alt="One" width={172} height={54} />
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: p.muted }}>
            {`${event.host.toUpperCase()}  ×  ONE   /   ${event.og.tag}   /   ${event.dateShort.toUpperCase()}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            {event.og.headline}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: p.secondary, maxWidth: 900 }}>{event.og.subline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {bars.map((c, i) => (
            <div key={c} style={{ display: "flex", width: i === 0 ? 64 : 24, height: 10, background: c, borderRadius: 999 }} />
          ))}
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: p.muted }}>
            {`FREE MONTH OF ONE PRO · CODE ${event.couponCode} · ${SITE_URL.replace("https://", "").toUpperCase()}/${event.slug.toUpperCase()}`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
