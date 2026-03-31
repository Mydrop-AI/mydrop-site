import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  User2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
  SITE_URL,
} from "@/lib/seo";
import { getBlogPostBySlug } from "@/lib/blogPosts";
import { Button } from "@/components/ui/button";
import NotFoundPage from "@/pages/NotFoundPage";

const SOCIAL_TOOLS_SLUG = "which-social-media-management-tool-is-best-for-you";
const SCHEDULING_SLUG = "how-to-schedule-a-post-on-social-media";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(dateValue: string) {
  return dateFormatter.format(new Date(dateValue));
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug ?? "");

  if (!post) {
    return <NotFoundPage />;
  }

  const canonicalPath = `/post/${post.slug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${SITE_URL}${post.heroImage}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: organizationSchema,
    mainEntityOfPage: canonicalUrl,
  };

  const structuredData = [
    organizationSchema,
    blogPostingSchema,
    buildWebPageSchema(post.title, canonicalPath, post.description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: canonicalPath },
    ]),
  ];

  const isSocialToolsPost = post.slug === SOCIAL_TOOLS_SLUG;
  const isSchedulingPost = post.slug === SCHEDULING_SLUG;

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        canonicalUrl={canonicalPath}
        image={post.heroImage}
        structuredData={structuredData}
      />

      <section className="section-shell section-shell--deep">
        <div className="site-container py-10 md:py-14">
          <article className="mx-auto max-w-3xl blog-prose" itemScope itemType="https://schema.org/BlogPosting">
            <p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </p>

            <header>
              <h1 itemProp="headline">{post.title}</h1>

              <p className="blog-meta-row">
                <span className="inline-flex items-center gap-1.5">
                  <User2 className="h-4 w-4" />
                  Writer: {post.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {post.readTime}
                </span>
              </p>

              <p className="blog-meta-update" itemProp="dateModified" content={post.updatedAt}>
                Updated: {formatDate(post.updatedAt)}
              </p>
            </header>

            <figure className="blog-hero">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt}
                className="h-[210px] w-full object-cover md:h-[360px]"
                loading="eager"
                itemProp="image"
              />
              <figcaption>{post.heroCaption}</figcaption>
            </figure>

            {isSocialToolsPost && (
              <>
                <p itemProp="description">
                  Managing social media can feel like juggling on a tightrope while riding a unicycle, daunting,
                  time-consuming, and often overwhelming. Between content scheduling, responding to messages,
                  analyzing performance, and ensuring consistency across platforms, it is easy to feel stretched
                  too thin. That is where social media management tools come to the rescue.
                </p>

                <p>
                  But with so many tools on the market promising to transform your workflow, how do you know
                  which one is the right fit for you or your team? This article breaks down the features of the
                  top tools, compares their benefits, and highlights why Mydrop is the game-changer you have been
                  looking for.
                </p>

                <p>
                  Whether you are a social media manager, a digital marketer, or a small business owner managing
                  your online presence, by the end of this guide, you will know which tool to choose to save time,
                  improve efficiency, and grow your social media strategy.
                </p>

                <h2>Why Do You Need a Social Media Management Tool?</h2>

                <p>
                  Before jumping into the comparison, let us address the why. If you are still manually posting on
                  platforms, or switching between apps to check analytics and respond to messages, you are wasting
                  hours of valuable time.
                </p>

                <p>Social media management tools help you in four critical ways:</p>
                <ul>
                  <li>
                    <strong>Save Time:</strong> Automate repetitive tasks like posting, scheduling, and reporting.
                  </li>
                  <li>
                    <strong>Improve Performance:</strong> Use analytics to understand what works and optimize your strategy.
                  </li>
                  <li>
                    <strong>Ensure Consistency:</strong> Post on time, every time, even if you are on vacation.
                  </li>
                  <li>
                    <strong>Streamline Collaboration:</strong> Help teams manage multiple clients or platforms efficiently.
                  </li>
                </ul>

                <p>
                  If that sounds like something you need, let us explore the top contenders in 2024.
                </p>

                <h2>Top Social Media Management Tools to Consider</h2>

                <h3>1. Mydrop (The Game-Changer)</h3>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-mydrop-blog-banner.png"
                    alt="Mydrop interface on multiple tablets showing scheduling, automation, and contact workflows."
                    className="h-[210px] w-full object-cover md:h-[330px]"
                    loading="lazy"
                  />
                </figure>

                <p>
                  <strong>Perfect for:</strong> Anyone looking to save time and automate their workflow with ease.
                </p>

                <p>
                  This is where Mydrop truly shines. It is the go-to tool for social media managers and digital
                  marketers who want an all-in-one solution that simplifies workflow and offers AI-powered
                  content creation.
                </p>

                <h4>Key Features of Mydrop</h4>
                <ul>
                  <li>Automated content creation that generates engaging posts in seconds using AI tools.</li>
                  <li>Centralized scheduling across Facebook, Instagram, LinkedIn, TikTok, and Pinterest.</li>
                  <li>Exclusive analytics reports with actionable insights to fine-tune strategy.</li>
                  <li>Strong efficiency gains, with potential savings of up to 18 hours per week and $3,000 per month.</li>
                  <li>Team collaboration through shared dashboards and approval systems.</li>
                  <li>Guided setup that helps both beginners and experts get started quickly.</li>
                </ul>

                <h4>Why Social Media Managers Love Mydrop</h4>
                <p>
                  93% of social media professionals face daily stress managing multiple platforms, content needs,
                  and deadlines. Mydrop does not just manage workflow, it transforms it.
                </p>

                <p>
                  <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                    Get started for free and see how Mydrop could revolutionize the way you manage social media.
                  </a>
                </p>

                <h4>Limitations</h4>
                <ul>
                  <li>Currently focused on English-speaking markets, with more languages coming soon.</li>
                  <li>Free plan includes limited storage space.</li>
                </ul>

                <h3>2. Buffer</h3>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-buffer-logo.png"
                    alt="Buffer logo."
                    className="h-20 w-full object-contain"
                    loading="lazy"
                  />
                </figure>

                <p><strong>Perfect for:</strong> Small businesses and beginners.</p>
                <p>
                  Buffer is known for simplicity. It lets you schedule posts, analyze performance, and engage
                  with your audience from one dashboard.
                </p>
                <p>
                  <strong>Key features:</strong> easy scheduling, basic analytics, and a free plan for individuals.
                </p>
                <p>
                  <strong>Limitations:</strong> advanced analytics and team collaboration are mostly in paid plans,
                  and there is no built-in content creation.
                </p>

                <h3>3. Hootsuite</h3>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-hootsuite-logo.png"
                    alt="Hootsuite logo with red owl icon and text."
                    className="h-20 w-full object-contain"
                    loading="lazy"
                  />
                </figure>

                <p><strong>Perfect for:</strong> Larger teams and agencies.</p>
                <p>
                  Hootsuite is one of the oldest tools in the category. It offers broad capabilities for scheduling,
                  collaboration, and analytics.
                </p>
                <p>
                  <strong>Key features:</strong> support for many accounts, built-in content libraries, and advanced reporting.
                </p>
                <p>
                  <strong>Limitations:</strong> pricing can be high for smaller teams, and some users find the interface clunky.
                </p>

                <h3>4. Sprout Social</h3>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-sprout-social-logo.png"
                    alt="Sprout Social logo with leaf icon."
                    className="h-20 w-full object-contain"
                    loading="lazy"
                  />
                </figure>

                <p><strong>Perfect for:</strong> Professionals focused on social listening and analytics.</p>
                <p>
                  Sprout Social is a premium platform with a strong focus on analytics and customer relationship workflows.
                </p>
                <p>
                  <strong>Key features:</strong> social listening, detailed performance reporting, and collaboration workflows.
                </p>
                <p>
                  <strong>Limitations:</strong> higher pricing and more features than many solo users need.
                </p>

                <h3>5. Later</h3>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-later-logo-wide.jpg"
                    alt="Later logo with colorful social symbols."
                    className="h-20 w-full object-contain"
                    loading="lazy"
                  />
                </figure>

                <p><strong>Perfect for:</strong> Visual platforms like Instagram and Pinterest.</p>
                <p>
                  Later specializes in visual planning and scheduling. Many creators and small teams use it for
                  drag-and-drop calendar workflows.
                </p>
                <p>
                  <strong>Key features:</strong> visual planning, hashtag support, and affordable plans.
                </p>
                <p>
                  <strong>Limitations:</strong> less advanced analytics and no built-in social listening.
                </p>

                <h2>Comparison Table of Features</h2>
                <div className="overflow-x-auto">
                  <table>
                    <caption>Feature comparison of top social media management tools</caption>
                    <thead>
                      <tr>
                        <th scope="col">Tool</th>
                        <th scope="col">Ease of Use</th>
                        <th scope="col">Analytics</th>
                        <th scope="col">Content Creation</th>
                        <th scope="col">Pricing</th>
                        <th scope="col">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Buffer</th>
                        <td>High</td>
                        <td>Basic</td>
                        <td>No</td>
                        <td>Free / $15+</td>
                        <td>Beginners, small teams</td>
                      </tr>
                      <tr>
                        <th scope="row">Hootsuite</th>
                        <td>Medium</td>
                        <td>Advanced</td>
                        <td>No</td>
                        <td>$49+ / month</td>
                        <td>Larger teams, agencies</td>
                      </tr>
                      <tr>
                        <th scope="row">Sprout Social</th>
                        <td>Medium</td>
                        <td>Advanced</td>
                        <td>No</td>
                        <td>$89+ / month</td>
                        <td>Analytics-focused professionals</td>
                      </tr>
                      <tr>
                        <th scope="row">Mydrop</th>
                        <td>High</td>
                        <td>Advanced</td>
                        <td>Yes (AI)</td>
                        <td>Free / $39+</td>
                        <td>All-in-one solution seekers</td>
                      </tr>
                      <tr>
                        <th scope="row">Later</th>
                        <td>High</td>
                        <td>Basic</td>
                        <td>No</td>
                        <td>$18+ / month</td>
                        <td>Instagram and Pinterest users</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2>How to Choose the Right Tool</h2>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-smiling-man-with-mobile-phone.png"
                    alt="Professional reviewing social media channels before choosing a management platform."
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                </figure>

                <p>Not sure which tool suits your needs? Start with these questions:</p>

                <h3>How many platforms do I manage?</h3>
                <p>
                  If you focus mainly on Instagram and Pinterest, Later might fit. If you need all-platform coverage,
                  Mydrop or Hootsuite are stronger choices.
                </p>

                <h3>Do I need advanced analytics?</h3>
                <p>
                  Choose Mydrop or Sprout Social if analytics is central to your strategy.
                </p>

                <h3>Am I managing this alone or with a team?</h3>
                <p>
                  Small teams often like Buffer, while larger teams usually need Mydrop or Hootsuite for collaboration.
                </p>

                <h3>Do I need content creation help?</h3>
                <p>
                  Time-strapped marketers should look at Mydrop for built-in AI content generation.
                </p>

                <h2>Start Managing Your Social Media Like a Pro</h2>
                <figure>
                  <img
                    src="/media/images/original-site/legacy-dashboards-design.png"
                    alt="Dashboard with social metrics and calendar insights for social media performance tracking."
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                </figure>

                <p>
                  Social media management tools simplify and improve how you connect with your audience. Whether you
                  are an entrepreneur managing your own presence or part of a growing agency, the right system can
                  save time, reduce stress, and improve results.
                </p>

                <p>
                  Sign up for Mydrop today and experience AI-driven social media management. From automating posts
                  to analyzing performance, Mydrop is built to be the last tool you need.
                </p>

                <p>
                  Your time is valuable. Do not waste it on inefficient workflows. Make the switch.
                </p>

                <p>
                  <Button asChild size="lg">
                    <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                      Start with Mydrop for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </p>
              </>
            )}

            {isSchedulingPost && (
              <>
                <p itemProp="description">
                  Managing social media effectively requires careful planning and consistent posting, but manually
                  publishing posts every day can quickly become overwhelming. Scheduling posts in advance is an
                  essential technique that saves time, ensures consistency, and allows you to focus on strategy
                  instead of daily publication tasks.
                </p>

                <p>
                  Here is a step-by-step guide to scheduling posts on social media, and how to simplify the process
                  using Mydrop AI, an innovative social media management tool.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-content-calendar-full-of-content.png"
                    alt="A social content calendar"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>A social content calendar</figcaption>
                </figure>

                <h2>Benefits of Scheduling Social Media Posts</h2>

                <p>
                  Before we get started, here are a few reasons why scheduling your posts is a game-changer:
                </p>

                <ul>
                  <li><strong>Time-saving:</strong> Plan days, weeks, or even months of content in one session.</li>
                  <li><strong>Consistency:</strong> Maintain a steady posting schedule that aligns with peak engagement times.</li>
                  <li><strong>Improved strategy:</strong> Focus on analyzing metrics and designing better campaigns.</li>
                  <li><strong>Multi-platform boosts:</strong> Coordinate posting across platforms without duplicating effort.</li>
                </ul>

                <p>
                  By scheduling your posts, you set up your channels for consistent engagement and leave room to
                  focus on content quality.
                </p>

                <h2>Step-by-Step Guide to Scheduling Posts</h2>

                <p>Here is how you can schedule social media posts efficiently.</p>

                <h3>1. Choose a Scheduling Tool</h3>
                <p>
                  To make the process effortless, you need a reliable scheduling tool. Enter Mydrop AI, a robust
                  platform designed to simplify social media management with cross-posting, media editing, and
                  AI-powered automation. It works across 14 social platforms and is free to start.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-effortless-dashboard2.webp"
                    alt="Effortless social management tool"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>Effortless social management tool</figcaption>
                </figure>

                <h3>2. Plan Your Content Calendar</h3>
                <p>Before scheduling, map out your content calendar:</p>

                <ul>
                  <li>Define your objectives, such as brand awareness, product promotion, or community engagement.</li>
                  <li>Choose which platforms to post on, such as Instagram, LinkedIn, and X.</li>
                  <li>Identify optimal posting times for your audience on each platform.</li>
                </ul>

                <p>
                  Mydrop AI makes this part smooth. With automations, you can pre-plan personalized posts optimized
                  for different social media platforms.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-content-calendar-planner-design-for-blog-banner.png"
                    alt="Full content calendar"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>Full content calendar</figcaption>
                </figure>

                <h3>3. Use Mydrop AI to Schedule Posts</h3>
                <p>Here is how to use Mydrop AI scheduling effectively:</p>

                <p>
                  <strong>Step 1:</strong> Log into your Mydrop AI account and connect your social media platforms.
                </p>
                <p>
                  <strong>Step 2:</strong> Choose the Scheduling feature from the dashboard to queue content for days,
                  weeks, or months in advance.
                </p>
                <p>
                  <strong>Step 3:</strong> Upload your photos, videos, and captions. Mydrop AI can also generate text
                  and images if you need help with ideation.
                </p>
                <p>
                  <strong>Step 4:</strong> Set the date and time for each post and customize timing by platform based
                  on peak engagement windows.
                </p>

                <p>
                  With a few clicks, your content is scheduled and ready to go live automatically.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-cross-posting.webp"
                    alt="Cross-post and schedule everywhere"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>Cross-post and schedule everywhere</figcaption>
                </figure>

                <h3>4. Preview and Adjust</h3>
                <p>
                  Use Mydrop AI calendar view to review your schedule before publishing. You get a visual breakdown
                  of upcoming posts across platforms, so you can adjust timing or swap content when needed.
                </p>

                <h2>Why Use Mydrop AI for Scheduling?</h2>

                <p>
                  Mydrop AI is more than a basic scheduling tool. Its intelligent features remove friction from
                  content operations:
                </p>

                <ul>
                  <li><strong>Scheduling:</strong> Automate your calendar and schedule months of content quickly.</li>
                  <li><strong>Cross-Posting:</strong> Duplicate posts across platforms with one click.</li>
                  <li><strong>AI Content Generation:</strong> Generate tailored text and visuals from simple prompts.</li>
                  <li><strong>Media Editing Tools:</strong> Build polished, on-brand media with the built-in editor.</li>
                  <li><strong>Collaboration Tools:</strong> Manage team members with customizable permissions.</li>
                </ul>

                <p>
                  These features make Mydrop AI the go-to choice for busy professionals managing multiple channels.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-mydrop-dashboard.webp"
                    alt="Social media dashboard"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>Social media dashboard</figcaption>
                </figure>

                <h2>Start Scheduling Today</h2>

                <p>
                  Scheduling social media posts does not have to be stressful. By following the steps above, you can
                  streamline your workflow, improve engagement, and focus on building a stronger presence online.
                </p>

                <p>
                  Interested in taking the first step? Start using Mydrop AI for free today and experience effortless
                  social media scheduling.
                </p>

                <figure>
                  <img
                    src="/media/images/original-site/legacy-smiling-woman-looking-at-phone.png"
                    alt="Smiling woman"
                    className="h-[220px] w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                  <figcaption>Smiling woman</figcaption>
                </figure>

                <p>
                  <Button asChild size="lg">
                    <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
                      Start using Mydrop AI for free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </p>
              </>
            )}

            {!isSocialToolsPost && !isSchedulingPost && (
              <>
                <p itemProp="description">{post.description}</p>
                {post.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
