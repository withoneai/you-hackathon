import { redirect } from "next/navigation";
import { currentEvent, eventUrls } from "@/events";

/** The rendered skill used to live here. Send old links to the current event's skill. */
export const revalidate = 3600;

export default function SkillRedirect() {
  redirect(eventUrls(currentEvent()).skillPagePath);
}
