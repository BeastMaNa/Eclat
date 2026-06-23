"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const COOKIE_KEY = "eclat_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    // Initialise analytics here after consent is given
    // e.g. if (process.env.NEXT_PUBLIC_GA_ID) { initGA(); }
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-bone border-t border-bone/10 px-6 py-5 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-sans text-sm text-bone/70 leading-relaxed max-w-2xl">
          We use essential cookies to keep the site working. With your consent,
          we also set analytics cookies to understand how you use the site. See
          our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-bone/50 hover:text-bone px-0"
            onClick={reject}
          >
            Reject non-essential
          </Button>
          <Button variant="accent" size="sm" onClick={accept}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
