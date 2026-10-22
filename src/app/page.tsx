import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { EventCard } from "@/components/hub/event-card";
import { EventTabs } from "@/components/hub/event-tabs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { splitEvents, type EventWithStatus } from "@/events";

/** Upcoming and past are worked out from the clock, so re-render hourly. */
export const revalidate = 3600;

function Grid({ events }: { events: EventWithStatus[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map(({ event, status }) => (
        <EventCard key={event.slug} event={event} status={status} />
      ))}
    </div>
  );
}

export default function HubPage() {
  const { upcoming, past } = splitEvents();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1180px] px-5 pb-12 pt-14 sm:px-8 md:pb-16 md:pt-20">
            <Eyebrow>One hackathons</Eyebrow>
            <h1 className="mt-4 max-w-[20ch] font-serif text-[36px] leading-[1.08] text-foreground sm:text-[48px]">
              Build with One at every hackathon.
            </h1>
            <p className="mt-4 max-w-[56ch] text-15 text-secondary sm:text-[17px]">
              Each event has its own page, the skill your agent installs, and templates to start from.
              Past events stay here too, so their skills and details keep working.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 md:py-16">
          <EventTabs
            counts={{ upcoming: upcoming.length, past: past.length }}
            upcoming={<Grid events={upcoming} />}
            past={<Grid events={past} />}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
