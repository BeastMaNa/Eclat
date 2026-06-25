import type { NextConfig } from "next";

// Applied to every response. 'unsafe-inline' on script/style is required by
// Next.js's runtime (hydration scripts) and Tailwind's utility classes.
// Upgrade path: add nonce-based CSP once Next.js nonce support is wired in.
const SECURITY_HEADERS = [
  // Enforce HTTPS for 2 years; include subdomains; submit to preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent framing (clickjacking) — also enforced via frame-ancestors in CSP
  { key: "X-Frame-Options", value: "DENY" },
  // Send only origin on cross-origin requests; full URL for same-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable sensors / permissions not used by this app
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // DNS prefetch improves performance without meaningful info leak for a public site
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js emits inline scripts for hydration; remove 'unsafe-inline' once
      // nonce-based CSP is implemented.
      "script-src 'self' 'unsafe-inline'",
      // Tailwind generates inline styles at runtime
      "style-src 'self' 'unsafe-inline'",
      // Local images + data URIs (SVG placeholders) + blob: (client-side CSV export)
      "img-src 'self' data: blob:",
      // Local fonts only (no Google Fonts CDN)
      "font-src 'self' data:",
      // Fetch / XHR — only back to this origin
      "connect-src 'self'",
      // Never allow this page to be framed
      "frame-ancestors 'none'",
      // Form submissions stay on this origin
      "form-action 'self'",
      // Prevent <base> injection attacks
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/catalog",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
