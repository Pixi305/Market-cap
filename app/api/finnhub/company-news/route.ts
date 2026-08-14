import { NextResponse, type NextRequest } from "next/server";
import { fetchCompanyNews } from "@/lib/finnhub/client";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  try {
    const news = await fetchCompanyNews(symbol.toUpperCase());
    return NextResponse.json(news);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
