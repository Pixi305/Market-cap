import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/(auth)/actions";

export async function UserMenu() {
  const user = isSupabaseConfigured
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Log in
      </Link>
    );
  }

  return (
    <form action={signOut} className="flex items-center gap-3">
      <span className="hidden text-sm text-neutral-600 sm:inline">{user.email}</span>
      <button
        type="submit"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        aria-label="Sign out"
      >
        <LogOut size={16} />
      </button>
    </form>
  );
}
