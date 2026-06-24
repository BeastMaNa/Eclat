import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "@/lib/auth/mock-users";
import type { UserRole } from "@/lib/auth/mock-users";

declare module "next-auth" {
  interface User {
    venueId: string;
    venueName: string;
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      venueId: string;
      venueName: string;
      role: UserRole;
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
          role: user.role,
        };
      },
    }),
  ],
});
