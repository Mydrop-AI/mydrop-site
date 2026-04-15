import { Link, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBlogAuthorBySlug } from "@/lib/blog";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
  SITE_URL,
} from "@/lib/seo";
import { resolveAssetPath } from "@/lib/paths";
import NotFoundPage from "@/pages/NotFoundPage";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(dateValue: string) {
  return dateFormatter.format(new Date(dateValue));
}

export default function AuthorPage() {
  const { slug } = useParams();
  const author = getBlogAuthorBySlug(slug ?? "");

  if (!author) {
    return <NotFoundPage />;
  }

  const canonicalPath = `/authors/${author.slug}`;
  const structuredData = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.name,
      description: author.bio,
      jobTitle: author.role,
      url: `${SITE_URL}${canonicalPath}`,
    },
    buildWebPageSchema(`${author.name} Articles`, canonicalPath, author.bio),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: author.name, path: canonicalPath },
    ]),
  ];

  return (
    <>
      <SEO
        title={`${author.name} Articles`}
        description={author.bio}
        canonicalUrl={canonicalPath}
        structuredData={structuredData}
        author={author.name}
      />

      <section className="section-shell section-shell--deep">
        <div className="site-container section-content section-content--compact gap-8">
          <div className="mx-auto max-w-3xl">
            <p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </p>

            <div className="mt-5 rounded-[1.5rem] border border-white/15 bg-[linear-gradient(165deg,rgba(29,34,57,0.84),rgba(11,13,25,0.95))] p-6 shadow-[0_20px_58px_rgba(4,7,15,0.45)]">
              <p className="section-kicker !mb-2">Author</p>
              <h1 className="section-title !text-left !text-white">{author.name}</h1>
              <p className="mt-3 text-sm uppercase tracking-[0.12em] text-slate-400">{author.role}</p>
              <p className="mt-5 max-w-2xl text-slate-200">{author.bio}</p>
            </div>
          </div>

          <section className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
            {author.posts.map((post) => (
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
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {post.category}
                  </p>
                  <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                  <p className="text-sm text-slate-300">{post.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {post.readTimeLabel}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={post.canonicalPath}>
                      Read article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
    </>
  );
}
