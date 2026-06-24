"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import {
  PRESETS, getRangeLabel, getActivePresetId,
  toIsoDate, startOfDay, endOfDay, EARLIEST_DATE,
} from "@/lib/admin/date-range";
import type { PresetId } from "@/lib/admin/date-range";

export function DateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [customError, setCustomError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Derive active range from URL params
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam
    ? startOfDay(new Date(fromParam + "T00:00:00"))
    : startOfDay(new Date(Date.now() - 30 * 86_400_000));
  const to = toParam
    ? endOfDay(new Date(toParam + "T00:00:00"))
    : endOfDay(new Date());

  const label = getRangeLabel(from, to);
  const activePreset = getActivePresetId(from, to);

  // Sync custom inputs when picker opens
  useEffect(() => {
    if (open) {
      setCustomFrom(fromParam ?? toIsoDate(from));
      setCustomTo(toParam ?? toIsoDate(to));
      setCustomError("");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function navigate(newFrom: Date, newTo: Date) {
    // Build new params, preserving non-date params from current URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", toIsoDate(newFrom));
    params.set("to", toIsoDate(newTo));
    params.delete("days"); // remove legacy param
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  function applyPreset(id: PresetId) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    const { from, to } = preset.range();
    navigate(from, to);
  }

  function applyCustom() {
    setCustomError("");
    if (!customFrom || !customTo) {
      setCustomError("Both dates are required.");
      return;
    }
    const f = startOfDay(new Date(customFrom + "T00:00:00"));
    const t = endOfDay(new Date(customTo + "T00:00:00"));
    const today = endOfDay(new Date());

    if (isNaN(f.getTime()) || isNaN(t.getTime())) {
      setCustomError("Invalid date format.");
      return;
    }
    if (f > t) {
      setCustomError("Start date must be before end date.");
      return;
    }
    if (t > today) {
      setCustomError("End date cannot be in the future.");
      return;
    }
    if (f < EARLIEST_DATE) {
      setCustomError("No data before March 2024.");
      return;
    }
    navigate(f, t);
  }

  const today = toIsoDate(new Date());
  const earliest = toIsoDate(EARLIEST_DATE);

  // Group presets for the UI
  const presetRows: PresetId[][] = [
    ["today", "7d", "30d", "90d"],
    ["this-month", "last-month", "this-year", "all-time"],
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Date range: ${label}`}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone/20 bg-white hover:border-stone/40 hover:bg-stone/5 transition-colors font-sans text-xs font-medium text-ink"
      >
        <CalendarDays size={13} className="text-stone shrink-0" aria-hidden="true" />
        <span className="max-w-[160px] truncate">{label}</span>
        <ChevronDown
          size={12}
          className={`text-stone/60 transition-transform duration-150 shrink-0 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="dialog"
          aria-label="Select date range"
          className="absolute right-0 top-full mt-1.5 z-[150] w-[320px] bg-white border border-stone/15 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Preset grid */}
          <div className="p-3 border-b border-stone/10">
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-stone/60 mb-2 px-1">
              Quick ranges
            </p>
            <div className="space-y-1.5">
              {presetRows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-4 gap-1">
                  {row.map((id) => {
                    const preset = PRESETS.find((p) => p.id === id)!;
                    const isActive = activePreset === id;
                    return (
                      <button
                        key={id}
                        onClick={() => applyPreset(id)}
                        className={`relative flex items-center justify-center px-1 py-1.5 rounded-lg font-sans text-[10px] font-semibold transition-colors ${
                          isActive
                            ? "bg-ink text-bone"
                            : "bg-stone/5 text-stone hover:bg-stone/10 hover:text-ink"
                        }`}
                      >
                        {isActive && (
                          <Check size={9} className="absolute top-1 right-1 opacity-70" aria-hidden="true" />
                        )}
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Custom range */}
          <div className="p-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-stone/60 mb-2 px-1">
              Custom range
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="block space-y-1">
                <span className="font-sans text-[10px] text-stone">From</span>
                <input
                  type="date"
                  value={customFrom}
                  min={earliest}
                  max={customTo || today}
                  onChange={(e) => { setCustomFrom(e.target.value); setCustomError(""); }}
                  className="w-full border border-stone/20 rounded-lg px-2.5 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-sans text-[10px] text-stone">To</span>
                <input
                  type="date"
                  value={customTo}
                  min={customFrom || earliest}
                  max={today}
                  onChange={(e) => { setCustomTo(e.target.value); setCustomError(""); }}
                  className="w-full border border-stone/20 rounded-lg px-2.5 py-1.5 font-sans text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </label>
            </div>
            {customError && (
              <p role="alert" className="font-sans text-[10px] text-red-600 mt-1.5 px-0.5">
                {customError}
              </p>
            )}
            <button
              onClick={applyCustom}
              disabled={!customFrom || !customTo}
              className="mt-2 w-full py-2 rounded-lg bg-ink text-bone font-sans text-xs font-semibold hover:bg-ink/80 transition-colors disabled:opacity-40"
            >
              Apply custom range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
