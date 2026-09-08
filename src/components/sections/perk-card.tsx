import { ArrowUpRight, Check, Trophy } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CouponCode } from "@/components/ui/coupon-code";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { COUPON_CODE, LINKS, REDEEM_URL } from "@/lib/site";

const PRO_FEATURES = [
  "1M API calls included",
  "1,000 requests/min rate limit",
  "Unlimited connections",
  "Unlimited Relay (webhook infrastructure)",
  "Full webhooks + 90-day logs",
  "MCP & CLI access, email support",
];

const STEPS = [
  { title: "Create your workspace", body: "Sign up free at app.withone.ai. No card needed." },
  { title: "Open Settings → Billing", body: "Pick the Pro plan." },
  { title: "Enter the code at checkout", body: `${COUPON_CODE} makes your first month of Pro $0.` },
];

export function PerkCard() {
  return (
    <section className="relative mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20" id="perk">
      <Reveal>
        <div
          className="relative rounded-surface border border-border-strong bg-surface shadow-lift-lg"
          style={{
            backgroundImage:
              "radial-gradient(70% 90% at 0% 0%, rgb(204 255 0 / 0.09) 0%, transparent 55%), radial-gradient(50% 70% at 100% 100%, rgb(63 227 165 / 0.06) 0%, transparent 60%)",
          }}
        >
          <span className="absolute left-7 top-0 -translate-y-1/2 rounded-full bg-lime px-3 py-1 font-mono text-10 font-medium uppercase tracking-label text-on-lime">
            Hackathon perk
          </span>

          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <h2 className="font-serif text-[32px] leading-[1.1] tracking-display text-foreground sm:text-[40px]">
                A free month of One Pro for every builder.
              </h2>
              <p className="mt-4 max-w-[52ch] text-15 text-secondary">
                Pro is normally{" "}
                <span className="text-foreground line-through decoration-muted">$199/mo</span>.
                Everyone building at the hackathon gets{" "}
                <span className="font-medium text-foreground">the first month for $0</span>: the
                headroom to run agents at scale, not just demo them.
              </p>
              <p className="mt-3 flex items-start gap-2.5 text-13 text-secondary">
                <Trophy size={16} weight="fill" className="mt-0.5 shrink-0 text-amber" />
                <span>
                  <span className="font-medium text-foreground">Win the hackathon and it is a free year.</span>{" "}
                  First place gets 12 months of Pro, second place six months, third place three.
                </span>
              </p>

              <div className="mt-7">
                <Eyebrow dot="lime">Your coupon code</Eyebrow>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <CouponCode code={COUPON_CODE} />
                  <Button href={REDEEM_URL} variant="outline" size="lg">
                    Redeem in the dashboard <ArrowUpRight />
                  </Button>
                </div>
                <p className="mt-3 text-13 text-muted">
                  The month starts when you activate. Partner codes are also in your event
                  confirmation email; prize codes go to the winning teams after demos.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <Eyebrow>How to claim</Eyebrow>
                <ol className="mt-3 space-y-3">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-foreground/25 font-mono text-11 font-semibold text-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-13 font-medium text-foreground">{s.title}</p>
                        <p className="text-13 text-secondary">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <Eyebrow>What Pro includes</Eyebrow>
                <ul className="mt-3 grid gap-2">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-13 text-secondary">
                      <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-spring" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={LINKS.pricing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-13 text-muted transition-colors hover:text-foreground"
                >
                  Compare plans <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
