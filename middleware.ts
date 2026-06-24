import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/auth/mock-users";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as { role?: UserRole } | undefined)?.role;
  const isAuthed = !!req.auth;

  // ── /console routes — owner only ──────────────────────────────────────────
  if (pathname.startsWith("/console")) {
    if (!isAuthed) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "owner") {
      // Partner trying to access console → send to their dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── /dashboard routes — partner only ─────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthed) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role === "owner") {
      // Owner trying to access partner dashboard → send to console
      return NextResponse.redirect(new URL("/console", req.url));
    }
  }

  // ── /login — redirect authenticated users to their home ──────────────────
  if (pathname === "/login" && isAuthed) {
    const dest = role === "owner" ? "/console" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/console/:path*", "/login"],
};
