import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    title: "Strategy & Workflow",
    items: [
      {
        question: "What is Mydrop actually built to help with?",
        answer:
          "Mydrop is built for the people accountable for what gets posted. It helps you manage brand context, profile differences, trends, hooks, scripts, planning, content creation, editing, approvals, scheduling, and publishing from one operating workflow.",
      },
      {
        question: "Is this mainly for content generation?",
        answer:
          "No. The goal is not just to generate more posts. The goal is to help you make better social decisions faster, then turn those decisions into clean creation and execution.",
      },
      {
        question: "Can Mydrop help before the writing starts?",
        answer:
          "Yes. You can use it to think through trends, angles, hooks, scripts, offers, and campaign direction before you lock into a draft, creative, or publishing plan.",
      },
      {
        question: "Do I need to live inside the platform every day?",
        answer:
          "No. The idea is to batch decisions, schedule in bulk, and keep recurring workflows moving without daily tab chaos.",
      },
    ],
  },
  {
    title: "Brands & Profiles",
    items: [
      {
        question: "What is the difference between brands and profiles in Mydrop?",
        answer:
          "Brands hold the strategy: voice, offers, audience, positioning, and rules. Profiles hold the execution: where that strategy gets adapted for specific channels, pages, or accounts.",
      },
      {
        question: "Can I manage one brand across multiple profiles?",
        answer:
          "Yes. That is a core use case. Keep the strategy consistent at the brand level, then tailor content to the exact profiles that need to publish it.",
      },
      {
        question: "Can I manage multiple clients or brands at the same time?",
        answer:
          "Yes. Mydrop is designed for agencies, freelancers, and teams handling recurring content across many brands without mixing up approvals, calendars, or publishing context.",
      },
      {
        question: "Will everything sound the same across every profile?",
        answer:
          "It should not. The point is to preserve brand consistency while still adapting the execution to each profile, platform, and publishing context.",
      },
    ],
  },
  {
    title: "AI & Content Support",
    items: [
      {
        question: "Can Mydrop help with scripts and trend angles, not just captions?",
        answer:
          "Yes. That is where it should add the most value. Use it to explore what to post, which trend to test, and how to structure the script before moving into final drafts, visuals, and scheduled posts.",
      },
      {
        question: "Can I still edit everything myself?",
        answer:
          "Absolutely. Mydrop is there to reduce repetition and sharpen decisions, not remove your control. You can review, rewrite, adapt, edit, preview, and approve before anything goes live.",
      },
      {
        question: "Does it support AI image and video generation too?",
        answer:
          "Yes. Media generation is included, alongside the wider workflow of drafting posts, editing assets, previewing content, and keeping the creative direction tied to the strategy, brand, and profile you are working on.",
      },
      {
        question: "Will the AI feel generic?",
        answer:
          "It should not. The strongest Mydrop workflows use brand context, profile context, and your working preferences so the output feels guided, not random.",
      },
    ],
  },
  {
    title: "Team & Execution",
    items: [
      {
        question: "Can I invite clients or teammates into the workflow?",
        answer:
          "Yes. Team workflows are built to help multiple people create, review, and move content forward without losing visibility.",
      },
      {
        question: "Can I keep drafts and approvals organized?",
        answer:
          "Yes. Mydrop includes draft, preview, and approval workflows so work can be reviewed before publishing instead of being scattered across chats and docs.",
      },
      {
        question: "Can I schedule many posts quickly?",
        answer:
          "Yes. Bulk scheduling and cross-posting are part of the workflow, so you can move campaigns across brands and profiles without posting one item at a time.",
      },
      {
        question: "Can I see what is live, scheduled, or still waiting?",
        answer:
          "Yes. The goal is to give operators visibility across what is planned, what is being edited, what is approved, what is scheduled, and what is already going out.",
      },
    ],
  },
  {
    title: "Integrations & Plans",
    items: [
      {
        question: "Does Mydrop integrate with Canva, Google Drive, and Google Photos?",
        answer:
          "Yes. Those integrations are available to keep your media workflow connected instead of split across tools.",
      },
      {
        question: "Do I get analytics and a media library?",
        answer:
          "Yes. Mydrop includes analytics, a content gallery, and media tools so planning and execution can stay in the same system.",
      },
      {
        question: "What changes between plans?",
        answer:
          "Plans change based on volume and capacity: how many posts, automations, team members, and storage you need as your operation grows.",
      },
      {
        question: "Can I start free and upgrade later?",
        answer:
          "Yes. You can begin with the free plan, test the workflow, and move up only when your workload or team requires more room.",
      },
    ],
  },
];

const faqItems = faqCategories.flatMap((category) => category.items);

export default function FAQPage() {
  const [openQuestionKeys, setOpenQuestionKeys] = useState<Record<string, boolean>>({});

  const description =
    "Find clear answers about how Mydrop supports brand operators, agencies, profiles, strategy-first AI workflows, and end-to-end publishing.";

  const toggleFaqItem = (key: string) => {
    setOpenQuestionKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("Mydrop FAQ", "/faq", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ]),
    buildFaqSchema(faqItems),
  ];

  return (
    <>
      <SEO
        title="FAQ For Brand Operators"
        description={description}
        canonicalUrl="/faq"
        structuredData={structuredData}
      />

      <section className="section-shell">
        <div className="site-container">
          <div className="mx-auto w-full max-w-[980px] space-y-10">

            {/* ── Hero ──────────────────────────────────────────── */}
            <div className="text-center">
              <p className="section-kicker">FAQ</p>
              <h1 className="section-title mt-4">
                Questions from the people running{" "}
                <span className="hero-highlight">real social workload.</span>
              </h1>
              <p className="section-copy mx-auto mt-5 text-lg">
                The answers teams, agencies, and multi-brand operators usually need before they commit:
                strategy, profiles, workflow, execution, integrations, and pricing.
              </p>

              {/* category pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {faqCategories.map((category) => (
                  <span
                    key={category.title}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-fuchsia-200/90"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            </div>

            {/* ── FAQ categories ────────────────────────────────── */}
            <div className="space-y-8">
              {faqCategories.map((category) => (
                <div key={category.title}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-fuchsia-300/70">
                    {category.title}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {category.items.map((item) => {
                      const itemKey = `${category.title}__${item.question}`;
                      const isOpen = !!openQuestionKeys[itemKey];

                      return (
                        <article
                          key={item.question}
                          className="rounded-[24px] bg-white/[0.055] p-1"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaqItem(itemKey)}
                            aria-expanded={isOpen}
                            className="w-full rounded-[22px] bg-slate-900/40 px-4 py-4 text-left transition hover:bg-slate-900/60"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-base font-semibold text-white">
                                {item.question}
                              </span>
                              <span className="text-slate-300">
                                {isOpen ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </span>
                            </div>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-200 ${
                              isOpen ? "max-h-64" : "max-h-0"
                            }`}
                          >
                            <p className="px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-300">
                              {item.answer}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bottom CTA ────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-[24px] bg-white/[0.055] p-10 text-center md:p-14">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-600/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-sky-600/10 blur-3xl" />

              <div className="relative space-y-4">
                <p className="section-kicker">Still have questions?</p>
                <h2 className="section-title">
                  Start free and{" "}
                  <span className="hero-highlight">see if the workflow clicks.</span>
                </h2>
                <p className="section-copy mx-auto">
                  Create your account, set up a brand, connect a few profiles, and feel what it is like
                  to work from one system instead of scattered tools.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button asChild size="lg">
                    <a
                      href="https://app.mydropai.com/register"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Start for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a
                      href="https://app.mydropai.com/login"
                      target="_blank"
                      rel="noreferrer"
                    >
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
