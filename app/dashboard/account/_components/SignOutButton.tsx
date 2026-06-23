"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-2 bg-white/60 border border-stone/10 rounded-xl px-5 py-4 font-sans text-sm font-semibold text-stone hover:text-ink hover:bg-white/80 transition-colors"
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}
