import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  image?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>[];
}

export default function SEO({
  title,
  description,
  canonicalUrl,
  image,
  noIndex = false,
  structuredData = [],
}: SEOProps) {
  const canonical = canonicalUrl.startsWith("http")
    ? canonicalUrl
    : `${SITE_URL}${canonicalUrl}`;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_OG_IMAGE;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {structuredData.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
