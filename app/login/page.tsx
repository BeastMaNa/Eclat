import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Partner Login | Éclat",
  description: "Sign in to your Éclat venue partner dashboard.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <a
            href="/"
            className="font-serif text-3xl text-bone tracking-tight hover:text-accent transition-colors"
          >
            Éclat
          </a>
          <p className="mt-1 font-sans text-xs tracking-[0.15em] uppercase text-stone">
            Venue Partner Portal
          </p>
        </div>

        <div className="bg-bone/5 border border-bone/10 rounded-2xl p-8">
          <h1 className="font-serif text-2xl font-bold text-bone mb-1">
            Sign in
          </h1>
          <p className="font-sans text-sm text-stone mb-8">
            Access your sales and stock dashboard.
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center font-sans text-xs text-stone/50">
          Not a partner yet?{" "}
          <a href="/pricing" className="text-accent hover:underline">
            See partnership models →
          </a>
        </p>
      </div>
    </div>
  );
}
