// REAL API LATER: these utilities are the single call-site conversion layer.
// All period-based data-source methods accept explicit Date objects — swapping
// the mock for a real DB only requires changing the data-source, not these helpers.

export const EARLIEST_DATE = new Date("2024-03-01"); // first venue go-live

// ── Helpers ───────────────────────────────────────────────────────────────────

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Parsing ───────────────────────────────────────────────────────────────────

export interface ParsedDateRange {
  from: Date;
  to: Date;
}

/**
 * Parse URL search params into a validated DateRange.
 * Accepts ?from=YYYY-MM-DD&to=YYYY-MM-DD (canonical) or legacy ?days=N.
 * Falls back to last 30 days if params are missing or invalid.
 */
export function parseRange(params: {
  from?: string;
  to?: string;
  days?: string;
}): ParsedDateRange {
  const now = new Date();
  const todayEnd = endOfDay(now);

  if (params.from && params.to) {
    const from = startOfDay(new Date(params.from + "T00:00:00"));
    const to = endOfDay(new Date(params.to + "T00:00:00"));
    if (
      !isNaN(from.getTime()) &&
      !isNaN(to.getTime()) &&
      from <= to &&
      to <= todayEnd &&
      from >= EARLIEST_DATE
    ) {
      return { from, to };
    }
  }

  if (params.days) {
    const d = Math.max(1, Math.min(3650, parseInt(params.days, 10) || 30));
    return {
      from: startOfDay(new Date(Date.now() - d * 86_400_000)),
      to: todayEnd,
    };
  }

  return {
    from: startOfDay(new Date(Date.now() - 30 * 86_400_000)),
    to: todayEnd,
  };
}

// ── Previous period (for period-over-period comparisons) ──────────────────────

export function prevRange(from: Date, to: Date): ParsedDateRange {
  const durationMs = to.getTime() - from.getTime();
  return {
    from: new Date(from.getTime() - durationMs - 1),
    to: new Date(from.getTime() - 1),
  };
}

// ── Preset definitions ────────────────────────────────────────────────────────

export type PresetId =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "this-month"
  | "last-month"
  | "this-year"
  | "all-time";

export interface RangePreset {
  id: PresetId;
  label: string;
  range: () => ParsedDateRange;
}

export const PRESETS: RangePreset[] = [
  {
    id: "today",
    label: "Today",
    range: () => {
      const now = new Date();
      return { from: startOfDay(now), to: endOfDay(now) };
    },
  },
  {
    id: "7d",
    label: "Last 7 days",
    range: () => ({
      from: startOfDay(new Date(Date.now() - 7 * 86_400_000)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "30d",
    label: "Last 30 days",
    range: () => ({
      from: startOfDay(new Date(Date.now() - 30 * 86_400_000)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "90d",
    label: "Last 90 days",
    range: () => ({
      from: startOfDay(new Date(Date.now() - 90 * 86_400_000)),
      to: endOfDay(new Date()),
    }),
  },
  {
    id: "this-month",
    label: "This month",
    range: () => {
      const now = new Date();
      return { from: startOfMonth(now), to: endOfDay(now) };
    },
  },
  {
    id: "last-month",
    label: "Last month",
    range: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = endOfMonth(start);
      return { from: startOfDay(start), to: end };
    },
  },
  {
    id: "this-year",
    label: "This year",
    range: () => {
      const now = new Date();
      return {
        from: startOfDay(new Date(now.getFullYear(), 0, 1)),
        to: endOfDay(now),
      };
    },
  },
  {
    id: "all-time",
    label: "All time",
    range: () => ({
      from: EARLIEST_DATE,
      to: endOfDay(new Date()),
    }),
  },
];

// ── Label formatting ──────────────────────────────────────────────────────────

const TOLERANCE_MS = 60_000; // 1 min — allow for slight clock drift

function approxEqual(a: Date, b: Date): boolean {
  return Math.abs(a.getTime() - b.getTime()) < TOLERANCE_MS;
}

export function getRangeLabel(from: Date, to: Date): string {
  for (const preset of PRESETS) {
    const { from: pFrom, to: pTo } = preset.range();
    if (approxEqual(from, pFrom) && approxEqual(to, pTo)) {
      return preset.label;
    }
  }
  const sameYear = from.getFullYear() === to.getFullYear();
  const fmtFrom = from.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
  const fmtTo = to.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${fmtFrom} – ${fmtTo}`;
}

export function getActivePresetId(from: Date, to: Date): PresetId | null {
  for (const preset of PRESETS) {
    const { from: pFrom, to: pTo } = preset.range();
    if (approxEqual(from, pFrom) && approxEqual(to, pTo)) {
      return preset.id;
    }
  }
  return null;
}
