import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Éclat",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <a
          href="/"
          className="font-serif text-3xl text-bone tracking-tight hover:text-accent transition-colors"
        >
          Éclat
        </a>
        <p className="mt-1 font-sans text-xs tracking-[0.15em] uppercase text-stone mb-10">
          Venue Partner Portal
        </p>

        <div className="bg-bone/5 border border-bone/10 rounded-2xl p-8">
          <h1 className="font-serif text-2xl font-bold text-bone mb-3">
            Password reset
          </h1>
          <p className="font-sans text-sm text-stone leading-relaxed mb-6">
            Password reset is managed by your Éclat account manager. Please
            get in touch and we&apos;ll reset your access within one working day.
          </p>
          <a
            href="mailto:partners@eclat.co.uk"
            className="inline-block bg-accent hover:bg-accent-deep text-ink font-sans text-sm font-semibold rounded-full px-6 py-3 transition-colors"
          >
            Email us
          </a>
        </div>

        <a
          href="/login"
          className="mt-6 block font-sans text-xs text-stone/50 hover:text-stone transition-colors"
        >
          ← Back to sign in
        </a>
      </div>
    </div>
  );
}
