import { currentEvent } from "@/events";
import { skillResponse } from "@/lib/skill";

/** Install prompts shared before the events hub point here, so it serves the current event's skill. */
export const revalidate = 3600;

export function GET() {
  return skillResponse(currentEvent().slug);
}
