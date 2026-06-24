"use client";

import { useState, useId } from "react";

// ── Price assumptions ─────────────────────────────────────────────────────────
const AUTHENTIC_PRICE = 2;   // avg £ per vend — standard/authentic tier
const PREMIUM_PRICE   = 3;   // avg £ per vend — premium tier
const COMMISSION_PCT  = 20;  // venue's revenue share %

// ── Fragrance mix options ─────────────────────────────────────────────────────
const MIXES = [
  { id: "authentic", label: "Authentic", desc: "Avg £2 / vend",    stdFrac: 1,   premFrac: 0   },
  { id: "mixed",     label: "Mixed",     desc: "Avg £2.50 / vend", stdFrac: 0.5, premFrac: 0.5 },
  { id: "premium",   label: "Premium",   desc: "Avg £3 / vend",    stdFrac: 0,   premFrac: 1   },
] as const;

type MixId = typeof MIXES[number]["id"];

// ── Nights presets ────────────────────────────────────────────────────────────
const NIGHT_PRESETS = [
  { label: "Fri–Sat", nights: 2 },
  { label: "Thu–Sun", nights: 4 },
  { label: "5 nights", nights: 5 },
  { label: "7 nights", nights: 7 },
];

const formatGbp = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

function Slider({
  id, label, min, max, step, value, onChange, format,
}: {
  id: string; label: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label htmlFor={id} className="font-sans text-xs uppercase tracking-[0.12em] text-stone">
          {label}
        </label>
        <span className="font-serif text-sm font-bold text-ink">{format(value)}</span>
      </div>
      <div className="relative h-1.5 bg-stone/15 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-accent rounded-full pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-valuenow={value}
          aria-valuetext={format(value)}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-sans text-[10px] text-stone/50">{format(min)}</span>
        <span className="font-sans text-[10px] text-stone/50">{format(max)}</span>
      </div>
    </div>
  );
}

// Inline panel — no section wrapper, designed to sit next to the pricing card
export function RoiCalculatorPanel() {
  const uid = useId();
  const [footfall, setFootfall]           = useState(500);
  const [conversion, setConversion]       = useState(1.5);
  const [nightsPerWeek, setNightsPerWeek] = useState(4);
  const [mix, setMix]                     = useState<MixId>("mixed");

  const selectedMix     = MIXES.find((m) => m.id === mix)!;
  const vendsPerNight   = footfall * (conversion / 100);
  const stdVends        = vendsPerNight * selectedMix.stdFrac;
  const premVends       = vendsPerNight * selectedMix.premFrac;
  const revenuePerNight = stdVends * AUTHENTIC_PRICE + premVends * PREMIUM_PRICE;
  const nightsPerMonth  = nightsPerWeek * (52 / 12);
  const monthlyRevenue  = revenuePerNight * nightsPerMonth;
  const venueMonthly    = monthlyRevenue * (COMMISSION_PCT / 100);
  const venueAnnual     = venueMonthly * 12;

  return (
    <div className="space-y-4">
      <div>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-2">Earnings calculator</p>
        <h2 className="font-serif text-2xl font-bold text-ink">See what you could earn</h2>
      </div>

      {/* Controls */}
      <div className="bg-white/70 border border-stone/10 rounded-2xl p-5 space-y-6">
        <Slider
          id={`${uid}-footfall`}
          label="Daily footfall (guests)"
          min={100} max={3000} step={50}
          value={footfall}
          onChange={setFootfall}
          format={(v) => v.toLocaleString("en-GB")}
        />
        <Slider
          id={`${uid}-conversion`}
          label="Conversion rate"
          min={0.5} max={5} step={0.5}
          value={conversion}
          onChange={setConversion}
          format={(v) => `${v}%`}
        />
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-stone mb-3">Nights open per week</p>
          <div className="flex gap-2 flex-wrap">
            {NIGHT_PRESETS.map(({ label, nights }) => (
              <button
                key={nights}
                onClick={() => setNightsPerWeek(nights)}
                className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold border transition-colors ${
                  nightsPerWeek === nights
                    ? "bg-accent/15 border-accent/30 text-ink"
                    : "border-stone/20 text-stone hover:text-ink hover:border-stone/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.12em] text-stone mb-3">Fragrance tier</p>
          <div className="grid grid-cols-3 gap-2">
            {MIXES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMix(m.id)}
                className={`flex flex-col items-center text-center px-2 py-2.5 rounded-xl border transition-colors ${
                  mix === m.id
                    ? "bg-accent/15 border-accent/30 text-ink"
                    : "border-stone/20 text-stone hover:text-ink hover:border-stone/40"
                }`}
              >
                <span className="font-sans text-xs font-semibold">{m.label}</span>
                <span className="font-sans text-[10px] text-stone mt-0.5">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="bg-white/70 border border-stone/10 rounded-2xl p-5">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-stone mb-3">Daily estimates</p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-sm text-stone">Total vends / night</span>
            <span className="font-serif text-lg font-bold text-ink">{Math.round(vendsPerNight)}</span>
          </div>
          {selectedMix.stdFrac > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-sm text-stone">Authentic vends</span>
              <span className="font-sans text-sm font-semibold text-ink">{Math.round(stdVends)} × £{AUTHENTIC_PRICE}</span>
            </div>
          )}
          {selectedMix.premFrac > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-sm text-stone">Premium vends</span>
              <span className="font-sans text-sm font-semibold text-ink">{Math.round(premVends)} × £{PREMIUM_PRICE}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline border-t border-stone/10 pt-2.5">
            <span className="font-sans text-sm text-stone">Machine rev / night</span>
            <span className="font-sans text-sm font-semibold text-ink">{formatGbp(revenuePerNight)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-sm text-stone">Monthly machine revenue</span>
            <span className="font-sans text-sm font-semibold text-ink">{formatGbp(monthlyRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Earnings highlight */}
      <div className="bg-accent/10 border border-accent/25 rounded-2xl p-5">
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-accent/80 mb-1">
          Your earnings ({COMMISSION_PCT}% commission)
        </p>
        <p className="font-serif text-4xl font-bold text-ink leading-none">
          {formatGbp(venueMonthly)}
          <span className="font-sans text-sm font-normal text-stone ml-2">/ mo</span>
        </p>
        <div className="mt-4 pt-4 border-t border-accent/15 flex justify-between items-baseline">
          <span className="font-sans text-xs text-stone">Annual estimate</span>
          <span className="font-serif text-lg font-bold text-ink">{formatGbp(venueAnnual)}</span>
        </div>
      </div>

      <p className="font-sans text-[11px] text-stone/60 leading-relaxed">
        Estimates only. Actual figures depend on venue type, location, and agreed commission rate confirmed at site survey.
      </p>
    </div>
  );
}
