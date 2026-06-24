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

// ─── Machine ROI ──────────────────────────────────────────────────────────────

/** Purchase cost per machine model (hardware only, ex-install). */
export const MACHINE_PURCHASE_COST_GBP: Record<string, number> = {
  "Tower S1":   3500,  // [PLACEHOLDER]
  "Counter C2": 2800,  // [PLACEHOLDER]
  "Slim S3":    2400,  // [PLACEHOLDER]
};

/** Standard install cost per machine (labour + travel + commissioning). */
export const MACHINE_INSTALL_COST_GBP = 400;               // [PLACEHOLDER]

/** Months after install at which a machine is expected to have paid back its capital cost. */
export const EXPECTED_PAYBACK_MONTHS = 18;                 // [PLACEHOLDER]

// ─── Partner contracts ────────────────────────────────────────────────────────

/** Flag a contract as "expiring soon" if its end date is within this many days. */
export const CONTRACT_EXPIRY_WARNING_DAYS = 60;            // [PLACEHOLDER]

// ─── Central inventory ────────────────────────────────────────────────────────

/** Default central-stock reorder threshold (bottles). */
export const DEFAULT_REORDER_THRESHOLD = 10;               // [PLACEHOLDER]

/** Default suggested reorder quantity (bottles, typically one case). */
export const DEFAULT_REORDER_QTY = 24;                     // [PLACEHOLDER]

/** Default supplier name shown on purchase-order drafts. */
export const DEFAULT_SUPPLIER = "Éclat Wholesale Ltd";     // [PLACEHOLDER]

// ─── Reconciliation ───────────────────────────────────────────────────────────

/** Payment processor fee as a fraction of gross. e.g. 0.015 = 1.5 %. */
export const PROCESSOR_FEE_RATE = 0.015;                   // [PLACEHOLDER]

/** Flag a reconciliation line if |discrepancy| exceeds this in GBP. */
export const RECONCILIATION_DISCREPANCY_THRESHOLD_GBP = 1.00; // [PLACEHOLDER]

// ─── Anomaly detection ────────────────────────────────────────────────────────

/** Flag a machine as anomalous if actual sales < this fraction of the DOW baseline. */
export const ANOMALY_LOW_FRACTION = 0.25;                  // [PLACEHOLDER]

/** Minimum expected units per day before anomaly detection triggers. */
export const ANOMALY_MIN_BASELINE = 4;                     // [PLACEHOLDER]

// ─── Owner digest ─────────────────────────────────────────────────────────────

/** Recipients for the owner digest email. */
export const DIGEST_RECIPIENTS: string[] = ["team@eclat.co.uk"]; // [PLACEHOLDER]

/** Resend "from" address (must be on a verified domain in your Resend account). */
export const DIGEST_FROM = "ops@eclat.co.uk";              // [PLACEHOLDER]
