import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function TermsAndServicesPage() {
  const description =
    "Read MydropAI terms and services, including platform usage rules, billing terms, and legal responsibilities.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema(
      "MydropAI Terms and Services",
      "/terms-and-services",
      description
    ),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Terms and Services", path: "/terms-and-services" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Terms and Services"
        description={description}
        canonicalUrl="/terms-and-services"
        structuredData={structuredData}
      />
      <PageScaffold
        title="Terms and Services"
        description="Terms page structure is ready. We can copy and improve your current legal content while preserving intent and compliance."
      />
    </>
  );
}
