import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import PageScaffold from "@/components/layout/PageScaffold";
import { buildWebPageSchema, organizationSchema } from "@/lib/seo";

export default function NotFoundPage() {
  const description = "The page you are looking for could not be found.";

  const structuredData = [
    organizationSchema,
    buildWebPageSchema("MydropAI 404", "/404", description),
  ];

  return (
    <>
      <SEO
        title="404 Page Not Found"
        description={description}
        canonicalUrl="/404"
        noIndex
        structuredData={structuredData}
      />
      <PageScaffold
        title="Page Not Found"
        description="This route does not exist yet. Use the main navigation to continue browsing."
      >
        <Link className="text-fuchsia-300 hover:text-fuchsia-200" to="/">
          Return to homepage
        </Link>
      </PageScaffold>
    </>
  );
}
