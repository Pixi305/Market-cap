import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ plan: "free", status: "active", authenticated: false });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ plan: "free", status: "active", authenticated: false });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    plan: sub?.plan ?? "free",
    status: sub?.status ?? "active",
    current_period_end: sub?.current_period_end ?? null,
    authenticated: true,
  });
}
