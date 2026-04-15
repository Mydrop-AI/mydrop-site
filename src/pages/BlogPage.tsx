import SEO from "@/components/SEO";
import { blogPosts } from "@/lib/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function BlogPage() {
  const description =
    "Read actionable social media and AI marketing insights from MydropAI to help your team produce better content and stronger results.";

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
            <h1 className="section-title">Get actionable insights for social media and AI marketing</h1>
          </div>

          <section className="blog-card-grid" aria-label="All blog posts">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </section>
        </div>
      </section>
    </>
  );
}
