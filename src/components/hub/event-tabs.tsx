"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type View = "upcoming" | "past";

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

const readView = (): View => (window.location.hash === "#past" ? "past" : "upcoming");

/**
 * Upcoming events by default, past ones a click away. `#past` in the URL opens the
 * past list, so it can be linked to.
 */
export function EventTabs({
  upcoming,
  past,
  counts,
}: {
  upcoming: ReactNode;
  past: ReactNode;
  counts: Record<View, number>;
}) {
  const view = useSyncExternalStore(subscribeHash, readView, () => "upcoming" as View);

  function select(next: View) {
    history.replaceState(null, "", next === "past" ? "#past" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  const tabs: { id: View; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Events" className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={view === t.id}
            onClick={() => select(t.id)}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-13 font-medium transition-colors focus-visible:outline-none",
              view === t.id ? "border-foreground text-foreground" : "border-transparent text-secondary hover:text-foreground",
            )}
          >
            {t.label}
            <span className="rounded-full bg-surface-2 px-1.5 font-mono text-11 text-secondary">{counts[t.id]}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-8">
        {view === "upcoming" ? (
          counts.upcoming > 0 ? (
            upcoming
          ) : (
            <div className="rounded-card border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
              <p className="text-15 font-medium text-foreground">No upcoming events right now.</p>
              <p className="mt-1 text-13 text-secondary">Every past event keeps its page, skill and templates.</p>
              <button
                type="button"
                onClick={() => select("past")}
                className="mt-4 inline-flex h-9 items-center rounded-control border border-border-strong bg-surface px-3 text-13 font-medium text-foreground hover:bg-surface-2"
              >
                Browse past events
              </button>
            </div>
          )
        ) : (
          past
        )}
      </div>
    </div>
  );
}
