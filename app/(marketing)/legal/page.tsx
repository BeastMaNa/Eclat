import type { Metadata } from "next";
import { BRAND_NAME, CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Legal / Imprint",
  description: "Company registration details and legal information for Éclat.",
  robots: { index: false },
};

export default function LegalPage() {
  return (
    <article className="bg-bone pt-40 pb-24">
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <h1 className="font-serif text-4xl lg:text-5xl text-ink mb-12">
          Legal / Imprint
        </h1>

        <div className="space-y-10 font-sans text-sm text-stone leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Company details</h2>
            <dl className="space-y-2">
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Legal name</dt>
                <dd>[PLACEHOLDER: e.g. Éclat Fragrance Ltd]</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Trading as</dt>
                <dd>{BRAND_NAME}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Registered in</dt>
                <dd>England and Wales</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Company number</dt>
                <dd>[PLACEHOLDER: company number]</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Registered office</dt>
                <dd>[PLACEHOLDER: full registered address]</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">VAT number</dt>
                <dd>[PLACEHOLDER: GB VAT number, if registered]</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Contact</h2>
            <dl className="space-y-2">
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Email</dt>
                <dd>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-accent underline underline-offset-2 hover:text-accent-deep"
                  >
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-44 shrink-0 text-ink/60">Phone</dt>
                <dd>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="text-accent underline underline-offset-2 hover:text-accent-deep"
                  >
                    {CONTACT.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Regulatory</h2>
            <p>
              [PLACEHOLDER: any regulatory registrations, e.g. ICO registration
              number for data protection purposes: ZB-XXXXXXXX]
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Dispute resolution</h2>
            <p>
              In the event of a dispute, we encourage you to contact us in the
              first instance at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-accent underline underline-offset-2 hover:text-accent-deep"
              >
                {CONTACT.email}
              </a>
              . We are committed to resolving disputes promptly and fairly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Links</h2>
            <div className="flex gap-6">
              <a href="/terms" className="text-accent underline underline-offset-2 hover:text-accent-deep">
                Terms &amp; Conditions
              </a>
              <a href="/privacy" className="text-accent underline underline-offset-2 hover:text-accent-deep">
                Privacy Policy
              </a>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
