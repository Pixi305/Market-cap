import { NextResponse, type NextRequest } from "next/server";
import { fetchSearch } from "@/lib/finnhub/client";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const results = await fetchSearch(query);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
