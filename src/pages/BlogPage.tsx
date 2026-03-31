import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blogPosts";
import { resolveAssetPath } from "@/lib/paths";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(dateValue: string) {
  return dateFormatter.format(new Date(dateValue));
}

export default function BlogPage() {
  const description =
    "Read actionable social media and AI marketing insights from MydropAI to help your team produce better content and stronger results.";

  const featuredPost = blogPosts[0];
  const secondaryPosts = blogPosts.slice(1);

  const structuredData = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "MydropAI Blog",
      description,
      url: "https://www.mydropai.com/blog",
    },
    buildWebPageSchema("MydropAI Blog", "/blog", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Blog"
        description={description}
        canonicalUrl="/blog"
        structuredData={structuredData}
      />

      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact gap-8">
          <div className="text-center">
            <p className="section-kicker">Mydrop Blog</p>
            <h1 className="section-title">Playbooks for faster social media execution</h1>
            <p className="section-copy mx-auto mt-4">
              Actionable guides for overloaded social managers who need to post better content in less time.
            </p>
          </div>

          {featuredPost && (
            <article className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-[linear-gradient(165deg,rgba(29,34,57,0.84),rgba(11,13,25,0.95))] shadow-[0_20px_58px_rgba(4,7,15,0.45)]">
              <img
                src={resolveAssetPath(featuredPost.heroImage)}
                alt={featuredPost.heroImageAlt}
                className="h-[220px] w-full object-cover md:h-[350px]"
                loading="lazy"
              />

              <div className="space-y-5 p-5 md:p-7">
                <p className="section-kicker">Featured post</p>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="max-w-3xl text-slate-200">{featuredPost.description}</p>

                <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-slate-100">
                    <User2 className="h-3.5 w-3.5" />
                    {featuredPost.author}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-slate-100">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-slate-100">
                    <Clock3 className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link to={`/post/${featuredPost.slug}`}>
                      Read full article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          )}

          {secondaryPosts.length > 0 && (
            <section className="grid gap-4 md:grid-cols-2">
              {secondaryPosts.map((post) => (
                <article
                  key={post.slug}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  <img
                    src={resolveAssetPath(post.heroImage)}
                    alt={post.heroImageAlt}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-3 p-4">
                    <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                    <p className="text-sm text-slate-300">{post.description}</p>
                    <p className="text-xs text-slate-400">
                      {post.author} · {formatDate(post.publishedAt)}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/post/${post.slug}`}>
                        Read post
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>
    </>
  );
}
