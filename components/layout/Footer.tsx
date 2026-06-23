import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, FOOTER_NAV, CONTACT, SOCIAL_LINKS, LOCATION } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-ink text-bone overflow-hidden">
      {/* Links + info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 lg:pt-10 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-3xl text-bone tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              {BRAND_NAME}
            </Link>
            <p className="mt-1 font-sans text-xs tracking-[0.15em] uppercase text-accent font-semibold">
              {BRAND_TAGLINE}
            </p>
            <p className="mt-5 font-sans text-sm leading-relaxed text-bone/60 max-w-sm">
              Manchester-based. Premium cashless fragrance vending for
              nightclubs, bars, hotels, and beyond — across {LOCATION.regionFull}.
              Zero effort for your venue; passive revenue from day one.
            </p>
            <div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="font-sans text-sm text-bone/50 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-accent font-semibold mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_NAV.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-bone/60 hover:text-bone transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-accent font-semibold mb-5">
              Contact
            </h3>
            <address className="not-italic space-y-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-sans text-sm text-bone/60 hover:text-accent transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="font-sans text-sm text-bone/60 hover:text-accent transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                {CONTACT.phone}
              </a>
            </address>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-accent font-semibold mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {FOOTER_NAV.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-bone/60 hover:text-bone transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright + CTA */}
        <div className="mt-8 pt-5 border-t border-bone/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-sans text-xs text-bone/30">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.{" "}
            [PLACEHOLDER: Registered company name & number]
          </p>
          <Button asChild variant="outline" size="sm" className="border-bone/20 text-bone/60 hover:bg-bone hover:text-ink">
            <Link href="/contact">Partner with us</Link>
          </Button>
        </div>
      </div>

      {/* Scrolling wordmark ticker */}
      <div
        className="w-full overflow-hidden border-t border-bone/[0.06] py-4 select-none pointer-events-none"
        aria-hidden="true"
      >
        {/* Two SEPARATE identical wrappers with no gap between them.
            -50% shift = exactly one wrapper's width → seamless loop. */}
        <div className="animate-marquee flex items-center" style={{ width: "max-content" }}>
          {[0, 1].map((set) => (
            <div key={set} className="flex items-center">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="flex items-center">
                  <span className="font-serif font-black text-accent text-3xl uppercase tracking-wide leading-none px-2">ÉCLAT</span>
                  <span className="text-accent/40 text-base leading-none px-2">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
