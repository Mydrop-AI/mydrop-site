import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Layers3,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Users2,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import WebsiteAgentPreview from "@/components/WebsiteAgentPreview";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blog";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";
import { resolveAssetPath } from "@/lib/paths";

type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
  size: "sm" | "md" | "lg" | "wide" | "tall";
};

function ViewportAutoplayVideo({ src, alt }: { src: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resolvedSrc = resolveAssetPath(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    let hasLoadedSource = false;
    const loadAndPlay = () => {
      if (!hasLoadedSource) {
        video.src = resolvedSrc;
        hasLoadedSource = true;
      }

      void video.play().catch(() => {
        // Browser autoplay policies can still reject in edge cases.
      });
    };

    if (!("IntersectionObserver" in window)) {
      loadAndPlay();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadAndPlay();
          return;
        }

        video.pause();
      },
      {
        rootMargin: "180px 0px",
        threshold: 0.12,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [resolvedSrc]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      title={alt}
    />
  );
}

type SpotlightSection = {
  title: string;
  kicker: string;
  description: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  highlights: string[];
  cta: string;
  ctaSecondary: string;
};

type DashboardFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type CtaSignal = {
  label: string;
  icon: LucideIcon;
};

type AgentCapability = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type HeroPromptExample = {
  cta: string;
  prompt: string;
};

const arrowLeft = resolveAssetPath("/media/images/original-site/legacy-arrow-loop-left.webp");
const arrowRight = resolveAssetPath("/media/images/original-site/legacy-arrow-loop-right.webp");

const painPoints = [
  "Every brand has different offers, tone, approvals, and platform rules, but you are expected to hold all of it in your head.",
  "You keep repeating the same brand context, profile instructions, and campaign notes across chats, docs, and teammates.",
  "You do not need more generic AI content. You need better judgment on what angle, trend, script, and format is actually worth shipping.",
];

const solutionPoints = [
  "One workspace to store brand voice, offers, profile context, and publishing rules where the work actually happens.",
  "One social agent that helps you think first, then drafts the content, adapts it, verifies it, and waits for approval.",
  "One operating flow to create, edit, preview, schedule, and publish across every brand and profile you manage.",
];

const heroPromptExamples: HeroPromptExample[] = [
  {
    cta: "What should we post?",
    prompt:
      "I manage 4 skincare brands. Which trends and hooks are actually worth testing this week for our vitamin C launch, and which profiles should we push hardest on?",
  },
  {
    cta: "Write the scripts",
    prompt:
      "Build 3 short-form scripts for a local cafe promo this weekend. Keep the main brand voice warm, but adapt each script to the Instagram Reel and TikTok profiles.",
  },
  {
    cta: "Plan next week",
    prompt:
      "Plan next week for a founder brand and its company page. I want one authority post, one trend-led video, one product push, and profile-specific angles for each.",
  },
];

const workflowSteps = [
  {
    title: "Understand the job",
    description:
      "Start with the goal, the offer, the campaign, or the problem. Mydrop helps clarify the angle before building the actual content.",
  },
  {
    title: "Adapt by brand and profile",
    description:
      "Keep brand strategy at the top level, then tailor the copy, creative, and format for the exact profiles that need to publish.",
  },
  {
    title: "Approve and ship cleanly",
    description:
      "Review the post preview, schedule in bulk, and keep multiple brands moving without scattered docs, DMs, or last-minute chaos.",
  },
];

const scaleCapabilities = [
  "Unlimited brands and profiles",
  "Profile-level adaptation under one brand strategy",
  "Trend, hook, script, and campaign support before drafting",
  "Create posts, visuals, and videos in the same workflow",
  "Calendar filters by brand, profile, platform, and campaign",
  "Draft, edit, preview, approval, and publishing flow in one place",
  "Clear visibility across every account you operate",
];

const spotlightSections: SpotlightSection[] = [
  {
    title: "Operate brands and profiles cleanly",
    kicker: "Publishing",
    description:
      "Brands carry the strategy. Profiles carry the execution. Mydrop helps you adapt the same campaign across the right profiles, then create, schedule, and publish it without losing control.",
    image: "/media/images/original-site/legacy-cross-posting.webp",
    alt: "Cross posting dashboard",
    icon: Rocket,
    highlights: [
      "Keep one brand direction while tailoring output per profile.",
      "Cross-post without flattening every channel into the same message.",
      "Queue full weeks across multiple brands in one planning block.",
    ],
    cta: "See the publishing flow",
    ctaSecondary: "Talk through my setup",
  },
  {
    title: "AI that helps you think before it writes",
    kicker: "Strategy-First AI",
    description:
      "Use Mydrop to figure out what to post, what trend to lean into, what script to shoot, and what angle fits each brand before turning it into real drafts, visuals, and videos.",
    image:
      "/media/images/original-site/legacy-ai-chat-with-brand-voice-options-on-a-centralized-dashboard.webp",
    alt: "AI chat with brand voice",
    icon: Wand2,
    highlights: [
      "Ask for trends, hooks, scripts, offers, or campaign ideas, not just captions.",
      "Keep brand context close so drafts sound intentional, not generic.",
      "Turn one strong angle into a whole week of profile-specific posts and creative directions.",
    ],
    cta: "Plan my next week",
    ctaSecondary: "See strategy examples",
  },
  {
    title: "Run recurring workflows without repeating yourself",
    kicker: "Automations",
    description:
      "When a workflow repeats every week, Mydrop should not make you rebuild it every week. Keep campaigns, content intake, draft generation, and publishing cadence moving.",
    image: "/media/images/original-site/legacy-automation.webp",
    alt: "Automation workflows",
    icon: Workflow,
    highlights: [
      "Reduce repetitive admin across client and multi-brand accounts.",
      "Keep recurring content systems running even when requests pile up.",
      "Stay consistent without rebuilding the same process from scratch.",
    ],
    cta: "Automate my workflow",
    ctaSecondary: "Map my recurring tasks",
  },
  {
    title: "Keep stakeholders aligned without approval chaos",
    kicker: "Team",
    description:
      "When multiple people touch the same brands, you need roles, approvals, previews, and visibility that do not slow the whole machine down.",
    image: "/media/images/original-site/legacy-team-collaboration.webp",
    alt: "Team collaboration board",
    icon: Users2,
    highlights: [
      "Separate creator, approver, and admin responsibilities clearly.",
      "Review drafts and previews where the work is created instead of across scattered DMs.",
      "Keep campaigns moving even when many people are involved.",
    ],
    cta: "Bring my team in",
    ctaSecondary: "Set up approvals",
  },
  {
    title: "Store the brand once, execute across every profile",
    kicker: "Brand Identity",
    description:
      "A brand is not just a logo and a tone line. It is your positioning, offers, audience, rules, and repeatable instincts. Profiles are where that strategy gets adapted, created, and shipped.",
    image: "/media/images/original-site/legacy-brands.png",
    alt: "Brand selector and profiles",
    icon: ShieldCheck,
    highlights: [
      "Store strategy, voice, and campaign context once at the brand level.",
      "Adapt posts and creative at the profile level without losing consistency.",
      "Stop re-explaining the same brand rules every time work starts.",
    ],
    cta: "Set my brand system",
    ctaSecondary: "Define brand rules",
  },
  {
    title: "See what is working, then act on it",
    kicker: "Analytics",
    description:
      "Operators do not need passive charts. They need signals they can use to make the next campaign smarter across brands and profiles.",
    image: "/media/images/original-site/legacy-analytics.webp",
    alt: "Analytics dashboard",
    icon: LineChart,
    highlights: [
      "Spot winning themes, formats, and hooks faster.",
      "Compare what is landing across platforms without spreadsheet hopping.",
      "Use real feedback to guide what to produce next.",
    ],
    cta: "Review my performance",
    ctaSecondary: "See the signals",
  },
  {
    title: "Plan by brand, profile, and campaign",
    kicker: "Calendar",
    description:
      "Your calendar should show the real operating picture: which brand is active, which profiles are publishing, what campaign is running, and what still needs approval or editing.",
    image:
      "/media/images/original-site/legacy-drag-and-rop-of-posts-in-a-calendar-view.png",
    alt: "Custom calendar and drag and drop",
    icon: CalendarClock,
    highlights: [
      "Drag, drop, and rebalance campaigns quickly.",
      "Filter by brand, profile, campaign, or platform.",
      "Keep launch timing visible for the full team.",
    ],
    cta: "Plan my month",
    ctaSecondary: "Map the calendar",
  },
  {
    title: "Keep the machine moving without living in it",
    kicker: "Scheduling",
    description:
      "Scheduling should free you up for strategy, editing, approvals, and better creative decisions, not trap you inside daily publishing admin.",
    image:
      "/media/images/original-site/legacy-man-hiking-and-getting-mydrop-notification-of-post-auto-posted-set-forget-relax.png",
    alt: "Set and forget posting",
    icon: Layers3,
    highlights: [
      "Autopublish keeps cadence stable across brands and channels.",
      "Status tracking confirms what is live, queued, or waiting.",
      "Spend your time on judgment, not posting admin.",
    ],
    cta: "Set it and go",
    ctaSecondary: "Build my autopilot",
  },
];

const dashboardBullets: DashboardFeature[] = [
  {
    title: "Brand memory",
    description: "Keep strategy, offers, tone, and rules attached to the right brand.",
    icon: Layers3,
  },
  {
    title: "Profile clarity",
    description: "See exactly where content needs to be adapted, edited, and published.",
    icon: Sparkles,
  },
  {
    title: "Approval control",
    description: "Keep drafts, previews, and publishing guarded with lightweight approvals.",
    icon: ShieldCheck,
  },
  {
    title: "Bulk execution",
    description: "Publish campaigns in groups instead of one by one.",
    icon: Workflow,
  },
  {
    title: "Calendar visibility",
    description: "Track brands, profiles, and upcoming campaigns without spreadsheet juggling.",
    icon: CalendarClock,
  },
  {
    title: "Performance feedback",
    description: "See what wins and plan the next round with more confidence.",
    icon: LineChart,
  },
];

const ctaSignals: CtaSignal[] = [
  { label: "57,000+ operators, creators, and teams trust this flow", icon: Users2 },
  { label: "No long setup or migration pain", icon: ShieldCheck },
  { label: "Daily output without daily chaos", icon: Sparkles },
];

const agentTypingSuffixes = [
  "understand each brand before it works",
  "adapt strategy to the right profiles",
  "tell you which trends are worth acting on",
  "turn ideas into stronger scripts",
  "plan your content around real campaigns",
  "check drafts before anything goes live",
  "learn how each profile should sound",
  "spot what is landing and what is not",
  "create branded posts and visuals with context",
];

const agentCapabilities: AgentCapability[] = [
  {
    title: "Starts with context",
    description: "Looks at your brand, profiles, and recent work before jumping into output.",
    icon: ShieldCheck,
  },
  {
    title: "Thinks before drafting",
    description: "Helps with angles, trends, and scripts before it commits to content.",
    icon: Workflow,
  },
  {
    title: "Drafts complete outputs",
    description: "Creates ready-to-review posts, creative directions, and profile-specific outputs.",
    icon: Wand2,
  },
  {
    title: "Builds media directions",
    description: "Suggests and supports image and video directions that fit the chosen angle.",
    icon: Layers3,
  },
  {
    title: "Checks before go-live",
    description: "Verifies drafts so obvious mismatches and mistakes are caught early.",
    icon: CheckCircle2,
  },
  {
    title: "Keeps you in control",
    description: "Nothing is applied until you approve.",
    icon: Rocket,
  },
  {
    title: "Shows live progress",
    description: "Streams status while it works so you can review, edit, and schedule with confidence.",
    icon: LineChart,
  },
  {
    title: "Connects ideas to signals",
    description: "Uses available context, live research, and recent results to sharpen drafts.",
    icon: CalendarClock,
  },
];

const pickDifferentRandomIndex = (length = 0, previousIndex = -1) => {
  if (length <= 1) {
    return length ? 0 : -1;
  }

  let nextIndex = Math.floor(Math.random() * length);
  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (length - 1))) % length;
  }
  return nextIndex;
};

const faqIcons: LucideIcon[] = [ShieldCheck, Sparkles, CalendarClock, Users2, Workflow, LineChart];

const faqItems = [
  {
    q: "Is this just another AI content generator?",
    a: "No. Mydrop is built to help you think before you publish, with trends, hooks, scripts, brand context, profile adaptation, and approvals in the same flow.",
  },
  {
    q: "Can it handle one brand with many profiles?",
    a: "Yes. Store strategy, offers, and voice at the brand level, then adapt execution per profile so every channel stays aligned without becoming identical.",
  },
  {
    q: "What if I manage multiple clients or brands?",
    a: "That is exactly where Mydrop fits best. Keep brands, profiles, approvals, and publishing work separated but visible from one operating view.",
  },
  {
    q: "Do I lose control if I use AI and automation?",
    a: "No. Drafts, approvals, and publishing checks keep you in charge. The goal is faster execution with better judgment, not blind automation.",
  },
  {
    q: "Can I still work manually when I need to?",
    a: "Absolutely. Use Mydrop for planning, scripts, and draft support, then stay hands-on wherever the brand needs a human decision.",
  },
  {
    q: "Who gets the most value from Mydrop?",
    a: "The people accountable for what gets posted: brand teams, agencies, freelancers, and operators managing recurring content across many brands or profiles.",
  },
];

const platformIcons = [
  { name: "Instagram", src: "/images/platforms/instagram.webp" },
  { name: "Facebook", src: "/images/platforms/facebook.webp" },
  { name: "LinkedIn", src: "/images/platforms/linkedin.webp" },
  { name: "X", src: "/images/platforms/x.webp" },
  { name: "TikTok", src: "/images/platforms/tiktok.webp" },
  { name: "YouTube", src: "/images/platforms/youtube.webp" },
  { name: "Pinterest", src: "/images/platforms/pinterest.webp" },
  { name: "Threads", src: "/images/platforms/threads.webp" },
  { name: "Google My Business", src: "/images/platforms/googleMyBusiness.webp" },
  { name: "Google Drive", src: "/images/platforms/googleDrive.webp" },
  { name: "Google Calendar", src: "/images/platforms/googleCalendar.webp" },
  { name: "Canva", src: "/images/platforms/canva.webp" },
];

const floatingCards = [
  {
    src: "/images/home/high-organic-reach-counter.webp",
    alt: "High organic reach counter",
    className: "hero-float-1",
  },
  {
    src: "/images/home/total-likes-counter.webp",
    alt: "Total likes counter",
    className: "hero-float-2",
  },
  {
    src: "/images/home/post-approval-workflow.webp",
    alt: "Post approval workflow",
    className: "hero-float-3",
  },
  {
    src: "/images/home/post-request-approval.webp",
    alt: "Post request approval",
    className: "hero-float-4",
  },
  {
    src: "/images/home/scheduled-post-card.webp",
    alt: "Scheduled post card",
    className: "hero-float-5",
  },
  {
    src: "/images/home/ai-mode-selector-panel.webp",
    alt: "AI mode selector panel",
    className: "hero-float-6",
  },
];

const aiGalleryItems: GalleryItem[] = [
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-ai-generated-media.jpg",
    alt: "AI content sample 1",
    size: "md",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-23-smm-5.mp4",
    alt: "AI generated social video 4",
    size: "sm",
  },
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-compressed-ai-generated-media.png",
    alt: "AI content sample 5",
    size: "wide",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-26-ai-generated-video.mp4",
    alt: "AI generated social video 5",
    size: "lg",
  },
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-ai-generated-media-1.jpeg",
    alt: "AI content sample 6",
    size: "sm",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-29-ai-generated-media-3.mp4",
    alt: "AI generated social video 6",
    size: "tall",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-20-smm-3.mp4",
    alt: "AI generated social video 1",
    size: "tall",
  },
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-ai-generated-media-1.png",
    alt: "AI content sample 2",
    size: "sm",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-21-smm-4.mp4",
    alt: "AI generated social video 2",
    size: "wide",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-22-smm-2.mp4",
    alt: "AI generated social video 3",
    size: "md",
  },
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-ai-generated-media-3.png",
    alt: "AI content sample 4",
    size: "tall",
  },
  {
    type: "image",
    src: "/media/images/ai-gallery/ai-ai-generated-media-2.jpeg",
    alt: "AI content sample 7",
    size: "md",
  },
  {
    type: "video",
    src: "/media/videos/ai-gallery/ai-33-ai-generated-media-8.mp4",
    alt: "AI generated social video 7",
    size: "wide",
  },
];

export default function HomePage() {
  const description =
    "Mydrop helps brand operators, agencies, and multi-brand teams decide what to post, create the content, adapt it to the right profiles, and turn strategy into approved scheduled publishing.";
  const [agentTypingSuffix, setAgentTypingSuffix] = useState(
    agentTypingSuffixes[0] ? `${agentTypingSuffixes[0]}...` : "",
  );

  useEffect(() => {
    let isActive = true;
    let lastIndex = -1;

    const wait = (ms = 0) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const runTypingLoop = async () => {
      while (isActive) {
        const nextIndex = pickDifferentRandomIndex(agentTypingSuffixes.length, lastIndex);
        lastIndex = nextIndex;
        const nextSuffix = `${agentTypingSuffixes[nextIndex] || ""}...`;

        for (let index = 0; index <= nextSuffix.length; index += 1) {
          if (!isActive) {
            return;
          }
          setAgentTypingSuffix(nextSuffix.slice(0, index));
          await wait(22);
        }

        await wait(2000);

        for (let index = nextSuffix.length; index >= 0; index -= 1) {
          if (!isActive) {
            return;
          }
          setAgentTypingSuffix(nextSuffix.slice(0, index));
          await wait(14);
        }

        await wait(180);
      }
    };

    void runTypingLoop();

    return () => {
      isActive = false;
    };
  }, []);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mydrop",
    url: "https://www.mydropai.com",
    description,
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mydrop",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free account available",
      url: "https://app.mydropai.com/register",
    },
    url: "https://www.mydropai.com",
    description,
  };

  const structuredData = [
    organizationSchema,
    websiteSchema,
    softwareApplicationSchema,
    buildWebPageSchema("Mydrop Home", "/", description),
    buildBreadcrumbSchema([{ name: "Home", path: "/" }]),
  ];

  const uniqueGalleryItems = aiGalleryItems.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.src === item.src) === index,
  );
  const gallerySplitIndex = Math.ceil(uniqueGalleryItems.length / 2);
  const galleryRowASeed = uniqueGalleryItems.slice(0, gallerySplitIndex);
  const galleryRowBSeed = uniqueGalleryItems.slice(gallerySplitIndex);

  const galleryRowA = [...galleryRowASeed, ...galleryRowASeed];
  const galleryRowB = [...galleryRowBSeed, ...galleryRowBSeed];
  const homeBlogPosts = blogPosts.slice(0, 20);

  return (
    <>
      <SEO
        title="The Brand-Aware Social Agent for Teams Running Many Profiles"
        description={description}
        canonicalUrl="/"
        image={resolveAssetPath("/images/home/hero-command-center.png")}
        imageAlt="MydropAI dashboard with AI content creation, scheduling, analytics, and multi-platform publishing"
        structuredData={structuredData}
      />

      <section className="hero-full">
        <div className="hero-backdrop-grid" aria-hidden />

        <div className="site-container hero-core">
          <div className="hero-copy">
            <h1 className="hero-title">
              Your first Social Agent to <br></br>
              <span className="hero-highlight">{agentTypingSuffix}</span>
              <span className="ml-1 inline-block h-9 w-[3px] animate-pulse rounded-full bg-fuchsia-300 align-middle" aria-hidden />
            </h1>

            <p className="hero-subcopy">
              Give it the goal. It helps you think, creates the draft, lets you edit and preview it, then checks the output and asks before posting.
            </p>

          </div>

          <div className="hero-agent-stage">
            <div className="hero-agent-stack">
              <WebsiteAgentPreview quickActions={heroPromptExamples} />
              <div className="hero-example-callout" aria-hidden>
                <span className="hero-example-callout-text">Try it!</span>
                <img src={arrowRight} alt="Curved arrow right" className="hero-example-callout-arrow" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

      </section>

      <section className="section-shell agent-story-shell">
        <div className="section-backdrop-grid agent-story-backdrop" aria-hidden />
        <div className="hero-floating-zone" aria-hidden>
          {floatingCards.map((item) => (
            <img key={item.className} src={resolveAssetPath(item.src)} alt={item.alt} className={`hero-float ${item.className}`} />
          ))}
        </div>

        <div className="site-container section-content section-content--compact agent-story-content">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2">
              <Rocket className="h-4 w-4 text-rose-500" />
              <p className="section-kicker">Built for the people accountable for what gets posted</p>
            </div>

            <h2 className="hero-title">
              Stop carrying every brand in your head.<br></br>
              <span className="hero-highlight"> Run the whole social operation from one system.</span>
            </h2>

            <p className="hero-subcopy">
              Mydrop is for brands, agencies, and the operators behind many brands. Keep strategy
              at the brand level, adapt execution at the profile level, and move from idea to
              created, edited, approved, scheduled content without scattered tabs, briefs, and repeated context.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                  Start for free
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://app.mydropai.com/login" target="_blank" rel="noreferrer">
                  Login
                </a>
              </Button>
            </div>

            <div className="hero-proof-row mt-8">
              <div className="hero-trust">
                <img
                  src={resolveAssetPath("/images/home/user-headshots.webp")}
                  alt="Creators and social managers using Mydrop"
                  className="h-9 w-auto object-contain"
                  loading="lazy"
                />
                <span className="text-sm text-slate-200">Trusted by 57,000+ social operators, creators, and teams</span>
                <span className="inline-flex items-center gap-1" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`star-${index}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </span>
              </div>
            </div>

            <ul className="platform-row mt-6">
              {platformIcons.map((platform) => (
                <li key={platform.name} className="platform-pill" title={platform.name}>
                  <img
                    src={resolveAssetPath(platform.src)}
                    alt={`${platform.name} icon`}
                    className="h-5 w-5 object-contain"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-shell agent-story-shell">
        <div className="section-backdrop-grid agent-story-backdrop" aria-hidden />

        <div className="site-container section-content section-content--compact agent-story-content">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
            <article className="simple-card p-6">
              <h3 className="text-2xl font-semibold text-white">How the workflow feels</h3>
              <p className="mt-2 text-slate-300">
                Keep the brief simple. Mydrop helps you narrow the direction first, then carries the heavy first pass through drafting, editing, previewing, and scheduling.
              </p>

              <ul className="mt-5 space-y-3">
                <li className="flex items-start gap-3 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-200">1</span>
                  <span>Tell it the goal, the offer, or the problem you are trying to solve.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-200">2</span>
                  <span>It helps with trends, hooks, scripts, and the right angle before drafting the content.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-200">3</span>
                  <span>It adapts the work across the right brands and profiles, then gives you drafts, media direction, and preview-ready posts.</span>
                </li>
                <li className="flex items-start gap-3 text-slate-200">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-200">4</span>
                  <span>You approve once. It handles the scheduling and publishing busywork after the thinking is done.</span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  Reduce repeated context
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  Keep every brand sounding intentional
                </span>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">
                  Draft, preview, and publish in one place
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                    Open the full AI Agent
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Show me my workflow</Link>
                </Button>
              </div>
            </article>

            <article className="simple-card p-6">
              <h3 className="text-2xl font-semibold text-white">What it handles for you</h3>
              <p className="mt-2 text-slate-300">Everything below works together so you can move from strategy into actual execution fast.</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {agentCapabilities.map((capability) => {
                  const CapabilityIcon = capability.icon;

                  return (
                    <article key={capability.title} className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1d9bf0]/20 text-[#7fc6ff]">
                          <CapabilityIcon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{capability.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-300">{capability.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact">
            <div className="flex flex-col items-center justify-center text-center">
            <h2 className="section-title">More than captions. <span className="hero-highlight">A real content engine.</span></h2>
            <p className="section-copy mx-auto mt-4">
              Trends, scripts, hooks, visuals, offers, campaigns, authority posts, short-form videos,
              editable drafts, and scheduled publishing. Build repeatable output, not random one-off drafts.
            </p>
          </div>

          <div className="ai-gallery-shell">
            <div className="ai-marquee ai-marquee--a">
              <div className="ai-marquee-track">
                {galleryRowA.map((item, index) => (
                  <article key={`row-a-${item.src}-${index}`} className={`gallery-tile gallery-tile--${item.size}`}>
                    {item.type === "video" ? (
                      <ViewportAutoplayVideo
                        src={item.src}
                        alt={item.alt}
                      />
                    ) : (
                      <img src={resolveAssetPath(item.src)} alt={item.alt} loading="lazy" />
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="ai-marquee ai-marquee--b">
              <div className="ai-marquee-track">
                {galleryRowB.map((item, index) => (
                  <article key={`row-b-${item.src}-${index}`} className={`gallery-tile gallery-tile--${item.size}`}>
                    {item.type === "video" ? (
                      <ViewportAutoplayVideo
                        src={item.src}
                        alt={item.alt}
                      />
                    ) : (
                      <img src={resolveAssetPath(item.src)} alt={item.alt} loading="lazy" />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--tint">
        <div className="site-container section-content">
          <div className="section-heading">
            <img src={arrowLeft} alt="Curved arrow left" className="section-arrow" loading="lazy" />
            <div className="text-center">
              <p className="section-kicker">Your Problem / Our Solution</p>
              <h2 className="section-title">The overload is real. <br></br><span className="hero-highlight">Your workflow does not have to be.</span></h2>
            </div>
            <img src={arrowRight} alt="Curved arrow right" className="section-arrow" loading="lazy" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <article className="simple-card p-6">
              <h3 className="text-2xl font-semibold text-white">What is happening now</h3>
              <ul className="mt-4 space-y-3">
                {painPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e6346c]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <img
                src={resolveAssetPath("/media/images/original-site/legacy-clients-struggles-chat-bubbles.webp")}
                alt="Client struggles and message overload"
                className="feature-media mt-6"
                loading="lazy"
              />
            </article>

            <article className="simple-card p-6">
              <h3 className="text-2xl font-semibold text-white">What changes with Mydrop</h3>
              <ul className="mt-4 space-y-3">
                {solutionPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d9bf0]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <img
                src={resolveAssetPath("/media/images/original-site/legacy-mydrop-solution.webp")}
                alt="Mydrop solution board"
                className="feature-media mt-6"
                loading="lazy"
              />
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact">
          <div className="section-heading">
            <img src={arrowRight} alt="Curved arrow right" className="section-arrow" loading="lazy" />
            <div className="text-center">
              <p className="section-kicker">How The Flow Works</p>
              <h2 className="section-title">From messy context to scheduled content <span className="hero-highlight">in one focused flow.</span></h2>
            </div>
            <img src={arrowLeft} alt="Curved arrow left" className="section-arrow" loading="lazy" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="simple-card p-6">
                <p className="mb-2 text-sm font-semibold text-fuchsia-200">0{index + 1}</p>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--tint">
        <div className="site-container section-content section-content--compact">
            <div className="text-center">
              <p className="section-kicker">Built For Operators</p>
            <h2 className="section-title">Built for people running many brands, not just making one post</h2>
            <p className="section-copy mx-auto mt-4">
              Mydrop is for the operator between strategy and publishing. The one coordinating
              brands, profiles, content requests, creation, approvals, scheduling, and deadlines all at once.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
            <article className="simple-card p-6">
              <ul className="space-y-3">
                {scaleCapabilities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e6346c]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-6">
                <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                  Start for free
                </a>
              </Button>
            </article>

            <article className="simple-card p-4">
              <img
                src={resolveAssetPath("/media/images/original-site/legacy-multi-post-selection-of-multiple-profiles-to-cross-post.png")}
                alt="Multiple profile cross-posting selection"
                className="feature-media"
                loading="lazy"
              />
            </article>
          </div>
        </div>
      </section>

      {spotlightSections.map((feature, index) => {
        const FeatureIcon = feature.icon;
        const isAlt = index % 2 === 1;

        return (
          <section
            key={feature.title}
            className={`section-shell ${isAlt ? "section-shell--deep" : "section-shell--tint"} feature-band-shell`}
          >
            <div className="site-container section-content section-content--compact feature-band-content">
              <div className={`feature-band ${isAlt ? "feature-band--alt" : ""}`}>
                <article className={`feature-band-copy ${isAlt ? "lg:order-2" : ""}`}>
                  <div className="feature-band-head">
                    <span className="feature-band-icon">
                      <FeatureIcon className="h-5 w-5" />
                    </span>
                    <p className="section-kicker">{feature.kicker}</p>
                    <span className="feature-band-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <h2 className="feature-band-title">{feature.title}</h2>
                  <p className="feature-band-description">{feature.description}</p>

                  <div className="feature-band-list">
                    {feature.highlights.map((item) => (
                      <div key={item} className="feature-band-point">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7fc6ff]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="feature-band-actions">
                    <Button asChild size="lg" className="feature-band-primary">
                      <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                        {feature.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="feature-band-ghost">
                      <Link to="/contact">{feature.ctaSecondary}</Link>
                    </Button>
                  </div>
                </article>

                <article className={`feature-band-media ${isAlt ? "lg:order-1" : ""}`}>
                  <div className="feature-band-media-frame">
                    <img
                      src={resolveAssetPath(feature.image)}
                      alt={feature.alt}
                      className="feature-media feature-band-image"
                      loading="lazy"
                    />
                    <div className="feature-band-glow" aria-hidden />
                  </div>
                </article>
              </div>
            </div>
          </section>
        );
      })}

      <section className="section-shell section-shell--deep feature-band-shell feature-band-shell--dashboard">
        <div className="site-container section-content section-content--compact dashboard-band-content">
          <div className="text-center">
            <p className="section-kicker">Command Center</p>
            <h2 className="section-title">A dashboard for operators, not just posters.</h2>
            <p className="section-copy mx-auto mt-4">
              One place to review brands, profiles, workload, drafts, approvals, publishing status, and performance without tab chaos.
            </p>
          </div>

          <div className="dashboard-band">
            <article className="dashboard-grid">
              {dashboardBullets.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <div key={item.title} className="dashboard-pill">
                    <span className="dashboard-pill-icon">
                      <ItemIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="dashboard-pill-title">{item.title}</p>
                      <p className="dashboard-pill-copy">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </article>

            <article className="dashboard-preview">
              <img
                src={resolveAssetPath("/media/images/original-site/legacy-effortless-dashboard2.webp")}
                alt="Effortless dashboard preview"
                className="feature-media dashboard-preview-image"
                loading="lazy"
              />

              <div className="dashboard-preview-metric">
                <span>Focus mode</span>
                <strong>All brands. All profiles. One view.</strong>
              </div>

              <div className="dashboard-preview-metric dashboard-preview-metric--alt">
                <span>Execution</span>
                <strong>Plan, adapt, approve, publish fast.</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--tint cta-shell">
        <div className="site-container section-content section-content--compact cta-content">
          <article className="mega-cta">
            <div className="mega-cta-grid">
              <div className="mega-cta-copy">
                <p className="section-kicker">Ready To Move Faster</p>
                <h2 className="section-title">Your next month of content can move from idea to approved plan in one focused afternoon.</h2>
                <p className="section-copy mt-4">
                  Stop rebuilding brand context, briefs, and profile instructions every week. Move into a cleaner
                  operating system that helps you decide faster, create faster, and publish without chaos.
                </p>

                <div className="mega-cta-signals">
                  {ctaSignals.map((signal) => {
                    const SignalIcon = signal.icon;

                    return (
                      <span key={signal.label} className="mega-cta-signal">
                        <SignalIcon className="h-4 w-4" />
                        {signal.label}
                      </span>
                    );
                  })}
                </div>

                <div className="mega-cta-actions">
                  <Button asChild size="lg" className="mega-cta-primary">
                    <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                  Start free and test the workflow
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="mega-cta-secondary">
                    <Link to="/contact">Book a quick strategy call</Link>
                  </Button>
                </div>

                <p className="mega-cta-note">Free account. No credit card. Enough structure to feel the difference fast.</p>
              </div>

              <div className="mega-cta-media">
                <article className="mega-cta-media-card">
                  <img
                    src={resolveAssetPath("/media/images/original-site/legacy-review-13.webp")}
                    alt="Customer review card"
                    className="mega-cta-media-image"
                    loading="lazy"
                  />
                </article>
                <article className="mega-cta-media-card mega-cta-media-card--offset">
                  <img
                    src={resolveAssetPath("/media/images/original-site/legacy-smiling-team-looking-at-ipad.png")}
                    alt="Happy team using Mydrop"
                    className="mega-cta-media-image"
                    loading="lazy"
                  />
                </article>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-shell section-shell--deep faq-shell">
        <div className="site-container section-content section-content--compact faq-content">
          <div className="text-center">
            <h2 className="section-title">Still unsure? <span className="hero-highlight">Let’s clear things up.</span></h2>
              <p className="section-copy mx-auto mt-4">
              Direct answers for the people deciding whether Mydrop can really carry their brand and profile workload.
            </p>
          </div>

          <div className="faq-grid">
            {faqItems.map((item, index) => {
              const FaqIcon = faqIcons[index % faqIcons.length];

              return (
                <article key={item.q} className="faq-card">
                  <div className="faq-card-top">
                    <span className="faq-card-icon">
                      <FaqIcon className="h-4 w-4" />
                    </span>
                    <span className="faq-card-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="faq-card-title">{item.q}</h3>
                  <p className="faq-card-copy">{item.a}</p>
                </article>
              );
            })}
          </div>

          <div className="faq-footer">
            <div className="faq-footer-actions">
              <Button asChild size="lg">
                <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                  I start my free account now
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Talk with us first</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm text-slate-300">Free to start. No credit card. No bloated onboarding.</p>
          </div>
        </div>
      </section>

      <section className="section-shell section-shell--tint">
        <div className="site-container section-content section-content--compact gap-6">
          <div className="text-center">
            <p className="section-kicker">From The Blog</p>
          </div>

          <section className="blog-slider-shell" aria-label="Latest blog posts">
            <div className="blog-slider-track">
              {homeBlogPosts.map((post) => (
                <div key={post.slug} className="blog-slider-slide">
                  <BlogPostCard post={post} compact headingTag="h3" />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">See all blog posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
