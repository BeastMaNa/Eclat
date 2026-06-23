"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-bone/5 border border-bone/15 rounded-lg px-4 py-3 font-sans text-sm text-bone placeholder-stone/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block font-sans text-xs tracking-wide uppercase text-stone mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@venue.co.uk"
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="font-sans text-xs tracking-wide uppercase text-stone"
          >
            Password
          </label>
          <a
            href="/forgot-password"
            className="font-sans text-xs text-accent hover:text-accent-deep transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
        >
          <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-red-300">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-deep disabled:opacity-50 text-ink font-sans text-sm font-semibold rounded-full py-3 transition-colors duration-[250ms] ease-luxe flex items-center justify-center gap-2 mt-2"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
