import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const alt = "Build with One · Hackathons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The hub's card, on Paper. Each event has its own under /[slug]. */
export default function OpenGraphImage() {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "logo", "logo-full-light.svg"), "utf8");
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
          background: "#F6F8F6",
          color: "#0C1A16",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logo} alt="One" width={172} height={54} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Build with One at every hackathon.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#4E5F59", maxWidth: 900 }}>
            Event pages, skills and templates, upcoming and past.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 64, height: 10, background: "#CCFF00", borderRadius: 999 }} />
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#5F6E68" }}>HACKATHON.WITHONE.AI</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
