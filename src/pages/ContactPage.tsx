import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function ContactPage() {
  const description =
    "Contact MydropAI for sales, partnerships, and support questions related to our AI social media platform.";

  const structuredData = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "MydropAI Contact",
      description,
      url: "https://www.mydropai.com/contact",
    },
    buildWebPageSchema("MydropAI Contact", "/contact", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Contact"
        description={description}
        canonicalUrl="/contact"
        structuredData={structuredData}
      />
      <PageScaffold
        title="Contact"
        description="Contact page scaffold is ready for your form copy, trust points, and support channels."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="mailto:contact@mydropai.com">Email Us</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
              Create Account
            </a>
          </Button>
        </div>
      </PageScaffold>
    </>
  );
}
