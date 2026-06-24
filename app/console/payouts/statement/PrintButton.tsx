"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 rounded-lg font-sans text-xs font-semibold bg-ink text-bone hover:bg-ink/80 transition-colors"
    >
      Print / Save PDF
    </button>
  );
}
