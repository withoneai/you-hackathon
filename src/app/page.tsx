import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { HelpSection } from "@/components/sections/help-section";
import { Hero } from "@/components/sections/hero";
import { PartnerCards } from "@/components/sections/partner-cards";
import { PerkCard } from "@/components/sections/perk-card";
import { SetupPaths } from "@/components/sections/setup-paths";
import { SkillCallout } from "@/components/sections/skill-callout";
import { UseCaseTemplates } from "@/components/sections/use-case-templates";
import { getCounts } from "@/lib/counts";

export default async function Page() {
  const counts = await getCounts();
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero platformLabel={counts.platformLabel} />
        <PerkCard />
        <SkillCallout />
        <SetupPaths />
        <PartnerCards platformLabel={counts.platformLabel} />
        <UseCaseTemplates />
        <HelpSection />
      </main>
      <Footer />
    </>
  );
}
