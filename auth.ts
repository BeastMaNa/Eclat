import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "@/lib/auth/mock-users";

// Extend the built-in session/JWT types with venueId / venueName
declare module "next-auth" {
  interface User {
    venueId: string;
    venueName: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      venueId: string;
      venueName: string;
    };
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = findUserByEmail(credentials.email as string);
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          venueId: user.venueId,
          venueName: user.venueName,
        };
      },
    }),
    // Add OAuth providers here to enable SSO:
    // Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
  ],
});
