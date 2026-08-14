import { NextResponse } from "next/server";
import { fetchMarketNews } from "@/lib/finnhub/client";

export async function GET() {
  try {
    const news = await fetchMarketNews();
    return NextResponse.json(news);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
