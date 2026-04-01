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
    title: "Time Management & Workflow",
    items: [
      {
        question: "How much time can I save?",
        answer:
          "Most users save 15–20 hours per week by automating repetitive social tasks like drafting, scheduling, and cross-posting.",
      },
      {
        question: "Do I need to be constantly on Mydrop?",
        answer:
          "No. You can batch your content, schedule in bulk, and let automations run in the background.",
      },
      {
        question: "Can I manage multiple platforms at once?",
        answer:
          "Yes. Mydrop supports cross-posting workflows so you can manage multiple social channels from one place.",
      },
      {
        question: "Can I schedule many posts quickly?",
        answer:
          "Yes. Bulk scheduling is included, so you can queue multiple posts in one workflow instead of publishing one by one.",
      },
    ],
  },
  {
    title: "Content Creation",
    items: [
      {
        question: "Can Mydrop help me write captions?",
        answer:
          "Yes. AI text generation and AI suggestions are included across all plans to help you draft faster.",
      },
      {
        question: "Can I generate images with AI?",
        answer:
          "Yes. AI image generation is included, so you can create visuals directly in your workflow.",
      },
      {
        question: "Can I save my best ideas and formats?",
        answer:
          "Yes. You can save templates and keep a prompts library to reuse high-performing formats.",
      },
      {
        question: "Can I auto-post the first comment?",
        answer:
          "Yes. The post-first-comment feature is included in the platform.",
      },
    ],
  },
  {
    title: "Team & Collaboration",
    items: [
      {
        question: "Can I invite team members?",
        answer:
          "Yes. Team members are supported by plan, from 3 seats to unlimited on higher tiers.",
      },
      {
        question: "Can I organize work by brand or profile groups?",
        answer:
          "Yes. Profiles grouping and brand-oriented workflows are available to keep client work organized.",
      },
      {
        question: "Can I prepare drafts before publishing?",
        answer:
          "Yes. Posts drafting is included so you can review and refine content before it goes live.",
      },
    ],
  },
  {
    title: "Technical & Integrations",
    items: [
      {
        question: "Does Mydrop integrate with Canva?",
        answer:
          "Yes. Canva integration is included so you can connect and streamline your design workflow.",
      },
      {
        question: "Can I connect Google Drive and Google Photos?",
        answer:
          "Yes. Both Google Drive and Google Photos integrations are available.",
      },
      {
        question: "Is there a media library and editor?",
        answer:
          "Yes. Mydrop includes a content gallery and media editor for managing and refining your assets.",
      },
      {
        question: "Do I get analytics?",
        answer:
          "Yes. Analytics is included so you can track results and improve your posting strategy.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    items: [
      {
        question: "Is there monthly and yearly billing?",
        answer:
          "Yes. You can switch between monthly and yearly billing. Yearly saves you 15%.",
      },
      {
        question: "What are the main plan differences?",
        answer:
          "Plans differ by posting volume, automation count, team seats, and storage. Core features are available across all plans.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. You can stop at any time. There is no long-term commitment required.",
      },
      {
        question: "Where can I get started?",
        answer:
          "Create your account at app.mydropai.com/register and start using the platform right away.",
      },
    ],
  },
];

const faqItems = faqCategories.flatMap((category) => category.items);

export default function FAQPage() {
  const [openQuestionKeys, setOpenQuestionKeys] = useState<Record<string, boolean>>({});

  const description =
    "Find complete answers about Mydrop features, integrations, collaboration, workflows, and pricing.";

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
        title="FAQ"
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
                Hi, how can{" "}
                <span className="hero-highlight">we help?</span>
              </h1>
              <p className="section-copy mx-auto mt-5 text-lg">
                Everything people ask before they start — workflow, content,
                team setup, integrations, and pricing.
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
                  <span className="hero-highlight">test it yourself.</span>
                </h2>
                <p className="section-copy mx-auto">
                  Create your account and explore the full workflow. No credit
                  card required.
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
