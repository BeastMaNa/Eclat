import type { NextAuthConfig } from "next-auth";

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
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.sub ?? "";
        (session.user as { venueId: string }).venueId = token.venueId as string;
        (session.user as { venueName: string }).venueName = token.venueName as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
