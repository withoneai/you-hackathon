import { EVENTS, getEvent } from "@/events";
import { skillResponse } from "@/lib/skill";

export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

/** An event's raw skill, as agents fetch it and the install commands curl it. */
export async function GET(_req: Request, ctx: RouteContext<"/[slug]/skill.md">) {
  const event = getEvent((await ctx.params).slug);
  if (!event) return new Response("Not found", { status: 404 });
  return skillResponse(event.slug);
}
