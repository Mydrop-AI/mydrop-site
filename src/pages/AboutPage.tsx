import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function AboutPage() {
  const description =
    "Learn about MydropAI, our mission, and how we help teams produce social media content faster with AI.";

  const structuredData = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About MydropAI",
      description,
      url: "https://www.mydropai.com/about",
    },
    buildWebPageSchema("About MydropAI", "/about", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ];

  return (
    <>
      <SEO
        title="About"
        description={description}
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      <PageScaffold
        title="About"
        description="About page skeleton is ready for your story, mission, credibility proof, and team sections."
      />
    </>
  );
}
