import type { Metadata } from "next";
import { BRAND_NAME, CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for the Éclat website and venue partnership services.",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <article className="bg-bone pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-10 p-4 border border-amber-300 bg-amber-50 rounded-sm">
          <p className="font-sans text-sm text-amber-800">
            <strong>Draft for legal review.</strong> These Terms & Conditions are
            a placeholder template. They must be reviewed and approved by a
            qualified solicitor before being published on a live site.{" "}
            <strong>Do not rely on them for legal compliance.</strong>
          </p>
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl text-ink mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="font-sans text-sm text-stone mb-12">
          Last updated: [PLACEHOLDER: date]. Effective from: [PLACEHOLDER: date].
        </p>

        <div className="prose prose-sm max-w-none font-sans text-stone leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">1. Introduction</h2>
            <p>
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the
              website at [PLACEHOLDER: domain] (&ldquo;the Site&rdquo;) operated by{" "}
              {BRAND_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), registered in England and Wales under
              company number [PLACEHOLDER: company number].
            </p>
            <p>
              By accessing or using the Site, you agree to be bound by these Terms.
              If you do not agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">2. Use of the Site</h2>
            <p>
              The Site is intended for business-to-business enquiries relating to
              venue partnership arrangements. It is not a consumer-facing retail
              platform and is not intended to be used by individuals under the age
              of 18.
            </p>
            <p>
              You agree not to use the Site in any way that is unlawful, harmful,
              or in breach of these Terms, and not to attempt to gain unauthorised
              access to any part of the Site or its underlying systems.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">3. Intellectual Property</h2>
            <p>
              All content on this Site — including text, images, logos, and design —
              is the intellectual property of {BRAND_NAME} or its licensors and is
              protected by applicable copyright and trade mark laws. You may not
              reproduce, distribute, or create derivative works without our prior
              written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">4. Disclaimers</h2>
            <p>
              The Site is provided &ldquo;as is&rdquo; without any representations or
              warranties, express or implied. We do not warrant that the Site will
              be uninterrupted, error-free, or free of viruses or other harmful
              components.
            </p>
            <p>
              Information on the Site, including pricing and availability, is
              indicative only and subject to change without notice. Nothing on the
              Site constitutes a binding offer.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              5. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, {BRAND_NAME} shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or in connection with your use of the
              Site. Our total liability to you shall not exceed [PLACEHOLDER:
              £X].
            </p>
            <p>
              Nothing in these Terms excludes or limits liability for death or
              personal injury caused by negligence, fraud or fraudulent
              misrepresentation, or any other liability that cannot lawfully be
              excluded.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">6. Privacy</h2>
            <p>
              Your use of the Site is also governed by our{" "}
              <a
                href="/privacy"
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                Privacy Policy
              </a>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              7. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any
              dispute arising under or in connection with these Terms shall be
              subject to the exclusive jurisdiction of the courts of England and
              Wales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">8. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
