import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function PrivacyPolicyPage() {
  const description =
    "Review the MydropAI privacy policy to understand how we collect, process, and protect your data.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("MydropAI Privacy Policy", "/privacy-policy", description),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ]),
  ];

  return (
    <>
      <SEO
        title="Privacy Policy"
        description={description}
        canonicalUrl="/privacy-policy"
        structuredData={structuredData}
      />
      <PageScaffold
        title="Privacy Policy"
        description="Legal page structure is ready. We can now migrate your exact legal text from the current site in the next step."
      />
    </>
  );
}
