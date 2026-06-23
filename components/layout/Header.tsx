"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, BRAND_NAME } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        if (barRef.current) {
          const el = document.documentElement;
          const scrollable = el.scrollHeight - el.clientHeight;
          const p = scrollable > 0 ? window.scrollY / scrollable : 0;
          barRef.current.style.transform = `scaleX(${p})`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Transparent only on the home page before the user scrolls past the hero.
  // On every other page the header is always solid.
  const transparent = isHome && !scrolled;

  return (
    <header
      style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding] duration-[500ms]",
        transparent
          ? "bg-transparent py-5 border-b border-transparent"
          : "bg-bone py-3 border-b border-stone/20"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          className={cn(
            "font-serif text-2xl tracking-tight transition-colors duration-[500ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm shrink-0",
            transparent ? "text-bone" : "text-ink"
          )}
          aria-label={`${BRAND_NAME} — home`}
        >
          {BRAND_NAME}
        </Link>

        {/* Desktop nav — absolutely centred between logo and CTA */}
        <nav aria-label="Main navigation" className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
              className={cn(
                "font-sans text-sm transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
                transparent
                  ? "text-bone/70 hover:text-bone"
                  : "text-ink/70 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/dashboard"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            className={cn(
              "hidden lg:inline-flex font-sans text-xs tracking-wide transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
              transparent ? "text-bone/50 hover:text-bone" : "text-stone hover:text-ink"
            )}
          >
            Partner login
          </Link>
          <Button
            asChild
            variant="accent"
            size="sm"
            className="hidden lg:inline-flex"
          >
            <Link href="/contact">Bring Éclat to your venue</Link>
          </Button>
          <button
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            className={cn(
              "lg:hidden p-2 transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm",
              transparent ? "text-bone" : "text-ink"
            )}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-accent origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile menu — height + opacity animated with luxe easing */}
      <div
        id="mobile-menu"
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-[400ms]",
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <nav
          className="bg-bone border-t border-stone/20 px-6 py-6 flex flex-col gap-5"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-base text-ink hover:text-accent transition-colors duration-[250ms]"
              style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="accent" className="mt-2 w-full">
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Bring Éclat to your venue
            </Link>
          </Button>
          <Link
            href="/dashboard"
            className="font-sans text-sm text-stone hover:text-ink transition-colors text-center"
            onClick={() => setMenuOpen(false)}
          >
            Partner login →
          </Link>
        </nav>
      </div>
    </header>
  );
}
