"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const PRESETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

interface DateRangePickerProps {
  activeDays: number;
}

export function DateRangePicker({ activeDays }: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setDays(days: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", String(days));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div role="group" aria-label="Date range" className="flex gap-1 bg-stone/10 p-1 rounded-full">
      {PRESETS.map(({ label, days }) => (
        <button
          key={days}
          onClick={() => setDays(days)}
          aria-pressed={activeDays === days}
          className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors duration-[200ms] ${
            activeDays === days
              ? "bg-accent text-ink"
              : "text-stone hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
