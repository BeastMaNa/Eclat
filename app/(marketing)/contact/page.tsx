import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTACT, LOCATION } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Partnership Enquiries",
  description:
    "Interested in hosting an Éclat fragrance vending machine? Get in touch to discuss your venue — we respond within two working days.",
  openGraph: {
    title: "Contact | Éclat",
    description: "Interested in hosting an Éclat fragrance vending machine? Get in touch.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-bone pt-24 pb-24 lg:pt-28 lg:pb-32">
        {/* Page header */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center mb-14">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Get in touch
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight">
            Bring Éclat to your venue
          </h1>
          <p className="mt-4 font-sans text-base font-semibold text-stone max-w-xl mx-auto leading-relaxed">
            Fill in the form and one of our partnership team will be in touch
            within two working days. No obligation — just an honest conversation
            about whether Éclat is a good fit.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: info */}
            <div>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-wide uppercase text-stone mb-1">Email</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="font-sans text-base text-ink hover:text-accent transition-colors"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-wide uppercase text-stone mb-1">Phone</p>
                    <a
                      href={`tel:${CONTACT.phone}`}
                      className="font-sans text-base text-ink hover:text-accent transition-colors"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-wide uppercase text-stone mb-1">Area served</p>
                    <p className="font-sans text-base text-ink leading-relaxed">
                      {LOCATION.regionFull}
                    </p>
                    <p className="mt-1 font-sans text-sm text-stone leading-relaxed">
                      Based in {LOCATION.city}. National expansion underway — register interest if you&apos;re outside our current area.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-7 bg-accent/6 rounded-2xl">
                <h2 className="font-serif text-lg text-ink mb-3">What to expect</h2>
                <ol className="space-y-2">
                  {[
                    "We review your enquiry and venue details",
                    "A member of our team calls to discuss fit and answer questions",
                    "We arrange a site visit and provide a tailored proposal",
                    "Agree terms, schedule installation — typically within 2 weeks",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-serif text-accent leading-none mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="font-sans text-sm text-stone leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-stone/15">
              <h2 className="font-serif text-2xl font-bold text-ink mb-8">Venue enquiry</h2>
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
