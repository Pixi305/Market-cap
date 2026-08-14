import type { CompanyProfile, NewsItem } from "./types";

export interface MockCompany {
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
  basePrice: number;
  color: string;
}

export const MOCK_COMPANIES: MockCompany[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", industry: "Consumer Electronics", basePrice: 231.45, color: "#a3a3a3" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", industry: "Software—Infrastructure", basePrice: 468.12, color: "#00a4ef" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", industry: "Internet Content & Information", basePrice: 194.87, color: "#4285f4" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ", industry: "Internet Retail", basePrice: 228.34, color: "#ff9900" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", industry: "Semiconductors", basePrice: 178.9, color: "#76b900" },
  { symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ", industry: "Auto Manufacturers", basePrice: 342.11, color: "#e82127" },
  { symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ", industry: "Internet Content & Information", basePrice: 612.5, color: "#0866ff" },
  { symbol: "NFLX", name: "Netflix, Inc.", exchange: "NASDAQ", industry: "Entertainment", basePrice: 924.6, color: "#e50914" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", industry: "Banks—Diversified", basePrice: 251.3, color: "#5a2d81" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", industry: "Credit Services", basePrice: 318.75, color: "#1a1f71" },
  { symbol: "DIS", name: "Walt Disney Company", exchange: "NYSE", industry: "Entertainment", basePrice: 112.4, color: "#113ccf" },
  { symbol: "AMD", name: "Advanced Micro Devices, Inc.", exchange: "NASDAQ", industry: "Semiconductors", basePrice: 156.2, color: "#000000" },
];

export function findCompany(symbol: string): MockCompany | undefined {
  return MOCK_COMPANIES.find((c) => c.symbol === symbol.toUpperCase());
}

// Simple deterministic PRNG seeded by string, so each symbol gets a stable
// "personality" for its historical chart shape and stats.
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function next() {
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    return ((h >>> 0) % 1000) / 1000;
  };
}

// In-memory "live" price state so repeated quote polls drift continuously
// instead of jumping randomly on every call.
const livePrices = new Map<string, number>();

export function getLivePrice(symbol: string): number {
  const company = findCompany(symbol);
  const base = company?.basePrice ?? 100;
  if (!livePrices.has(symbol)) {
    livePrices.set(symbol, base);
  }
  const current = livePrices.get(symbol)!;
  const rand = seededRandom(symbol + Date.now().toString().slice(0, -3));
  const drift = (rand() - 0.5) * base * 0.003;
  const next = Math.max(0.5, current + drift);
  livePrices.set(symbol, next);
  return next;
}

export function getDayOpen(symbol: string): number {
  const company = findCompany(symbol);
  const base = company?.basePrice ?? 100;
  const rand = seededRandom(symbol + "-open-" + new Date().toDateString());
  return base * (1 + (rand() - 0.5) * 0.015);
}

export function buildCompanyProfile(symbol: string): CompanyProfile | null {
  const company = findCompany(symbol);
  if (!company) return null;
  const rand = seededRandom(symbol + "-profile");
  const price = company.basePrice;
  return {
    symbol: company.symbol,
    name: company.name,
    logo: "",
    exchange: company.exchange,
    industry: company.industry,
    marketCap: Math.round(price * (2_000_000_000 + rand() * 800_000_000)),
    sharesOutstanding: Math.round(2_000 + rand() * 800),
    currency: "USD",
    peRatio: Math.round((15 + rand() * 25) * 10) / 10,
    week52High: Math.round(price * (1.15 + rand() * 0.1) * 100) / 100,
    week52Low: Math.round(price * (0.7 - rand() * 0.1) * 100) / 100,
    avgVolume: Math.round(20_000_000 + rand() * 60_000_000),
  };
}

const NEWS_TEMPLATES = [
  (n: string) => `${n} shares climb as analysts raise price targets`,
  (n: string) => `${n} beats quarterly earnings expectations`,
  (n: string) => `What's next for ${n} after latest product announcement`,
  (n: string) => `${n} announces new share buyback program`,
  (n: string) => `Institutional investors increase stakes in ${n}`,
  (n: string) => `${n} faces regulatory scrutiny over recent expansion`,
  (n: string) => `Market outlook: how ${n} is navigating sector headwinds`,
  (n: string) => `${n} unveils roadmap at annual investor day`,
];

const SOURCES = ["Reuters", "Bloomberg", "MarketWatch", "CNBC", "Yahoo Finance", "Barron's"];

export function buildNews(symbol: string, count = 8): NewsItem[] {
  const company = findCompany(symbol);
  const name = company?.name ?? symbol;
  const rand = seededRandom(symbol + "-news");
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const template = NEWS_TEMPLATES[Math.floor(rand() * NEWS_TEMPLATES.length)];
    const source = SOURCES[Math.floor(rand() * SOURCES.length)];
    return {
      id: `${symbol}-news-${i}`,
      headline: template(name),
      summary: `${name} continues to be in focus among market participants this week, as trading volumes and analyst commentary point to shifting sentiment around the stock.`,
      source,
      url: "#",
      image: "",
      datetime: now - i * 1000 * 60 * 60 * (4 + Math.floor(rand() * 10)),
      related: symbol,
    };
  });
}

export function buildMarketNews(count = 12): NewsItem[] {
  const rand = seededRandom("market-news-" + new Date().toDateString());
  const now = Date.now();
  const headlines = [
    "Markets rally as inflation data comes in cooler than expected",
    "Fed signals rate path unchanged amid mixed economic signals",
    "Tech sector leads gains as megacap earnings impress",
    "Oil prices slip on demand concerns, energy stocks under pressure",
    "Treasury yields tick up ahead of key jobs report",
    "Global markets mixed as investors weigh geopolitical risk",
    "Retail sales beat forecasts, boosting consumer discretionary stocks",
    "Semiconductor stocks surge on AI demand optimism",
    "Dollar strengthens against major currencies on rate outlook",
    "Small-cap stocks outperform in broad market rotation",
    "Housing data shows signs of cooling in latest report",
    "Volatility index dips as markets stabilize after recent swings",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `market-news-${i}`,
    headline: headlines[i % headlines.length],
    summary:
      "Market watchers are parsing the latest economic data and corporate earnings for clues on where major indices head next.",
    source: SOURCES[Math.floor(rand() * SOURCES.length)],
    url: "#",
    image: "",
    datetime: now - i * 1000 * 60 * 60 * (2 + Math.floor(rand() * 6)),
    related: "",
  }));
}
