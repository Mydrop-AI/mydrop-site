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
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
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

const arrowLeft = resolveAssetPath("/media/images/original-site/legacy-arrow-loop-left.webp");
const arrowRight = resolveAssetPath("/media/images/original-site/legacy-arrow-loop-right.webp");

const painPoints = [
  "You juggle too many tabs and tools just to publish one campaign.",
  "Your posting consistency breaks every time client requests stack up.",
  "You lose hours every day doing manual cross-posting work.",
];

const solutionPoints = [
  "One workflow to create, approve, schedule, and publish everywhere.",
  "One calendar that keeps every account organized and consistent.",
  "One AI engine that helps you produce more without burning out.",
];

const workflowSteps = [
  {
    title: "Drop your brief",
    description:
      "Type what you sell, who you target, and your tone. Keep it simple. Mydrop does the heavy lifting.",
  },
  {
    title: "Shape the output",
    description:
      "Edit, approve, and tune your copy, visuals, and videos so everything stays on-brand.",
  },
  {
    title: "Publish at scale",
    description:
      "Launch across your selected channels and keep posting daily without manual chaos.",
  },
];

const scaleCapabilities = [
  "Unlimited profiles and brands",
  "One-click grouped profile posting",
  "Built-in media and caption workflows",
  "Calendar filters by brand, platform, and campaign",
  "Draft, approval, and publishing flow in one place",
  "Clear analytics for every account you manage",
];

const spotlightSections: SpotlightSection[] = [
  {
    title: "Cross-post & schedule everywhere",
    kicker: "Publishing",
    description:
      "Publish to every selected profile in one move and stop repeating the same upload eight times.",
    image: "/media/images/original-site/legacy-cross-posting.webp",
    alt: "Cross posting dashboard",
    icon: Rocket,
    highlights: [
      "One action sends content to multiple platforms.",
      "Keep formatting clean for each channel automatically.",
      "Queue full weeks in one planning block.",
    ],
    cta: "See cross-post flow",
    ctaSecondary: "Talk setup",
  },
  {
    title: "AI content that humans love to read.",
    kicker: "AI Content",
    description:
      "Generate first drafts in your tone so you move from idea to publish-ready post in minutes.",
    image:
      "/media/images/original-site/legacy-ai-chat-with-brand-voice-options-on-a-centralized-dashboard.webp",
    alt: "AI chat with brand voice",
    icon: Wand2,
    highlights: [
      "Brand voice memory keeps tone consistent.",
      "Rewrite instantly for each audience segment.",
      "Turn one angle into a full weekly batch.",
    ],
    cta: "Generate my next week",
    ctaSecondary: "Ask for examples",
  },
  {
    title: "Create on auto-pilot",
    kicker: "Automations",
    description:
      "Automate repetitive publishing work so your channels stay active even when your day gets chaotic.",
    image: "/media/images/original-site/legacy-automation.webp",
    alt: "Automation workflows",
    icon: Workflow,
    highlights: [
      "Trigger posting rules based on your plan.",
      "Reduce manual scheduling across client accounts.",
      "Keep output consistent without burning out.",
    ],
    cta: "Automate my posting",
    ctaSecondary: "Plan my workflow",
  },
  {
    title: "Collaborate with your team",
    kicker: "Team",
    description:
      "Invite teammates or clients, set access by role, and keep approvals moving without bottlenecks.",
    image: "/media/images/original-site/legacy-team-collaboration.webp",
    alt: "Team collaboration board",
    icon: Users2,
    highlights: [
      "Comment and approve in one shared thread.",
      "Separate access between creator, reviewer, and admin.",
      "Stop approval loops in scattered DMs.",
    ],
    cta: "Bring my team in",
    ctaSecondary: "Set permissions",
  },
  {
    title: "Manage your brand with authenticity",
    kicker: "Brand Identity",
    description:
      "Keep messaging consistent across all pages so every post still sounds like your brand.",
    image: "/media/images/original-site/legacy-brands.png",
    alt: "Brand selector and profiles",
    icon: ShieldCheck,
    highlights: [
      "Store tone, positioning, and brand rules once.",
      "Apply brand context before writing starts.",
      "Protect consistency across every account.",
    ],
    cta: "Lock my brand voice",
    ctaSecondary: "Set brand rules",
  },
  {
    title: "Track your success",
    kicker: "Analytics",
    description:
      "Monitor what is working, cut what is not, and make every week smarter than the last.",
    image: "/media/images/original-site/legacy-analytics.webp",
    alt: "Analytics dashboard",
    icon: LineChart,
    highlights: [
      "See top-performing themes at a glance.",
      "Compare platform results without exporting sheets.",
      "Adjust next week with real performance data.",
    ],
    cta: "See real performance",
    ctaSecondary: "Review my metrics",
  },
  {
    title: "Customize your calendar",
    kicker: "Calendar",
    description:
      "Plan by brand and objective with a clear visual calendar that keeps your delivery predictable.",
    image:
      "/media/images/original-site/legacy-drag-and-rop-of-posts-in-a-calendar-view.png",
    alt: "Custom calendar and drag and drop",
    icon: CalendarClock,
    highlights: [
      "Drag, drop, and rebalance campaigns quickly.",
      "Filter by account, campaign, or platform.",
      "Keep launch timing visible for the full team.",
    ],
    cta: "Plan my month",
    ctaSecondary: "Map my calendar",
  },
  {
    title: "Set, forget, relax.",
    kicker: "Scheduling",
    description:
      "Schedule your best slots once and let Mydrop publish on time while you focus on growth work.",
    image:
      "/media/images/original-site/legacy-man-hiking-and-getting-mydrop-notification-of-post-auto-posted-set-forget-relax.png",
    alt: "Set and forget posting",
    icon: Layers3,
    highlights: [
      "Autopublish keeps cadence stable across channels.",
      "Status tracking confirms what is live and queued.",
      "Spend your time on strategy, not posting admin.",
    ],
    cta: "Set it and go",
    ctaSecondary: "Build my autopilot",
  },
];

const dashboardBullets: DashboardFeature[] = [
  {
    title: "Unlimited profiles",
    description: "Run all clients and brands from one workspace.",
    icon: Layers3,
  },
  {
    title: "Fast creation",
    description: "Draft captions and media in one clean flow.",
    icon: Sparkles,
  },
  {
    title: "Approval control",
    description: "Keep publishing guarded with lightweight approvals.",
    icon: ShieldCheck,
  },
  {
    title: "Bulk scheduling",
    description: "Publish campaigns in groups instead of one by one.",
    icon: Workflow,
  },
  {
    title: "Calendar visibility",
    description: "Track upcoming campaigns without spreadsheet juggling.",
    icon: CalendarClock,
  },
  {
    title: "Performance feedback",
    description: "See what wins and plan your next week with confidence.",
    icon: LineChart,
  },
];

const ctaSignals: CtaSignal[] = [
  { label: "57,000+ creators trust this flow", icon: Users2 },
  { label: "No long setup or migration pain", icon: ShieldCheck },
  { label: "Daily output without daily chaos", icon: Sparkles },
];

const faqIcons: LucideIcon[] = [ShieldCheck, Sparkles, CalendarClock, Users2, Workflow, LineChart];

const faqItems = [
  {
    q: "Will automated content feel authentic?",
    a: "Yes. You define the voice, edit when needed, and keep full control before publishing.",
  },
  {
    q: "What if automation makes a mistake?",
    a: "Use approval flow, drafts, and scheduling checks before anything goes live.",
  },
  {
    q: "Is setup complicated?",
    a: "No. Connect profiles, choose your workflow, and publish your first campaign quickly.",
  },
  {
    q: "Can I manage multiple clients?",
    a: "Yes. Separate brands, calendars, permissions, and analytics in one dashboard.",
  },
  {
    q: "Can I still post manually?",
    a: "Absolutely. Use manual posting whenever needed and automation when you want speed.",
  },
  {
    q: "Do I need a big team?",
    a: "No. Mydrop is built for solo operators who need enterprise output without extra hires.",
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
  { name: "Google", src: "/images/platforms/google.webp" },
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
    "Mydrop helps overloaded solo social managers create, schedule, and scale content with one clear workflow. Save hours every week and stay consistent across every platform.";

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

  return (
    <>
      <SEO
        title="Social Media Management, Actually Made Easy"
        description={description}
        canonicalUrl="/"
        image={resolveAssetPath("/images/home/hero-command-center.png")}
        structuredData={structuredData}
      />

      <section className="hero-full">
        <div className="hero-backdrop-grid" aria-hidden />

        <div className="hero-floating-zone" aria-hidden>
          {floatingCards.map((item) => (
            <img key={item.className} src={resolveAssetPath(item.src)} alt={item.alt} className={`hero-float ${item.className}`} />
          ))}
        </div>

        <div className="site-container hero-core">
          <p className="section-kicker">Social Media Management, Actually Made Easy</p>

          <h1 className="hero-title">
            Stop drowning with social.<br></br>
            <span className="hero-highlight"> Let Mydrop do it for you.</span>
          </h1>

          <p className="hero-subcopy">
            You are managing multiple accounts alone. Posting manually is killing your time,
            consistency, and growth. Mydrop turns one brief into post-ready captions, visuals,
            and videos, then schedules everything across platforms. 57,000+ creators and social
            managers already switched to this workflow.
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
              <span className="text-sm text-slate-200">Trusted by 57,000+ creators</span>
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

        <div className="site-container hero-mobile-float-grid">
          {floatingCards.map((item) => (
            <img
              key={`mobile-${item.className}`}
              src={resolveAssetPath(item.src)}
              alt={item.alt}
              className="hero-mobile-float"
              loading="lazy"
            />
          ))}
        </div>
      </section>

      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact">
            <div className="flex flex-col items-center justify-center text-center">
            <h2 className="section-title">Unlimited <span className="hero-highlight">Viral Content</span></h2>
            <p className="section-copy mx-auto mt-4">
              Trailers, tutorials, ads, entertainment, authority posts. Build a real content
              engine, not random one-off posts.
            </p>
          </div>

          <div className="ai-gallery-shell">
            <div className="ai-marquee ai-marquee--a">
              <div className="ai-marquee-track">
                {galleryRowA.map((item, index) => (
                  <article key={`row-a-${item.src}-${index}`} className={`gallery-tile gallery-tile--${item.size}`}>
                    {item.type === "video" ? (
                      <video
                        src={resolveAssetPath(item.src)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={item.alt}
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
                      <video
                        src={resolveAssetPath(item.src)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={item.alt}
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
              <p className="section-kicker">How We Make Magic Happen</p>
              <h2 className="section-title">From idea to published campaign <span className="hero-highlight">in one focused flow.</span></h2>
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
            <p className="section-kicker">Everything You Need</p>
            <h2 className="section-title">Everything you need to manage social media at scale</h2>
            <p className="section-copy mx-auto mt-4">
              Built for overloaded solo managers handling multiple pages and client accounts.
              Fewer tools, faster output, cleaner execution.
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
            <h2 className="section-title">A dashboard built for speed, not busywork.</h2>
            <p className="section-copy mx-auto mt-4">
              One place to review workload, approvals, publishing status, and performance without tab chaos.
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
                <strong>All accounts. One view.</strong>
              </div>

              <div className="dashboard-preview-metric dashboard-preview-metric--alt">
                <span>Execution</span>
                <strong>Plan, approve, publish fast.</strong>
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
                <h2 className="section-title">Your next month of posts can be done in one focused afternoon.</h2>
                <p className="section-copy mt-4">
                  If you keep posting manually, you stay stuck in task mode. Switch to a cleaner workflow and get
                  your time back.
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
                      See if we are a fit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="mega-cta-secondary">
                    <Link to="/contact">Book a quick strategy call</Link>
                  </Button>
                </div>

                <p className="mega-cta-note">Free account. No credit card. Setup takes minutes.</p>
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
              Direct answers so you can decide fast and move without guessing.
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
            <p className="mt-3 text-sm text-slate-300">Free. No engagement. No weird onboarding.</p>
          </div>
        </div>
      </section>
    </>
  );
}
