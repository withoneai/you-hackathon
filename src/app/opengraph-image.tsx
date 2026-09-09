import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { EVENT } from "@/lib/site";

export const alt = "Build with One · You.com Hackathon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "logo", "logo-full-dark.svg"), "utf8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

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
          background: "#0A0C0B",
          color: "#E9EFEC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logo} alt="One" width={172} height={54} />
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: "#7C8C86" }}>
            {`${EVENT.host.toUpperCase()}  ×  ONE   /   NYC   /   ${EVENT.dateShort.toUpperCase()}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            Build with One at the Live Web Agent Hackathon.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#9CACA6", maxWidth: 900 }}>
            Install the skill, connect You.com, Daytona and your apps, and spend the day on the agent.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 64, height: 10, background: "#CCFF00", borderRadius: 999 }} />
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#7C8C86" }}>
            {`FREE MONTH OF ONE PRO · CODE YOU-NYC-PRO · HACKATHON.WITHONE.AI`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
