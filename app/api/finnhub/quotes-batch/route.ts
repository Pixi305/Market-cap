import { NextResponse, type NextRequest } from "next/server";
import { fetchQuote } from "@/lib/finnhub/client";
import type { Quote } from "@/lib/finnhub/types";

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get("symbols");
  if (!symbolsParam) {
    return NextResponse.json({ error: "symbols is required" }, { status: 400 });
  }

  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  try {
    const results = await Promise.all(symbols.map((s) => fetchQuote(s)));
    const map: Record<string, Quote> = {};
    results.forEach((quote, i) => {
      if (quote) map[symbols[i]] = quote;
    });
    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
