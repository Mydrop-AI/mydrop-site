import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
  organizationSchema,
  SITE_URL,
} from "@/lib/seo";
import { getRelatedBlogPosts, loadBlogPostBySlug, type BlogCta, type BlogPost } from "@/lib/blog";
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

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildArticleContentModel(rawHtml: string) {
  if (typeof window === "undefined") {
    return {
      html: rawHtml,
      tocItems: [] as TocItem[],
    };
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = rawHtml;

  const tocItems: TocItem[] = [];
  const idCounts = new Map<string, number>();
  const headings = wrapper.querySelectorAll("h2, h3");

  headings.forEach((heading) => {
    const text = heading.textContent?.trim() || "";
    if (!text) {
      return;
    }

    const level = heading.tagName === "H3" ? 3 : 2;
    const baseId = slugifyHeading(text) || `section-${tocItems.length + 1}`;
    const seen = idCounts.get(baseId) ?? 0;
    idCounts.set(baseId, seen + 1);
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;

    heading.id = id;
    heading.setAttribute("data-toc-heading", "true");
    tocItems.push({
      id,
      text,
      level,
    });
  });

  return {
    html: wrapper.innerHTML,
    tocItems,
  };
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
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    let isActive = true;

    if (!slug) {
      setPost(null);
      return undefined;
    }

    setPost(undefined);
    void loadBlogPostBySlug(slug)
      .then((loadedPost) => {
        if (isActive) {
          setPost(loadedPost);
        }
      })
      .catch(() => {
        if (isActive) {
          setPost(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (post === undefined) {
    return (
      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact">
          <p className="section-kicker">Loading article</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return <NotFoundPage />;
  }

  return <BlogPostContent post={post} />;
}

function BlogPostContent({ post }: { post: BlogPost }) {
  const canonicalPath = post.canonicalPath;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const relatedPosts = getRelatedBlogPosts(post, 3);
  const articleContent = buildArticleContentModel(post.html);
  const tocItems = articleContent.tocItems;

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

  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [post.slug]);

  useEffect(() => {
    const progressBar = document.querySelector<HTMLElement>("[data-blog-progress-bar]");
    const tocLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-blog-toc-link]"),
    );

    const updateReadingState = () => {
      const article = document.querySelector("[data-blog-article]") as HTMLElement | null;
      if (!article) {
        if (progressBar) {
          progressBar.style.transform = "scaleX(0)";
        }
        for (const link of tocLinks) {
          link.classList.remove("is-active");
        }
        return;
      }

      const viewportHeight = window.innerHeight;
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const maxScrollable = Math.max(articleHeight - viewportHeight, 1);
      const progress = Math.min(
        Math.max((window.scrollY - articleTop + 120) / maxScrollable, 0),
        1,
      );
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }

      const headingElements = Array.from(
        article.querySelectorAll<HTMLElement>("[data-toc-heading='true']"),
      );
      let currentId = headingElements[0]?.id || "";

      for (const heading of headingElements) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 160) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      for (const link of tocLinks) {
        const isActive = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("is-active", isActive);
      }
    };

    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);

    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [post.slug, articleContent.html]);

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
        <div className="blog-reading-progress" aria-hidden="true">
          <div className="blog-reading-progress__bar" data-blog-progress-bar />
        </div>
        <div className="site-container blog-post-shell py-10 md:py-14">
          <div className="blog-post-layout">
            <aside className="blog-post-rail blog-post-rail--toc">
              {tocItems.length > 0 && (
                <nav className="blog-toc-card" aria-label="Table of contents">
                  <p className="section-kicker !mb-2">Navigate</p>
                  <h2 className="blog-toc-card__title">Table of contents</h2>
                  <ul className="blog-toc-list">
                    {tocItems.map((item) => (
                      <li key={item.id} className={`blog-toc-list__item blog-toc-list__item--level-${item.level}`}>
                        <a
                          href={`#${item.id}`}
                          data-blog-toc-link
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </aside>

            <article
              className="blog-post-main blog-prose"
              itemScope
              itemType="https://schema.org/BlogPosting"
              data-blog-article
            >
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
                      alt=""
                      aria-hidden="true"
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
                  alt={post.heroImageAlt || post.title}
                  className="h-[210px] w-full object-cover md:h-[360px]"
                  loading="eager"
                  itemProp="image"
                />
                {post.heroCaption && <figcaption>{post.heroCaption}</figcaption>}
              </figure>

              <div
                itemProp="articleBody"
                className="blog-article-body"
                dangerouslySetInnerHTML={{ __html: articleContent.html }}
              />

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

            <aside className="blog-post-rail blog-post-rail--cta">
              <div className="blog-sticky-cta">
                <p className="section-kicker !mb-2">Mydrop</p>
                <h2 className="blog-sticky-cta__title">Save time and publish with less chaos</h2>
                <p className="blog-sticky-cta__copy">
                  Plan, review, schedule, and improve your social media workflow in one place.
                </p>
                <a
                  href="https://app.mydropai.com/register"
                  target="_blank"
                  rel="noreferrer"
                  className="blog-sticky-cta__button"
                >
                  Start for free
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
