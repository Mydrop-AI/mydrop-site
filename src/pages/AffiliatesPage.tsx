import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function AffiliatesPage() {
  const description =
    "Join the MydropAI affiliates program and earn recurring commissions by sharing our AI social media platform.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("MydropAI Affiliates", "/affiliates", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Affiliates", path: "/affiliates" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Affiliates"
        description={description}
        canonicalUrl="/affiliates"
        structuredData={structuredData}
      />
      <PageScaffold
        title="Affiliates"
        description="Affiliate page foundation is ready for your exact offer details, commission structure, and proof sections."
      >
        <Button asChild>
          <a href="https://app.mydropai.com/register" target="_blank" rel="noreferrer">
            Apply to Affiliate Program
          </a>
        </Button>
      </PageScaffold>
    </>
  );
}
