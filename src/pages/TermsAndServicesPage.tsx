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
        description="These terms govern your use of the service, payments, content policies, and the legal rights and responsibilities between you and the platform."
      >
        <article className="mx-auto mt-12 mb-20 max-w-4xl space-y-8 text-slate-200">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
            <p>
              This agreement sets the rules for use of the platform and related services. By creating an account, logging in, using features, or
              accessing documentation, you agree to the terms described here and any updates published from time to time.
            </p>
            <p>
              The platform is operated by ADB International LLC, a United States limited liability company. “Mydrop” and “Mydrop AI” are service names
              used by ADB International LLC. References to “we”, “us”, and “our” in these terms refer to ADB International LLC.
            </p>
            <p>
              These terms are between you ("User") and the service provider. If you accept on behalf of a company or organization, you confirm you have
              authority to bind that entity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Acceptance and Updates</h2>
            <p>
              The platform may modify these terms at any time. We will publish the updated terms and notify users where required by law. Continued use after
              the effective date constitutes acceptance of the revised terms.
            </p>
            <p>
              You should review this page regularly to remain aware of changes. We may also provide email notices for material changes that affect your rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. Services Covered</h2>
            <p>
              The terms cover all services delivered via the website and any integrated interfaces, including account management, content creation tools,
              interaction with third-party integrations, scheduling capabilities, and any premium or paid features.
            </p>
            <h3 className="text-xl font-medium text-white">3.1 Availability</h3>
            <p>
              Services are provided on an as-available basis. We may suspend access for maintenance, security, or compliance reasons. We are not responsible for
              interruptions due to third-party outages or circumstances outside our control.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Eligibility</h2>
            <p>
              You must be of legal age in your country and have authority to enter into a contract. Minors are not permitted to use the platform without explicit
              consent from a parent or guardian where required.
            </p>
            <p>
              Users are responsible for maintaining accurate account information and ensuring account credentials are secure. You must not share access with
              unauthorized persons.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Account Responsibilities</h2>
            <p>
              You are solely responsible for activity on your account. Protect your login and notify us immediately of suspected unauthorized access. We may
              disable accounts for suspicious or abusive behavior.
            </p>
            <p>
              Account owners are responsible for compliance with all applicable laws and for ensuring use of the platform aligns with this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Billing, Fees, and Payment</h2>
            <p>
              Paid services are billed according to the chosen plan and any applicable taxes. You authorize the platform to charge the payment method on file
              for recurring subscriptions and any additional usage fees.
            </p>
            <p>
              We reserve the right to change fees with prior notice. Users may cancel subscriptions according to the cancellation policy in the pricing
              terms and continue to access paid features until the end of the current billing cycle.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">7. Content Use and License</h2>
            <p>
              Users retain ownership of their own content. By using the service you grant us a license to use, display, and process your content as necessary to
              provide and improve the service, including backup and recovery.
            </p>
            <p>
              You are responsible for content accuracy, legality, and rights of use. Prohibited content includes anything unlawful, infringing, offensive, or that
              violates the rights of others.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">8. Acceptable Use and Prohibited Conduct</h2>
            <p>
              Users must not use the platform for spam, harassment, fraud, or any activity that breaches applicable laws or the rights of third parties.
              You must not interfere with the service operation or access anyone else’s account without authorization.
            </p>
            <ul className="list-disc pl-5 text-slate-200">
              <li>Unauthorized access or account sharing</li>
              <li>Uploading harmful or infringing material</li>
              <li>Attempting to reverse-engineer, scrape, or exploit the service</li>
              <li>Using the service to violate privacy rights or data protection laws</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">9. Third-Party Integrations</h2>
            <p>
              The service may provide integration with third-party products or services. Use of any integrated service is subject to the third party’s terms.
              We do not control third-party practices and are not liable for their services.
            </p>
            <p>
              You should review each integration’s privacy and security terms before enabling it in your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">10. Data Practices and Privacy</h2>
            <p>
              Our Privacy Policy describes how we collect, process, and store personal data. It explains user rights, retention, and safeguards. These Terms are
              in addition to, and do not replace, the Privacy Policy.
            </p>
            <p>
              Users are responsible for complying with data privacy obligations related to content they upload, including obtaining necessary consents for any
              personal data they process through the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">11. Termination and Suspension</h2>
            <p>
              Either party may terminate the agreement by following the account closure process. We may suspend or terminate access for breach of these terms
              or for legal reasons.
            </p>
            <p>
              Upon termination, access to the platform ends, and retained data will be handled according to the data retention and deletion practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">12. Disclaimers and Limitations of Liability</h2>
            <p>
              The service is provided “as is” without warranties of any kind. We disclaim all express or implied warranties to the fullest extent permitted by law.
            </p>
            <p>
              Our liability is limited to direct damages up to the amount you paid in the previous 12 months, and we are not liable for indirect, incidental, or
              consequential loss.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold the service and its related entities harmless from claims arising from your use of the platform, your content, or
              violation of these terms or applicable laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">14. Governing Law and Dispute Resolution</h2>
            <p>
              These terms are governed by applicable law in the jurisdiction where the service is established. Disputes should be resolved through good-faith
              negotiations and, if needed, in the appropriate courts or through arbitration as provided in the terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">15. Intellectual Property</h2>
            <p>
              All platform intellectual property, including branding, software, and content not submitted by users, is owned by the service provider or its
              licensors. Users may not copy or republish proprietary materials without permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">16. Feedback</h2>
            <p>
              Any suggestions or feedback submitted by users may be used by the service solely at our discretion without obligation or compensation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">17. Contact and Updates</h2>
            <p>
              Questions about these terms may be directed to the contact details in the Privacy Policy. We will update this page with the effective date of
              any material change.
            </p>
            <p>
              Effective date: April 1, 2026. Last updated: April 1, 2026.
            </p>
          </section>
        </article>
      </PageScaffold>
    </>
  );
}
