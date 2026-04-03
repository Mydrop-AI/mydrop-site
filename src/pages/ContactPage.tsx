import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  buildBreadcrumbSchema,
  buildWebPageSchema,
  organizationSchema,
} from "@/lib/seo";

export default function ContactPage() {
  const description =
    "Contact MydropAI for sales, partnerships, and support questions about running brands, profiles, and social workflows with Mydrop.";

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
      <main className="flex min-h-[70vh] items-center justify-center bg-transparent px-4 py-20">
        <div className="mx-auto w-full max-w-xl text-center">
          <h2 className="text-4xl font-bold text-white">Get in touch</h2>
          <p className="mt-4 text-lg text-slate-300">
            Reach out about your setup, your team, or the brands and profiles you manage. We reply the same business day.
          </p>
          <Button asChild className="mt-8">
            <a href="mailto:contact@mydropai.com">Email contact@mydropai.com</a>
          </Button>
        </div>
      </main>
    </>
  );
}
