import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
  organizationSchema,
  SITE_URL,
} from "@/lib/seo";
import { getBlogPostBySlug, getRelatedBlogPosts, type BlogCta } from "@/lib/blog";
import { resolveAssetPath } from "@/lib/paths";
import { Button } from "@/components/ui/button";
import NotFoundPage from "@/pages/NotFoundPage";

const BLOG_PUBLISHER = {
  "@type": "Organization",
  name: "MydropAI",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(dateValue: string) {
  return dateFormatter.format(new Date(dateValue));
}

function AuthorBio({
  name,
  role,
  slug,
  bio,
  image,
}: {
  name: string;
  role: string;
  slug: string;
  bio?: string;
  image: string;
}) {
  const resolvedBio =
    bio ||
    `${name} is part of the Mydrop editorial team, focused on practical social media systems, content operations, and AI-assisted marketing workflows.`;

  return (
    <section className="mt-10 rounded-[1.4rem] border border-white/12 bg-white/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={resolveAssetPath(image)}
          alt={name}
          className="h-20 w-20 rounded-3xl border border-white/15 object-cover shadow-[0_16px_36px_rgba(2,6,23,0.28)]"
          loading="lazy"
        />
        <div>
          <p className="section-kicker !mb-2">About the author</p>
          <h2 className="!mt-0 text-2xl">{name}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.12em] text-slate-400">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-slate-200">{resolvedBio}</p>
      <p className="mt-4">
        <Link to={`/authors/${slug}`} className="text-sm font-medium text-sky-300 transition hover:text-white">
          View all articles by {name}
        </Link>
      </p>
    </section>
  );
}

function CtaButton({
  cta,
  variant,
}: {
  cta: BlogCta;
  variant?: "default" | "outline";
}) {
  const isInternal = cta.href.startsWith("/");

  if (isInternal) {
    return (
      <Button asChild size="lg" variant={variant}>
        <Link to={cta.href}>
          {cta.label}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant}>
      <a href={cta.href} target="_blank" rel="noreferrer">
        {cta.label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </Button>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug ?? "");

  if (!post) {
    return <NotFoundPage />;
  }

  const canonicalPath = post.canonicalPath;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const relatedPosts = getRelatedBlogPosts(post, 3);

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
      name: post.author.name,
      description: post.author.role,
      image: `${SITE_URL}${post.author.image}`,
      url: `${SITE_URL}/authors/${post.author.slug}`,
    },
    publisher: BLOG_PUBLISHER,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
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
    ...(post.faq.length > 0 ? [buildFaqSchema(post.faq)] : []),
  ];

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        canonicalUrl={canonicalPath}
        image={post.heroImage}
        imageAlt={post.heroImageAlt}
        ogType="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        structuredData={structuredData}
        author={post.author.name}
        keywords={post.tags}
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="section-kicker !mb-0">{post.category}</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 itemProp="headline">{post.title}</h1>
              <p className="max-w-3xl text-lg text-slate-300">{post.description}</p>

              <p className="blog-meta-row">
                <Link to={`/authors/${post.author.slug}`} className="blog-meta-author transition hover:text-white">
                  <img
                    src={resolveAssetPath(post.author.image)}
                    alt={post.author.name}
                    className="blog-meta-author__image"
                    loading="lazy"
                  />
                  <span>{post.author.name}</span>
                </Link>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {post.readTimeLabel}
                </span>
              </p>

              <p className="blog-meta-update" itemProp="dateModified" content={post.updatedAt}>
                Updated: {formatDate(post.updatedAt)}
              </p>
            </header>

            <figure className="blog-hero">
              <img
                src={resolveAssetPath(post.heroImage)}
                alt={post.heroImageAlt}
                className="h-[210px] w-full object-cover md:h-[360px]"
                loading="eager"
                itemProp="image"
              />
              {post.heroCaption && <figcaption>{post.heroCaption}</figcaption>}
            </figure>

            <div itemProp="articleBody" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faq.length > 0 && (
              <section className="mt-10 rounded-[1.4rem] border border-white/12 bg-white/5 p-5">
                <p className="section-kicker !mb-2">FAQ</p>
                <h2 className="!mt-0 text-2xl">Common questions</h2>
                <div className="mt-6 space-y-4">
                  {post.faq.map((item) => (
                    <div key={item.question} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <h3 className="!mt-0 text-lg">{item.question}</h3>
                      <p className="mt-2 text-slate-200">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {post.sources.length > 0 && (
              <section className="mt-10 rounded-[1.4rem] border border-white/12 bg-white/5 p-5">
                <p className="section-kicker !mb-2">Sources</p>
                <h2 className="!mt-0 text-2xl">References</h2>
                <ul className="mt-5 space-y-3 pl-5">
                  {post.sources.map((source) => (
                    <li key={`${source.title}-${source.url}`}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                      {source.publisher ? `, ${source.publisher}` : ""}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-10 rounded-[1.4rem] border border-white/12 bg-[linear-gradient(160deg,rgba(40,52,96,0.34),rgba(11,14,27,0.8))] p-6">
              <p className="section-kicker !mb-2">Next step</p>
              <h2 className="!mt-0 text-2xl">Turn the strategy into execution</h2>
              <p className="mt-4 text-slate-200">
                Mydrop helps teams turn strategy, content creation, publishing, and optimization into one
                repeatable workflow.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CtaButton cta={post.primaryCta} />
                <CtaButton cta={post.secondaryCta} variant="outline" />
              </div>
            </section>

            <AuthorBio
              name={post.author.name}
              role={post.author.role}
              slug={post.author.slug}
              bio={post.author.bio}
              image={post.author.image}
            />

            {relatedPosts.length > 0 && (
              <section className="mt-10 rounded-[1.4rem] border border-white/12 bg-white/5 p-5">
                <p className="section-kicker !mb-2">Keep reading</p>
                <h2 className="!mt-0 text-2xl">Related posts</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <article key={relatedPost.slug} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {relatedPost.category}
                      </p>
                      <h3 className="mt-3 text-lg text-white">{relatedPost.title}</h3>
                      <p className="mt-3 text-sm text-slate-300">{relatedPost.description}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        {formatDate(relatedPost.publishedAt)} · {relatedPost.readTimeLabel}
                      </p>
                      <p className="mt-4">
                        <Link
                          to={relatedPost.canonicalPath}
                          className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-white"
                        >
                          Read article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
