import type { Metadata } from "next";
import { BRAND_NAME, CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Éclat collects, uses, and protects your personal data under UK GDPR.",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <article className="bg-bone pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-10 p-4 border border-amber-300 bg-amber-50 rounded-sm">
          <p className="font-sans text-sm text-amber-800">
            <strong>Draft for legal review.</strong> This Privacy Policy is a
            UK GDPR-oriented template. It must be reviewed and approved by a
            qualified data protection adviser or solicitor before being
            published.{" "}
            <strong>Do not rely on it for legal compliance.</strong>
          </p>
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl text-ink mb-2">
          Privacy Policy
        </h1>
        <p className="font-sans text-sm text-stone mb-12">
          Last updated: [PLACEHOLDER: date]. Effective from: [PLACEHOLDER: date].
        </p>

        <div className="font-sans text-stone leading-relaxed space-y-8">
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              1. Who we are
            </h2>
            <p>
              {BRAND_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller for
              personal data collected through this website. We are registered in
              England and Wales under company number [PLACEHOLDER: company
              number], with our registered office at [PLACEHOLDER: address].
            </p>
            <p className="mt-3">
              You can contact us about data protection matters at:{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                {CONTACT.email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              2. What data we collect and why
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg text-ink mb-2">
                  Contact form submissions
                </h3>
                <p>
                  When you complete the venue enquiry form, we collect your name,
                  email address, phone number (optional), venue name, venue type,
                  and message. We use this data to respond to your enquiry and
                  follow up on potential partnership discussions.
                </p>
                <p className="mt-2">
                  <strong>Legal basis:</strong> Legitimate interests (Article
                  6(1)(f) UK GDPR) — responding to a business enquiry initiated
                  by you; or performance of pre-contractual steps (Article
                  6(1)(b)) where you are enquiring on behalf of your own business.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink mb-2">
                  Cookies and analytics
                </h3>
                <p>
                  We use essential cookies that are strictly necessary for the
                  site to function. With your consent, we also set analytics
                  cookies to understand how visitors use the site. See our{" "}
                  <a href="#cookies" className="text-accent underline underline-offset-2 hover:text-accent-deep">
                    Cookie section
                  </a>{" "}
                  below.
                </p>
                <p className="mt-2">
                  <strong>Legal basis:</strong> Consent (Article 6(1)(a) UK GDPR)
                  for non-essential analytics cookies; legitimate interests for
                  essential cookies required for site operation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              3. How we share your data
            </h2>
            <p>
              We do not sell your personal data. We may share it with:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2">
              <li>
                <strong>Email service providers</strong> (we use Resend to
                deliver contact form submissions to our team). These act as data
                processors under a data processing agreement.
              </li>
              <li>
                <strong>Analytics providers</strong> (if you consent to analytics
                cookies) — [PLACEHOLDER: e.g. Google Analytics / Plausible].
              </li>
              <li>
                <strong>Professional advisers</strong> such as solicitors,
                accountants, or insurers where necessary.
              </li>
              <li>
                <strong>Regulatory bodies or law enforcement</strong> where we
                are legally required to do so.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              4. How long we keep your data
            </h2>
            <p>
              Contact form submissions are retained for [PLACEHOLDER: e.g. 2
              years] from the date of submission, or until the enquiry is
              resolved, whichever is longer. We review and delete data that is no
              longer needed.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              5. Your rights under UK GDPR
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc list-inside space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Rectify inaccurate data</li>
              <li>Erasure (&ldquo;the right to be forgotten&rdquo;)</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing based on legitimate interests</li>
              <li>Withdraw consent at any time where we rely on consent</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                {CONTACT.email}
              </a>
              . You also have the right to lodge a complaint with the{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                Information Commissioner&apos;s Office (ICO)
              </a>
              .
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-serif text-2xl text-ink mb-4">6. Cookies</h2>
            <p>We use the following cookies:</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-ink/10">
                <thead>
                  <tr className="bg-ink/4">
                    <th className="text-left p-3 border border-ink/10 text-ink">Cookie</th>
                    <th className="text-left p-3 border border-ink/10 text-ink">Purpose</th>
                    <th className="text-left p-3 border border-ink/10 text-ink">Duration</th>
                    <th className="text-left p-3 border border-ink/10 text-ink">Essential?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-ink/10">eclat_cookie_consent</td>
                    <td className="p-3 border border-ink/10">Stores your cookie consent preference</td>
                    <td className="p-3 border border-ink/10">1 year (localStorage)</td>
                    <td className="p-3 border border-ink/10">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-ink/10">[PLACEHOLDER: analytics cookie name]</td>
                    <td className="p-3 border border-ink/10">Site analytics — understanding how visitors use the site</td>
                    <td className="p-3 border border-ink/10">[PLACEHOLDER]</td>
                    <td className="p-3 border border-ink/10">No — consent required</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              You can withdraw consent for non-essential cookies at any time by
              clearing your browser&apos;s localStorage for this site, or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">
              7. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. We will post the
              updated version on this page with a revised &ldquo;last updated&rdquo; date.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
