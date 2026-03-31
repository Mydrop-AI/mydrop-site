import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function PartnershipsPage() {
  const description =
    "Partner with MydropAI to deliver stronger social media outcomes through AI-powered publishing and operations.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("MydropAI Partnerships", "/partnerships", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Partnerships", path: "/partnerships" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Partnerships"
        description={description}
        canonicalUrl="/partnerships"
        structuredData={structuredData}
      />
      <PageScaffold
        title="Partnerships"
        description="Partnership page framework is in place and ready for your partner types, collaboration models, and call-to-action flow."
      >
        <Button asChild variant="outline">
          <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
            Become a Partner
          </a>
        </Button>
      </PageScaffold>
    </>
  );
}
