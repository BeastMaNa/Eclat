import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BRAND_NAME } from "@/content/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <section className="bg-bone min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="font-serif text-8xl text-accent/30 leading-none">404</p>
        <h1 className="mt-6 font-serif text-4xl text-ink">
          This page has drifted away
        </h1>
        <p className="mt-4 font-sans text-base text-stone leading-relaxed">
          The page you were looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="accent">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
        <p className="mt-8 font-sans text-xs text-stone/50">
          {BRAND_NAME} — Fragrance for Venues
        </p>
      </div>
    </section>
  );
}
