import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

async function getDefaultWatchlistId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("watchlists")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();
  return data?.id ?? null;
}

async function getSymbols(supabase: Awaited<ReturnType<typeof createClient>>, watchlistId: string) {
  const { data } = await supabase
    .from("watchlist_items")
    .select("symbol")
    .eq("watchlist_id", watchlistId)
    .order("added_at", { ascending: true });
  return (data ?? []).map((r) => r.symbol);
}

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json([]);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([]);

  const watchlistId = await getDefaultWatchlistId(supabase, user.id);
  if (!watchlistId) return NextResponse.json([]);

  return NextResponse.json(await getSymbols(supabase, watchlistId));
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPro = sub?.plan === "pro" && sub?.status === "active";

  const watchlistId = await getDefaultWatchlistId(supabase, user.id);
  if (!watchlistId) return NextResponse.json({ error: "No watchlist found" }, { status: 404 });

  // Free users can save up to 3 stocks
  if (!isPro) {
    const current = await getSymbols(supabase, watchlistId);
    if (current.length >= 3) {
      return NextResponse.json({ error: "upgrade_required" }, { status: 403 });
    }
  }

  const { symbol } = await request.json() as { symbol: string };
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  await supabase
    .from("watchlist_items")
    .upsert({ watchlist_id: watchlistId, symbol: symbol.toUpperCase() }, { onConflict: "watchlist_id,symbol" });

  return NextResponse.json(await getSymbols(supabase, watchlistId));
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  const watchlistId = await getDefaultWatchlistId(supabase, user.id);
  if (!watchlistId) return NextResponse.json({ error: "No watchlist found" }, { status: 404 });

  await supabase
    .from("watchlist_items")
    .delete()
    .eq("watchlist_id", watchlistId)
    .eq("symbol", symbol.toUpperCase());

  return NextResponse.json(await getSymbols(supabase, watchlistId));
}
