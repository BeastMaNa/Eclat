"use client";

import { useState } from "react";
import { Flag, X, ChevronDown, Loader2, CheckCircle } from "lucide-react";

const CATEGORIES = [
  "Machine not working",
  "Machine needs restocking",
  "Wrong fragrance in slot",
  "Payment issue",
  "Dashboard / app problem",
  "Other",
];

interface ReportIssueButtonProps {
  venueName: string;
}

export function ReportIssueButton({ venueName }: ReportIssueButtonProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold border border-stone/25 text-stone hover:text-ink hover:border-stone/50 transition-colors duration-[200ms]"
      >
        <Flag size={12} aria-hidden="true" />
        Report issue
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Report an issue"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-bone w-full max-w-md rounded-2xl shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink">Report an issue</h2>
                <p className="font-sans text-xs text-stone mt-0.5">{venueName}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-stone hover:text-ink transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <CheckCircle size={36} className="text-accent" />
                <p className="font-serif text-lg font-bold text-ink">Report sent</p>
                <p className="font-sans text-sm text-stone">
                  We&apos;ll look into it and get back to you shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-2 bg-ink text-bone rounded-full px-6 py-2.5 font-sans text-sm font-semibold hover:bg-ink/80 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category */}
                <div>
                  <label className="font-sans text-xs uppercase tracking-wide text-stone block mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none bg-white border border-stone/20 rounded-xl px-4 py-2.5 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent pr-9"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-sans text-xs uppercase tracking-wide text-stone block mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in as much detail as you can…"
                    rows={4}
                    required
                    minLength={5}
                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-2.5 font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="font-sans text-xs text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-ink text-bone rounded-full py-3 font-sans text-sm font-semibold hover:bg-ink/80 transition-colors disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 size={14} className="animate-spin" />}
                  {status === "loading" ? "Sending…" : "Send report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
