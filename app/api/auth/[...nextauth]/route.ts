import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const { GET, POST: _POST } = handlers;

// Rate-limit credential sign-in: 10 attempts per IP per 15 minutes.
// Applies only to the credentials callback — other NextAuth POST paths
// (e.g. CSRF token, signout) pass through unrestricted.
async function POST(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/auth/callback/credentials") {
    const ip = getClientIp(request.headers);
    const { ok } = checkRateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60_000 });
    if (!ok) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }
  }
  return _POST(request);
}

export { GET, POST };
