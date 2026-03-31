export interface BenefitPoint {
  title: string;
  description: string;
}
/**
 * This TypeScript file contains a type declaration for BlogPost objects.
 * It also exports an array of BlogPost objects, each representing a blog post.
 *
 * Each BlogPost object has properties such as:
 * - slug: A unique identifier for the blog post.
 * - title: The title of the blog post.
 * - description: A brief summary of the blog post.
 * - author: The name of the author or creator of the blog post.
 * - publishedAt: The date and time when the blog post was published.
 * - updatedAt: The date and time when the blog post was last updated.
 * - readTime: The estimated reading time for the blog post in minutes.
 * - heroImage: The path to the image used as the hero image for the blog post.
 * - heroImageAlt: The alt text for the hero image.
 * - heroCaption: A caption describing the hero image.
 * - intro: An array of paragraphs that introduce the main points of the blog post.
 * - whyNeed: An array of BenefitPoint objects, each representing a benefit or need the blog post addresses.
 * - tools: An array of Tool objects, each representing a tool or service mentioned in the blog post.
 * - comparisonRows: An array of ComparisonRow objects, each representing a comparison between two tools or services.
 * - decisionPrompts: An array of DecisionPrompt objects, each representing a question and answer about choosing between tools or services.
 * - closingTitle: The title to use for the conclusion section of the blog post.
 * - closingParagraphs: An array of paragraphs that provide a conclusion or summary of the blog post.
 * - ctaLabel: The label for the call-to-action button on the blog post.
 * - ctaHref: The URL to which the call-to-action button should link.
 *
 * The `getBlogPostBySlug` function takes a slug as an argument and returns the corresponding BlogPost object from the blogPosts array.
 */
export interface ToolReview {
  name: string;
  perfectFor: string;
  summary: string;
  logoSrc?: string;
  logoAlt?: string;
  keyFeatures: string[];
  limitations: string[];
}

export interface ComparisonRow {
  tool: string;
  easeOfUse: string;
  analytics: string;
  contentCreation: string;
  pricing: string;
  bestFor: string;
}

export interface DecisionPrompt {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  heroImage: string;
  heroImageAlt: string;
  heroCaption: string;
  intro: string[];
  whyNeed: BenefitPoint[];
  tools: ToolReview[];
  comparisonRows: ComparisonRow[];
  decisionPrompts: DecisionPrompt[];
  closingTitle: string;
  closingParagraphs: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-get-started-with-content-creation-in-2024",
    title: "How to Get Started with Content Creation in 2026",
    description:
      "Learn how to start content creation in 2026 with a practical step-by-step plan for audience research, platform strategy, SEO, and consistent publishing.",
    author: "Nina Laurent, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-social-media-blog-intro-banner.png",
    heroImageAlt:
      "Content creator planning a multi-platform strategy with AI-assisted workflow tools.",
    heroCaption:
      "A practical roadmap for building a consistent content engine in 2026.",
    intro: [
      "Content creation is more critical than ever as we head into 2026.",
      "This guide covers planning, production, distribution, and optimization so you can publish consistently without burnout.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "Use this framework to create content with more consistency, better quality, and clearer business outcomes.",
    ],
    ctaLabel: "Start exploring Mydrop",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "which-social-media-management-tool-is-best-for-you",
    title: "Which Social Media Management Tool is Best for You?",
    description:
      "Compare Mydrop, Buffer, Hootsuite, Sprout Social, and Later to find the right social media management tool for your workflow.",
    author: "Camille Bernard, Mydrop Team",
    publishedAt: "2025-01-24",
    updatedAt: "2025-01-24",
    readTime: "4 min read",
    heroImage: "/media/images/original-site/legacy-best-social-media-management-tools.webp",
    heroImageAlt:
      "Laptop on a blue background with social media icons, representing social media management tools.",
    heroCaption:
      "Find the right social media management stack for your workflow, your team size, and your growth goals.",
    intro: [
      "Managing social media can feel like juggling too many moving parts at once. You are scheduling content, replying to messages, checking analytics, and trying to stay consistent across every platform.",
      "With so many social media tools on the market, choosing one can feel confusing. This guide compares the top options and highlights where each one fits best.",
      "Whether you are a social media manager, digital marketer, or business owner, this article helps you pick the tool that saves time, improves output quality, and keeps your strategy consistent.",
    ],
    whyNeed: [
      {
        title: "Save time",
        description:
          "Automate repetitive work like scheduling, posting, and reporting so your team can focus on strategy.",
      },
      {
        title: "Improve performance",
        description:
          "Use analytics to identify what works, then optimize your content based on real data.",
      },
      {
        title: "Stay consistent",
        description:
          "Publish on time even during busy weeks, travel days, or campaign crunch periods.",
      },
      {
        title: "Collaborate faster",
        description:
          "Keep approvals, roles, and publishing workflows in one place when multiple people are involved.",
      },
    ],
    tools: [
      {
        name: "Mydrop",
        perfectFor:
          "Social media managers and marketers who want one all-in-one system with AI support.",
        summary:
          "Mydrop combines AI content creation, multi-platform scheduling, collaboration, and analytics in one workflow.",
        logoSrc: "/media/images/original-site/legacy-mydrop-blog-banner.png",
        logoAlt: "Mydrop branding graphic",
        keyFeatures: [
          "AI-powered content creation for captions, ideas, and post variations.",
          "Centralized scheduling across Facebook, Instagram, LinkedIn, TikTok, and Pinterest.",
          "Analytics reports that surface what to improve next.",
          "Collaboration tools with approval flow for teams and clients.",
          "Guided setup so beginners can launch quickly.",
          "Documented efficiency gains of up to 18 hours saved weekly and up to $3,000 monthly in operational value.",
        ],
        limitations: [
          "Product language coverage is still expanding beyond English-first markets.",
          "Free plan includes limited storage.",
        ],
      },
      {
        name: "Buffer",
        perfectFor: "Small businesses and beginners who want a simple posting tool.",
        summary:
          "Buffer is known for ease of use and fast scheduling across major social channels.",
        logoSrc: "/media/images/original-site/legacy-buffer-logo.png",
        logoAlt: "Buffer logo",
        keyFeatures: [
          "Simple post scheduling for Instagram, Facebook, LinkedIn, and X.",
          "Basic analytics to track engagement trends.",
          "Free plan with limited features for individuals.",
        ],
        limitations: [
          "Advanced analytics and team workflows are paywalled.",
          "No built-in AI content generation.",
        ],
      },
      {
        name: "Hootsuite",
        perfectFor: "Larger teams and agencies with many social accounts.",
        summary:
          "Hootsuite offers broad functionality for scheduling, reporting, and account-level management.",
        logoSrc: "/media/images/original-site/legacy-hootsuite-logo.png",
        logoAlt: "Hootsuite logo",
        keyFeatures: [
          "Manage up to 50 accounts from one dashboard.",
          "Built-in content library for creative assets.",
          "Advanced analytics with custom reporting.",
        ],
        limitations: [
          "Can be expensive for solopreneurs and small teams.",
          "Some users report a heavier interface.",
        ],
      },
      {
        name: "Sprout Social",
        perfectFor: "Teams that prioritize social listening and deep analytics.",
        summary:
          "Sprout Social is a premium platform with strong reporting and CRM-oriented capabilities.",
        logoSrc: "/media/images/original-site/legacy-sprout-social-logo.png",
        logoAlt: "Sprout Social logo",
        keyFeatures: [
          "Social listening to monitor brand mentions and sentiment.",
          "Detailed analytics and performance tracking.",
          "Team collaboration and approval workflow support.",
        ],
        limitations: [
          "Higher price point than many competitors.",
          "Can be too advanced for solo users.",
        ],
      },
      {
        name: "Later",
        perfectFor: "Creators and brands focused on visual-first platforms.",
        summary:
          "Later is strong for visual planning and is especially popular for Instagram and Pinterest workflows.",
        logoSrc: "/media/images/original-site/legacy-later-logo-wide.jpg",
        logoAlt: "Later logo",
        keyFeatures: [
          "Visual drag-and-drop content calendar.",
          "Instagram-focused planning flow with hashtag support.",
          "Affordable plans for individuals and small teams.",
        ],
        limitations: [
          "Less advanced analytics than enterprise tools.",
          "No built-in social listening tools.",
        ],
      },
    ],
    comparisonRows: [
      {
        tool: "Buffer",
        easeOfUse: "High",
        analytics: "Basic",
        contentCreation: "No",
        pricing: "Free / $15+",
        bestFor: "Beginners and small teams",
      },
      {
        tool: "Hootsuite",
        easeOfUse: "Medium",
        analytics: "Advanced",
        contentCreation: "No",
        pricing: "$49+ / month",
        bestFor: "Larger teams and agencies",
      },
      {
        tool: "Sprout Social",
        easeOfUse: "Medium",
        analytics: "Advanced",
        contentCreation: "No",
        pricing: "$89+ / month",
        bestFor: "Analytics-focused professionals",
      },
      {
        tool: "Mydrop",
        easeOfUse: "High",
        analytics: "Advanced",
        contentCreation: "Yes (AI)",
        pricing: "Free / $8+",
        bestFor: "All-in-one workflow seekers",
      },
      {
        tool: "Later",
        easeOfUse: "High",
        analytics: "Basic",
        contentCreation: "No",
        pricing: "$18+ / month",
        bestFor: "Instagram and Pinterest users",
      },
    ],
    decisionPrompts: [
      {
        question: "How many platforms do you manage?",
        answer:
          "If you only focus on visual channels, Later can work well. If you need full multi-platform coverage, Mydrop or Hootsuite are stronger options.",
      },
      {
        question: "Do you need advanced analytics?",
        answer:
          "Choose Mydrop or Sprout Social when analytics has a direct impact on your content decisions and reporting.",
      },
      {
        question: "Are you working solo or with a team?",
        answer:
          "Buffer is lightweight for solo use, while Mydrop and Hootsuite offer stronger collaboration for bigger teams.",
      },
      {
        question: "Do you need help creating content?",
        answer:
          "If content production speed is your bottleneck, Mydrop gives you built-in AI generation to move faster.",
      },
    ],
    closingTitle: "Start Managing Your Social Media Like a Pro",
    closingParagraphs: [
      "Social media management tools make execution easier, faster, and more reliable. The right platform reduces stress while improving quality and consistency.",
      "If you want one system that handles AI content, scheduling, collaboration, and analytics together, Mydrop is built for that exact workflow.",
      "Your time is valuable. Move from manual posting to a process that scales.",
    ],
    ctaLabel: "Start with Mydrop for free",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "how-to-schedule-a-post-on-social-media",
    title: "How to Schedule a Post on Social Media?",
    description:
      "Learn how to schedule social media posts step by step and streamline your workflow with Mydrop AI.",
    author: "Lucas Meyer, Mydrop Team",
    publishedAt: "2025-02-03",
    updatedAt: "2025-02-03",
    readTime: "4 min read",
    heroImage: "/media/images/original-site/legacy-top-scheduling-tools-blog-banner.png",
    heroImageAlt:
      "Planning and scheduling social media posts on a visual content calendar.",
    heroCaption: "Planning social content in advance with a visual publishing calendar",
    intro: [
      "Scheduling social media content in advance helps teams stay consistent and frees up daily execution time.",
      "This guide walks through a practical process for planning and scheduling posts with Mydrop AI.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Start Scheduling Today",
    closingParagraphs: [
      "Use scheduling to remove daily posting stress and focus on stronger strategy.",
    ],
    ctaLabel: "Start using Mydrop AI for free",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "how-to-become-a-good-community-manager",
    title: "How To Become a Good Community Manager ?",
    description:
      "Learn how to become an effective community manager with practical skills, strategy tips, and tools that help you scale engagement.",
    author: "Ariana Collins, Mydrop Team",
    publishedAt: "2025-02-19",
    updatedAt: "2025-02-19",
    readTime: "6 min read",
    heroImage: "/media/images/original-site/legacy-how-to-become-a-community-manager.png",
    heroImageAlt:
      "Community manager coordinating social engagement and audience feedback",
    heroCaption: "Building stronger brand communities through consistent engagement",
    intro: [
      "Community managers build trust between brands and audiences through consistent communication and engagement.",
      "This guide covers the core skills, tools, strategy, and execution habits needed to grow as a community manager.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "How To Become a Good Community Manager: Conclusion",
    closingParagraphs: [
      "Use the right skills, tools, and strategic process to build a strong and loyal online community.",
    ],
    ctaLabel: "Sign up for Mydrop AI",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "reach-vs-impressions-in-social-media-marketing",
    title: "Reach vs. Impressions in Social Media Marketing",
    description:
      "Understand the difference between reach and impressions and learn how to use both metrics to improve campaign performance.",
    author: "Maya Chen, Mydrop Team",
    publishedAt: "2025-03-07",
    updatedAt: "2025-03-07",
    readTime: "6 min read",
    heroImage: "/media/images/original-site/legacy-analytics-management-listening-design-for-blog-banner.png",
    heroImageAlt:
      "Analytics dashboard visuals representing reach and impressions in social campaigns",
    heroCaption: "Comparing audience breadth and frequency in social media analytics",
    intro: [
      "Reach and impressions are two core social media metrics that often get mixed up.",
      "This guide explains what each metric means and how to use both for better campaign decisions.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "Use reach and impressions together to understand both visibility and repeat exposure.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "how-to-boost-instagram-engagement-in-2026",
    title: "Boost Instagram Engagement in 2026 with These Proven Strategies",
    description:
      "Learn practical Instagram engagement tactics for 2026, from better content workflows to hashtags, collaborations, and analytics.",
    author: "Elena Park, Mydrop Team",
    publishedAt: "2025-03-18",
    updatedAt: "2025-03-18",
    readTime: "7 min read",
    heroImage: "/media/images/original-site/legacy-boost-your-instagram-engagement-design-for-blog-banner.png",
    heroImageAlt:
      "Instagram engagement strategy board with creative and analytics elements",
    heroCaption: "Proven tactics to increase Instagram engagement in 2026",
    intro: [
      "Instagram engagement growth depends on consistent publishing, content quality, and active audience interaction.",
      "This guide covers practical strategies to strengthen visibility, responses, and repeat interaction.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "Use a consistent process, strong creative, and weekly analysis to grow engagement over time.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "10-essential-questions-to-ask-before-working-with-influencers",
    title: "10 Essential Questions to Ask Before Working With Influencers",
    description:
      "Use these 10 influencer vetting questions to choose better partners, protect brand reputation, and improve campaign outcomes.",
    author: "Noah Rivera, Mydrop Team",
    publishedAt: "2025-03-24",
    updatedAt: "2025-03-24",
    readTime: "6 min read",
    heroImage: "/media/images/original-site/legacy-design-for-blog-banner-social-tools.png",
    heroImageAlt:
      "Influencer collaboration planning board with campaign and audience notes",
    heroCaption: "Questions that help brands choose the right influencer partners",
    intro: [
      "Influencer marketing can accelerate awareness and sales when partner fit is strong.",
      "These 10 questions help you screen collaborators and avoid expensive mismatches.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Wrap-Up and Next Steps",
    closingParagraphs: [
      "Use a repeatable vetting checklist to improve campaign quality and partnership outcomes.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "how-to-plan-a-social-media-content-calendar-in-2026",
    title: "How to Plan a Social Media Content Calendar in 2026",
    description:
      "Learn how to plan a social media content calendar in 2026 with practical steps for goals, platform selection, scheduling, analytics, and AI-assisted execution.",
    author: "Iris Morgan, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-content-calendar-planner-design-for-blog-banner.png",
    heroImageAlt:
      "Weekly social media planning board with content slots and publishing schedule",
    heroCaption:
      "A clear content calendar helps teams stay consistent and focused across platforms",
    intro: [
      "In today's digital landscape, a strong social media strategy depends on planning, consistency, and fast execution.",
      "This guide shows how to build a practical content calendar for 2026, based on the workflow used by the Mydrop team.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "A well-built content calendar turns social media from reactive posting into a repeatable growth system.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "how-to-use-social-proof-in-your-marketing-campaigns",
    title: "How to Use Social Proof in Your Marketing Campaigns to Stand Out",
    description:
      "Learn how to use social proof in marketing campaigns with reviews, testimonials, influencer content, case studies, and UGC to build trust and improve conversions.",
    author: "Mila Torres, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-social-proof-ad-campaigns-how-to-design-for-blog-banner.png",
    heroImageAlt:
      "Social proof marketing board showing reviews, influencer mentions, and campaign outcomes",
    heroCaption:
      "Social proof helps brands build trust faster and stand out in competitive markets",
    intro: [
      "Building trust in a crowded market is difficult, especially when attention is limited and buyers are skeptical.",
      "This guide explains how to use social proof in your campaigns with practical steps and a repeatable workflow.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "A strong social proof strategy can increase trust, improve engagement, and help campaigns convert more consistently.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "skyrocket-your-tiktok-followers-with-these-tips-for-brands-creators",
    title: "How to Skyrocket Your TikTok Followers: Tips for Brands & Creators",
    description:
      "Learn practical TikTok growth strategies for brands and creators, including trend execution, consistent publishing, audience engagement, analytics, and cross-platform promotion.",
    author: "Lena Brooks, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-smiling-man-with-mobile-phone.png",
    heroImageAlt:
      "Creator recording a short-form social video with a smartphone",
    heroCaption:
      "TikTok growth starts with consistent creative output and audience-focused execution",
    intro: [
      "TikTok is one of the most influential social platforms, with huge potential for brands and creators who execute consistently.",
      "This guide covers practical tactics to grow followers, improve engagement, and use Mydrop AI to streamline the workflow.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "Sustained TikTok growth comes from consistent posting, trend relevance, strong engagement loops, and data-driven iteration.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "top-scheduling-tools-for-social-media",
    title: "Master Your Social Media Strategy with These Top Scheduling Tools for Social Media",
    description:
      "Explore top social media scheduling tools and learn how Mydrop AI helps teams save time, stay consistent, and scale publishing across platforms.",
    author: "Nora Ellis, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "9 min read",
    heroImage: "/media/images/original-site/legacy-dashboards-design.png",
    heroImageAlt:
      "Unified social media dashboard with calendar and performance widgets",
    heroCaption:
      "Scheduling tools centralize planning and make social media execution more consistent",
    intro: [
      "Managing multiple social platforms manually creates unnecessary friction for growing teams and solo operators.",
      "This guide explains how scheduling tools improve consistency, save time, and strengthen campaign execution, with a spotlight on Mydrop AI.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "The right scheduling platform turns social media from a daily scramble into a structured growth engine.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "what-are-social-media-tools",
    title: "Mastering Social Media Tools for Business Success",
    description:
      "Learn what social media tools are, why they matter, and how to combine publishing, listening, and analytics workflows to improve business outcomes.",
    author: "Avery Quinn, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-dashboards-design.png",
    heroImageAlt:
      "Social media dashboard with publishing, listening, and analytics modules",
    heroCaption:
      "The right tool stack helps teams manage social media with more speed and clarity",
    intro: [
      "Building a strong social media presence requires more than publishing random updates.",
      "This guide explains what social media tools do and how they help businesses improve consistency, engagement, and performance.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "A connected social tool stack can transform daily execution into a repeatable growth process.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
  {
    slug: "what-is-a-social-media-planner",
    title: "Your Ultimate Guide to Social Media Planners for Small Business Owners",
    description:
      "Learn what a social media planner is, how it saves time and improves consistency, and how Mydrop AI helps automate planning across channels.",
    author: "Evan Blake, Mydrop Team",
    publishedAt: "2026-03-31",
    updatedAt: "2026-03-31",
    readTime: "8 min read",
    heroImage: "/media/images/original-site/legacy-content-calendar-planner-design-for-blog-banner.png",
    heroImageAlt:
      "Social media content planner board with scheduled posts and campaign slots",
    heroCaption:
      "Social media planners help small teams stay consistent and reduce manual workload",
    intro: [
      "Social media planners help businesses schedule content, track metrics, and automate daily tasks.",
      "This guide explains how planners work, how to choose one, and how Mydrop AI can elevate your workflow.",
    ],
    whyNeed: [],
    tools: [],
    comparisonRows: [],
    decisionPrompts: [],
    closingTitle: "Conclusion",
    closingParagraphs: [
      "A strong social media planner turns scattered posting into a structured, measurable growth process.",
    ],
    ctaLabel: "Sign up for Mydrop today",
    ctaHref: "https://app.mydropai.com/register",
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

