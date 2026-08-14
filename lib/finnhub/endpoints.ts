// Client-safe data layer used by hooks (never touches FINNHUB_API_KEY
// directly — every function here calls one of our own app/api/finnhub/*
// route handlers, which hold the real key server-side). The one exception
// is getCandles: Finnhub's free tier does not include stock candle/history
// access ("You don't have access to this resource"), so chart data stays
// simulated, anchored to the real live price for visual coherence.

import type { Candle, ChartRange, CompanyProfile, NewsItem, Quote, SearchResult } from "./types";
import { findCompany, getLivePrice as getMockLivePrice } from "./mock-data";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  return apiFetch<Quote | null>(`/api/finnhub/quote?symbol=${encodeURIComponent(symbol)}`);
}

export async function getQuotesBatch(symbols: string[]): Promise<Record<string, Quote>> {
  if (symbols.length === 0) return {};
  return apiFetch<Record<string, Quote>>(
    `/api/finnhub/quotes-batch?symbols=${encodeURIComponent(symbols.join(","))}`,
  );
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  return apiFetch<SearchResult[]>(`/api/finnhub/search?q=${encodeURIComponent(query)}`);
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile | null> {
  return apiFetch<CompanyProfile | null>(
    `/api/finnhub/profile?symbol=${encodeURIComponent(symbol)}`,
  );
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  return apiFetch<NewsItem[]>(`/api/finnhub/company-news?symbol=${encodeURIComponent(symbol)}`);
}

export async function getMarketNews(): Promise<NewsItem[]> {
  return apiFetch<NewsItem[]>("/api/finnhub/market-news");
}

// --- Simulated chart data (see module comment) ---

const RANGE_CONFIG: Record<ChartRange, { points: number; stepMs: number }> = {
  "1D": { points: 78, stepMs: 5 * 60 * 1000 },
  "1W": { points: 7 * 7, stepMs: 60 * 60 * 1000 },
  "1M": { points: 30, stepMs: 24 * 60 * 60 * 1000 },
  "1Y": { points: 52, stepMs: 7 * 24 * 60 * 60 * 1000 },
};

export async function getCandles(symbol: string, range: ChartRange): Promise<Candle[]> {
  const realQuote = await getQuote(symbol).catch(() => null);
  const company = findCompany(symbol);
  const anchor = realQuote?.price ?? (company ? getMockLivePrice(symbol) : 100);

  const { points, stepMs } = RANGE_CONFIG[range];
  const now = Date.now();
  let price = anchor * 0.94;
  const seed = symbol.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + range.length;
  let rngState = seed;
  const rand = () => {
    rngState = (Math.imul(rngState, 1664525) + 1013904223) | 0;
    return ((rngState >>> 0) % 1000) / 1000;
  };

  const candles: Candle[] = [];
  for (let i = points; i >= 0; i--) {
    const time = now - i * stepMs;
    const open = price;
    const volatility = anchor * 0.006;
    const close = Math.max(0.5, open + (rand() - 0.48) * volatility);
    const high = Math.max(open, close) + rand() * volatility * 0.5;
    const low = Math.min(open, close) - rand() * volatility * 0.5;
    candles.push({
      time: Math.floor(time / 1000),
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
    });
    price = close;
  }

  const offset = anchor - candles[candles.length - 1].close;
  return candles.map((c) => ({
    ...c,
    open: round2(c.open + offset),
    high: round2(c.high + offset),
    low: round2(c.low + offset),
    close: round2(c.close + offset),
  }));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
