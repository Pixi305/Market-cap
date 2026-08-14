import { NextResponse, type NextRequest } from "next/server";
import { fetchProfile } from "@/lib/finnhub/client";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  try {
    const profile = await fetchProfile(symbol.toUpperCase());
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
