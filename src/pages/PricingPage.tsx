import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

type BillingCycle = "monthly" | "yearly";
type PlanKey = "free" | "freelance" | "manager" | "business";
type FeatureValue = string | boolean;

interface Plan {
  key: PlanKey;
  name: string;
  prices: Record<BillingCycle, string>;
  hint: string;
  icon: LucideIcon;
  featured: boolean;
  highlights: string[];
}

interface ComparisonGroup {
  label: string;
  rows: { label: string; values: Record<PlanKey, FeatureValue> }[];
}

const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    prices: { monthly: "$0", yearly: "$0" },
    hint: "Test the full workflow on a lighter volume before you scale.",
    icon: Sparkles,
    featured: false,
    highlights: ["10 posts / month", "3 automations", "1 team member", "1 GB storage"],
  },
  {
    key: "freelance",
    name: "Freelancer",
    prices: { monthly: "$9", yearly: "$8" },
    hint: "For solo operators managing one brand or a small client load with real structure.",
    icon: UserRound,
    featured: false,
    highlights: ["50 posts / month", "5 automations", "20 AI images · 10 AI videos", "1 team member", "4 GB storage"],
  },
  {
    key: "manager",
    name: "Teams",
    prices: { monthly: "$19", yearly: "$16" },
    hint: "For multi-brand operators who need more publishing volume, approvals, and team capacity.",
    icon: Users,
    featured: true,
    highlights: ["200 posts / month", "10 automations", "40 AI images · 15 AI videos", "5 team members", "8 GB storage"],
  },
  {
    key: "business",
    name: "Enterprise",
    prices: { monthly: "$39", yearly: "$33" },
    hint: "For agencies and in-house teams running high-volume content operations across many brands and profiles.",
    icon: Building2,
    featured: false,
    highlights: ["Unlimited posts", "Unlimited automations", "50 AI images · 30 AI videos", "Unlimited team members", "15 GB storage"],
  },
];

const comparisonGroups: ComparisonGroup[] = [
  {
    label: "Usage",
    rows: [
      { label: "Posts per month", values: { free: "10", freelance: "50", manager: "200", business: "Unlimited" } },
      { label: "Automations", values: { free: "3", freelance: "5", manager: "10", business: "Unlimited" } },
      { label: "Team members", values: { free: "1", freelance: "1", manager: "5", business: "Unlimited" } },
      { label: "Storage", values: { free: "1 GB", freelance: "4 GB", manager: "8 GB", business: "15 GB" } },
      { label: "Profiles", values: { free: "Unlimited", freelance: "Unlimited", manager: "Unlimited", business: "Unlimited" } },
      { label: "Forms", values: { free: "Unlimited", freelance: "Unlimited", manager: "Unlimited", business: "Unlimited" } },
    ],
  },
  {
    label: "Publishing",
    rows: [
      { label: "Cross-post", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Schedule in bulk", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Post first comment", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Posts drafting", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Profiles grouping", values: { free: true, freelance: true, manager: true, business: true } },
    ],
  },
  {
    label: "AI",
    rows: [
      { label: "AI text generation", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "AI suggestions", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "AI image generation", values: { free: "10 / month", freelance: "20 / month", manager: "40 / month", business: "50 / month" } },
      { label: "AI video generation", values: { free: "3 / month", freelance: "10 / month", manager: "15 / month", business: "30 / month" } },
      { label: "Prompts library", values: { free: true, freelance: true, manager: true, business: true } },
    ],
  },
  {
    label: "Content & integrations",
    rows: [
      { label: "Content gallery", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Media editor", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Templates saving", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Analytics", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Canva integration", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Google Photos", values: { free: true, freelance: true, manager: true, business: true } },
      { label: "Google Drive", values: { free: true, freelance: true, manager: true, business: true } },
    ],
  },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle2 className="h-4 w-4 text-fuchsia-300" aria-label="Included" />
    ) : (
      <span className="text-slate-600">—</span>
    );
  }
  return <span className="text-sm text-slate-200">{value}</span>;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const description =
    "Pricing for brand operators, agencies, and multi-brand teams using Mydrop to plan, create, edit, approve, schedule, and publish at scale.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("Mydrop Pricing", "/pricing", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Pricing For Operators"
        description={description}
        canonicalUrl="/pricing"
        structuredData={structuredData}
      />

      <section className="section-shell">
        <div className="site-container">
          <div className="mx-auto w-full max-w-[980px] space-y-10">

            {/* ── Hero ──────────────────────────────────────────── */}
            <div className="text-center">
              <p className="section-kicker">Pricing</p>
              <h1 className="section-title mt-4">
                Pricing for the people running{" "}
                <span className="hero-highlight">real social operations.</span>
              </h1>
              <p className="section-copy mx-auto mt-5 text-lg">
                Every plan includes the same core system. Choose based on how many brands,
                profiles, posts, automations, collaborators, and publishing volume you need to support.
              </p>

              {/* billing toggle */}
              <div className="mt-8 inline-flex rounded-full border border-white/12 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`w-[140px] rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                  aria-pressed={billingCycle === "monthly"}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`w-[140px] rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    billingCycle === "yearly"
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                  aria-pressed={billingCycle === "yearly"}
                >
                  Yearly
                  <span className="ml-1.5 rounded-full bg-fuchsia-500/30 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-200">
                    −15%
                  </span>
                </button>
              </div>
            </div>

            {/* ── Plan cards ────────────────────────────────────── */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => {
                const PlanIcon = plan.icon;
                return (
                  <article
                    key={plan.key}
                    className={`relative flex flex-col gap-6 overflow-hidden rounded-[24px] p-7 ${
                      plan.featured
                        ? "border border-fuchsia-300/30 bg-white/[0.07]"
                        : "bg-white/[0.055]"
                    }`}
                  >
                    {/* glow for featured */}
                    {plan.featured && (
                      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl" />
                    )}

                    {/* plan name */}
                    <div className="relative flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8">
                          <PlanIcon className="h-4 w-4 text-fuchsia-200" />
                        </div>
                        <span className="text-base font-bold text-white">{plan.name}</span>
                      </div>
                      {plan.featured && (
                        <span className="rounded-full border border-fuchsia-300/35 bg-fuchsia-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-fuchsia-100">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* price */}
                    <div className="relative">
                      <div className="flex items-end gap-1 tabular-nums">
                        <span className="text-5xl font-bold tracking-tight text-white">
                          {plan.prices[billingCycle]}
                        </span>
                        {plan.key !== "free" ? (
                          <span className="mb-1.5 text-base font-medium text-slate-400">/mo</span>
                        ) : null}
                      </div>
                      {plan.key !== "free" ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {billingCycle === "monthly" ? "Billed monthly" : "Billed yearly — 15% off"}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs text-slate-400">No billing</p>
                      )}
                    </div>

                    {/* hint */}
                    <p className="relative text-sm leading-relaxed text-slate-300">
                      {plan.hint}
                    </p>

                    {/* highlights */}
                    <ul className="relative flex-1 space-y-2.5">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-sm text-slate-200">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-fuchsia-300" />
                          {h}
                        </li>
                      ))}
                      <li className="flex items-center gap-2.5 text-sm font-medium text-fuchsia-200">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        Same core workflow included
                      </li>
                    </ul>

                    {/* CTA */}
                    <Button
                      asChild
                      size="lg"
                      variant={plan.featured ? "default" : "outline"}
                      className="relative w-full"
                    >
                      <a
                        href="https://app.mydropai.com/register"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get started free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </article>
                );
              })}
            </div>

            {/* ── Comparison table ──────────────────────────────── */}
            <div className="overflow-hidden rounded-[24px] bg-white/[0.035]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[660px] table-fixed border-collapse">
                  <colgroup>
                    <col className="w-[26%]" />
                    <col className="w-[18.5%]" />
                    <col className="w-[18.5%]" />
                    <col className="w-[18.5%]" />
                    <col className="w-[18.5%]" />
                  </colgroup>

                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Feature
                      </th>
                      {plans.map((plan) => {
                        const PlanIcon = plan.icon;
                        return (
                          <th
                            key={plan.key}
                            className={`px-5 py-5 text-left ${plan.featured ? "bg-fuchsia-500/[0.06]" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              <PlanIcon className="h-3.5 w-3.5 text-fuchsia-300" />
                              <span className="text-sm font-semibold text-white">{plan.name}</span>
                            </div>
                            <p className="mt-1 text-base font-bold tabular-nums text-slate-200">
                              {plan.prices[billingCycle]}
                              {plan.key !== "free" ? (
                                <span className="text-xs font-normal text-slate-400">/mo</span>
                              ) : (
                                <span className="ml-2 text-xs font-normal text-slate-400">No billing</span>
                              )}
                            </p>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonGroups.map((group) => (
                      <>
                        {/* group header */}
                        <tr
                          key={`grp-${group.label}`}
                          className="border-t border-white/[0.07] bg-white/[0.02]"
                        >
                          <td
                            colSpan={5}
                            className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300/70"
                          >
                            {group.label}
                          </td>
                        </tr>

                        {/* feature rows */}
                        {group.rows.map((row) => (
                          <tr
                            key={`${group.label}-${row.label}`}
                            className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-6 py-3.5 text-sm text-slate-300">{row.label}</td>
                            {plans.map((plan) => (
                              <td
                                key={`${row.label}-${plan.key}`}
                                className={`px-5 py-3.5 ${plan.featured ? "bg-fuchsia-500/[0.04]" : ""}`}
                              >
                                <FeatureCell value={row.values[plan.key]} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Bottom CTA ────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-[24px] bg-white/[0.055] p-10 text-center md:p-14">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-sky-600/10 blur-3xl" />

              <div className="relative space-y-4">
                <p className="section-kicker">
                  <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" />
                  No lock-in · Cancel anytime
                </p>
                <h2 className="section-title">
                  Start where you are.{" "}
                  <span className="hero-highlight">Scale when the workload grows.</span>
                </h2>
                <p className="section-copy mx-auto">
                  No credit card required. Start with the volume you need now, then upgrade when
                  your brands, profiles, approvals, or posting cadence demand more room.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button asChild size="lg">
                    <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                      Start for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="https://app.mydropai.com/login" target="_blank" rel="noreferrer">
                      Login
                    </a>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
