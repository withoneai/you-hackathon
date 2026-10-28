import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConnectSection } from "@/components/sections/connect-section";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { HelpSection } from "@/components/sections/help-section";
import { Hero } from "@/components/sections/hero";
import { PartnerCards } from "@/components/sections/partner-cards";
import { PerkCard } from "@/components/sections/perk-card";
import { SetupPaths } from "@/components/sections/setup-paths";
import { SkillCallout } from "@/components/sections/skill-callout";
import { UseCaseTemplates } from "@/components/sections/use-case-templates";
import { EVENTS, eventUrls, getEvent } from "@/events";

export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  const title = `${event.name}: ${event.subtitle}`;
  const description = `Everything you need to build with One at ${event.host}'s ${event.name}: ${event.subtitle} (${event.city}, ${event.dateShort}). Install the skill, connect your apps, and build with ${event.stack.filter((s) => s !== "One").join(", ")}.`;
  const { page } = eventUrls(event);
  return {
    title,
    description,
    alternates: { canonical: page },
    openGraph: { type: "website", url: page, siteName: "One", title: `Build with One · ${title}`, description },
    twitter: { card: "summary_large_image", site: "@onedotnew", title: `Build with One · ${title}`, description },
  };
}

export default async function EventPage({ params }: PageProps<"/[slug]">) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header event={event} />
      <main className="flex-1">
        <Hero event={event} />
        <PerkCard event={event} />
        {event.connectSection && <ConnectSection />}
        <SkillCallout event={event} />
        <SetupPaths event={event} />
        <PartnerCards event={event} />
        <UseCaseTemplates event={event} />
        <HelpSection event={event} />
      </main>
      <Footer event={event} />
    </div>
  );
}
