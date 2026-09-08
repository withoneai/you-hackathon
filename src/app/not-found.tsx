import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <Eyebrow dot="muted">404</Eyebrow>
      <h1 className="mt-4 font-serif text-[36px] text-foreground">Nothing at this address.</h1>
      <p className="mt-3 max-w-[40ch] text-15 text-secondary">
        The hackathon page and the skill are the only two things here.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/" variant="ink">Hackathon page</Button>
        <Link href="/skill" className="inline-flex h-10 items-center rounded-control border border-border-strong px-4 text-xs font-medium text-foreground hover:bg-surface-2">
          The skill
        </Link>
      </div>
    </main>
  );
}
