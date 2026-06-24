// ─── Cost configuration ───────────────────────────────────────────────────────
//
// [PLACEHOLDER] — Update every value here with real data before production.
// These constants feed profitability, payouts, and fragrance analytics.
//
// REAL SWAP POINT: once you have per-fragrance wholesale cost data from your
// supplier, replace WHOLESALE_COST_PER_SALE_GBP with a fragrance-keyed Map
// and update getNetProfitability() / getFragranceAnalytics() in mock.ts.

/** Average wholesale cost per vend (fragrance portion + consumables). */
export const WHOLESALE_COST_PER_SALE_GBP = 0.45;          // [PLACEHOLDER]

/** Monthly servicing allocation per deployed machine (labour + travel + parts). */
export const SERVICING_COST_PER_MACHINE_MONTH_GBP = 25;   // [PLACEHOLDER]

/** Flag a fragrance as a slow mover if it sells fewer than this per 30 days. */
export const SLOW_MOVER_THRESHOLD_UNITS_PER_30D = 15;     // [PLACEHOLDER]

/** Flag a venue as thin-margin (amber) if net margin % falls below this. */
export const THIN_MARGIN_THRESHOLD_PCT = 35;               // [PLACEHOLDER]
