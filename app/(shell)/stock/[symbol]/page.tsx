import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProfile as getCompanyProfile } from "@/lib/finnhub/client";
import { StockDetail } from "@/components/stock/StockDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const profile = await getCompanyProfile(symbol.toUpperCase());
  return {
    title: profile ? `${profile.symbol} · ${profile.name} — Marketcap` : "Marketcap",
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const profile = await getCompanyProfile(symbol.toUpperCase());

  if (!profile) {
    notFound();
  }

  return <StockDetail profile={profile} />;
}
