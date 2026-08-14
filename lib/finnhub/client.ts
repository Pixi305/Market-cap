// Server-only Finnhub REST client. Never import this from a Client
// Component — FINNHUB_API_KEY must not reach the browser bundle. Client
// code goes through app/api/finnhub/* route handlers instead, which call
// the functions in this file.

import "server-only";
import type { CompanyProfile, NewsItem, Quote, SearchResult } from "./types";

const BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

async function finnhubFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("token", getApiKey());

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Finnhub rate limit exceeded");
    throw new Error(`Finnhub request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// Short-lived in-memory cache so overlapping components (dashboard batch,
// watchlist, a stock detail page open at once) don't each trigger their own
// upstream call for the same symbol within the same few seconds — the free
// tier's ~60 req/min limit is easy to blow through otherwise.
const CACHE_TTL_MS = 12_000;
const cache = new Map<string, { data: unknown; expiresAt: number }>();

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data as T;
  const data = await fn();
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

interface RawQuote {
  c: number;
  d: number | null;
  dp: number | null;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export async function fetchQuote(symbol: string): Promise<Quote | null> {
  return cached(`quote:${symbol}`, async () => {
    const raw = await finnhubFetch<RawQuote>("/quote", { symbol });
    if (!raw || (raw.c === 0 && raw.pc === 0)) return null;
    return {
      symbol,
      price: raw.c,
      change: raw.d ?? 0,
      changePercent: raw.dp ?? 0,
      high: raw.h,
      low: raw.l,
      open: raw.o,
      previousClose: raw.pc,
      updatedAt: new Date(raw.t * 1000).toISOString(),
    };
  });
}

interface RawSearchResult {
  count: number;
  result: { description: string; displaySymbol: string; symbol: string; type: string }[];
}

export async function fetchSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  return cached(`search:${query.toLowerCase()}`, async () => {
    const raw = await finnhubFetch<RawSearchResult>("/search", { q: query });
    return raw.result
      .filter((r) => r.type === "Common Stock" && !r.symbol.includes("."))
      .slice(0, 8)
      .map((r) => ({
        symbol: r.displaySymbol,
        name: r.description,
        type: r.type,
        exchange: "US",
      }));
  });
}

interface RawProfile {
  ticker: string;
  name: string;
  exchange: string;
  finnhubIndustry: string;
  marketCapitalization: number;
  shareOutstanding: number;
  currency: string;
  logo: string;
}

interface RawMetric {
  metric: {
    peTTM?: number;
    peBasicExclExtraTTM?: number;
    peAnnual?: number;
    "52WeekHigh"?: number;
    "52WeekLow"?: number;
    "10DayAverageTradingVolume"?: number;
  };
}

function simplifyExchange(exchange: string): string {
  const upper = exchange.toUpperCase();
  if (upper.includes("NASDAQ")) return "NASDAQ";
  if (upper.includes("NEW YORK STOCK EXCHANGE") || upper.includes("NYSE")) return "NYSE";
  return exchange;
}

export async function fetchProfile(symbol: string): Promise<CompanyProfile | null> {
  return cached(`profile:${symbol}`, async () => {
    const [profile, metric] = await Promise.all([
      finnhubFetch<RawProfile>("/stock/profile2", { symbol }),
      finnhubFetch<RawMetric>("/stock/metric", { symbol, metric: "all" }),
    ]);

    if (!profile || !profile.ticker) return null;

    const m = metric.metric ?? {};
    return {
      symbol: profile.ticker,
      name: profile.name,
      logo: profile.logo,
      exchange: simplifyExchange(profile.exchange ?? ""),
      industry: profile.finnhubIndustry,
      marketCap: (profile.marketCapitalization ?? 0) * 1_000_000,
      sharesOutstanding: profile.shareOutstanding ?? 0,
      currency: profile.currency ?? "USD",
      peRatio: m.peTTM ?? m.peBasicExclExtraTTM ?? m.peAnnual ?? 0,
      week52High: m["52WeekHigh"] ?? 0,
      week52Low: m["52WeekLow"] ?? 0,
      avgVolume: (m["10DayAverageTradingVolume"] ?? 0) * 1_000_000,
    };
  });
}

interface RawNews {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  related: string;
}

function mapNews(raw: RawNews[]): NewsItem[] {
  return raw
    .filter((n) => n.headline)
    .map((n) => ({
      id: String(n.id),
      headline: n.headline,
      summary: n.summary,
      source: n.source,
      url: n.url,
      image: n.image,
      datetime: n.datetime * 1000,
      related: n.related,
    }));
}

export async function fetchCompanyNews(symbol: string): Promise<NewsItem[]> {
  return cached(`company-news:${symbol}`, async () => {
    const to = new Date();
    const from = new Date(to.getTime() - 14 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const raw = await finnhubFetch<RawNews[]>("/company-news", {
      symbol,
      from: fmt(from),
      to: fmt(to),
    });
    return mapNews(raw).slice(0, 12);
  });
}

export async function fetchMarketNews(): Promise<NewsItem[]> {
  return cached("market-news", async () => {
    const raw = await finnhubFetch<RawNews[]>("/news", { category: "general" });
    return mapNews(raw).slice(0, 20);
  });
}
