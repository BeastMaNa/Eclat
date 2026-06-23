# Éclat — B2B Marketing Site

Premium fragrance vending machine partnership website. Targets **venue operators** (hotels, bars, nightclubs, gyms, spas, event spaces), not end consumers.

Built with Next.js 15 App Router · TypeScript · Tailwind CSS · shadcn/ui primitives · Resend.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # Fill in your values (optional for dev)
npm run dev                     # http://localhost:3000
```

The site works fully without any env vars set — the contact form logs submissions to the console instead of sending email.

---

## Project structure

```
/app             → Next.js App Router pages & API routes
/components      → UI, layout, and section components
/content         → All editable copy and data (start here)
/public/images   → Placeholder images (replace with real photography)
/lib             → Shared utilities
```

---

## Editing content

All copy, data, and configuration lives in `/content`. You never need to touch a page file to update text.

| File | What it controls |
|------|-----------------|
| [`content/site.ts`](content/site.ts) | Brand name, tagline, contact details, nav links, footer nav, social links, SEO defaults |
| [`content/catalog.ts`](content/catalog.ts) | Fragrance catalogue — names, families, notes, descriptions, featured flag |
| [`content/pricing.ts`](content/pricing.ts) | Partnership tiers (Revenue Share, Lease, Purchase), features, FAQ cards |
| [`content/faq.ts`](content/faq.ts) | FAQ categories and Q&A pairs |

---

## Changing the brand name

Open [`content/site.ts`](content/site.ts) and change the `BRAND_NAME` constant:

```ts
export const BRAND_NAME = "Éclat";  // ← change this
```

The name propagates everywhere: the header, footer, metadata, JSON-LD schema, page copy, email templates, and the 404 page.

---

## Changing the accent colour

Open [`tailwind.config.ts`](tailwind.config.ts) and update the `accent` token:

```ts
colors: {
  accent: {
    DEFAULT: "#C9A684",   // ← rose-champagne, change to your colour
    deep:    "#B58A66",   // ← hover/active shade (slightly darker)
  },
  // ...
}
```

The accent is used for: buttons, section labels, link hover states, focus rings, fragrance family badges, and the CTA dividers. It is intentionally used sparingly — never as a large background fill.

---

## Contact form (Resend)

1. Sign up at [resend.com](https://resend.com) and create an API key.
2. Add to `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_RECIPIENT_EMAIL=you@yourdomain.com
```

3. In [`app/api/contact/route.ts`](app/api/contact/route.ts), update the `from:` address to a domain you have verified with Resend.

**Dev fallback:** If `RESEND_API_KEY` is not set, the API route logs the submission to the console and returns success — so the form works end-to-end locally without a Resend account.

---

## Replacing placeholder images

All images in `/public/images/` are SVG placeholders. Replace them with real photography:

| File | Used on | Recommended size |
|------|---------|-----------------|
| `hero-venue.svg` | Home page hero background | 1920 × 1080 px |
| `venue-hotel.svg` | Venue types grid | 800 × 1000 px |
| `venue-nightclub.svg` | Venue types grid | 800 × 1000 px |
| `venue-gym.svg` | Venue types grid | 800 × 1000 px |
| `venue-restaurant.svg` | Venue types grid | 800 × 1000 px |
| `venue-events.svg` | Venue types grid | 800 × 1000 px |
| `venue-office.svg` | Venue types grid | 800 × 1000 px |
| `fragrance-*.svg` | Catalogue cards | 600 × 800 px |
| `og-default.svg` | Open Graph / social share | 1200 × 630 px |

Use `.jpg` or `.webp` for photos. After replacing, remove `dangerouslyAllowSVG: true` from `next.config.ts`.

For testimonial partner logos, add SVGs to `/public/images/logo-venue-{1,2,3}.svg` and the logo strip `logo-strip-{1-5}.svg`.

---

## Analytics

The site is analytics-ready but loads **nothing** before cookie consent.

1. Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in env.
2. In [`components/CookieBanner.tsx`](components/CookieBanner.tsx), uncomment the `initGA()` call in the `accept()` function and implement the initialisation.

---

## Deploying to Vercel

```bash
vercel deploy
```

Set the env vars in the Vercel project settings:
- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `NEXT_PUBLIC_BASE_URL` (your production domain, e.g. `https://eclat.co.uk`)

---

## Placeholder checklist

Everything marked `[PLACEHOLDER: ...]` in the codebase:

### Brand & legal
- [ ] `content/site.ts` — contact email address
- [ ] `content/site.ts` — contact phone number
- [ ] `content/site.ts` — registered address (used in footer)
- [ ] `content/site.ts` — Instagram URL
- [ ] `content/site.ts` — LinkedIn URL
- [ ] `app/legal/page.tsx` — legal company name (e.g. Éclat Fragrance Ltd)
- [ ] `app/legal/page.tsx` — Companies House registration number
- [ ] `app/legal/page.tsx` — full registered office address
- [ ] `app/legal/page.tsx` — VAT number (if registered)
- [ ] `app/legal/page.tsx` — ICO registration number
- [ ] `app/terms/page.tsx` — effective date
- [ ] `app/terms/page.tsx` — website domain
- [ ] `app/terms/page.tsx` — liability cap amount
- [ ] `app/privacy/page.tsx` — effective date
- [ ] `app/privacy/page.tsx` — data retention period
- [ ] `app/privacy/page.tsx` — analytics provider name and cookie details

### Pricing & commercial
- [ ] `content/pricing.ts` — Revenue Share commission percentage
- [ ] `content/pricing.ts` — Venue Lease monthly price
- [ ] `content/pricing.ts` — Lease higher commission percentage
- [ ] `content/pricing.ts` — Outright Purchase price
- [ ] `content/pricing.ts` — partnership agreement term lengths
- [ ] `content/faq.ts` — commission percentage (FAQ answer)
- [ ] `content/faq.ts` — typical sample price range (e.g. £3–£8)
- [ ] `content/faq.ts` — partnership notice period (e.g. 60 days)
- [ ] `content/faq.ts` — minimum footfall threshold

### Machine specs
- [ ] `content/faq.ts` — machine dimensions (floor footprint and height)

### Social proof
- [ ] `components/sections/Testimonials.tsx` — hotel name and partner quote
- [ ] `components/sections/Testimonials.tsx` — gym/wellness brand name and quote
- [ ] `components/sections/Testimonials.tsx` — bar/restaurant name and quote
- [ ] `components/sections/Testimonials.tsx` — 5 partner logo filenames for logo strip

### Statistics
- [ ] `components/sections/StatsBand.tsx` — number of venues served
- [ ] `components/sections/StatsBand.tsx` — installation-to-launch time
- [ ] `components/sections/StatsBand.tsx` — partner retention percentage

### Email
- [ ] `app/api/contact/route.ts` — `from:` address (must be a Resend-verified domain)

---

## Legal notes

The Terms & Conditions and Privacy Policy are **draft templates** clearly marked as such. Have them reviewed by a qualified solicitor and data protection adviser before going live.
