import { getSkill } from "@/lib/skill";

export const dynamic = "force-static";

export function GET() {
  const { raw } = getSkill();
  return new Response(raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Skill-Name": "one-hackathon",
    },
  });
}
