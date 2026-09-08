import { PLATFORM_COUNT_FALLBACK, TOOL_COUNT_FALLBACK } from "./site";

type Badge = { message?: string };

async function readCount(url: string, fallback: number): Promise<number> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return fallback;
    const json = (await res.json()) as Badge;
    const n = Number(String(json.message ?? "").replace(/[^0-9]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : fallback;
  } catch {
    return fallback;
  }
}

/** Live counts from the public badge endpoints, with measured fallbacks. */
export async function getCounts() {
  const [platforms, tools] = await Promise.all([
    readCount("https://api.withone.ai/open/count/platforms", PLATFORM_COUNT_FALLBACK),
    readCount("https://api.withone.ai/open/count/tools", TOOL_COUNT_FALLBACK),
  ]);
  return {
    platformCount: platforms,
    toolCount: tools,
    platformLabel: `${Math.floor(platforms / 10) * 10}+`,
    toolLabel: `${Math.floor(tools / 1000)}K+`,
  };
}
