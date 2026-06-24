import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/auth/mock-users";

// Edge-safe config — no Node.js-only dependencies (no bcryptjs).
// Used by middleware. The full auth.ts extends this.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.venueId = (user as { venueId: string }).venueId;
        token.venueName = (user as { venueName: string }).venueName;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.sub ?? "";
        (session.user as { venueId: string }).venueId = token.venueId as string;
        (session.user as { venueName: string }).venueName = token.venueName as string;
        (session.user as { role: UserRole }).role = token.role as UserRole;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
