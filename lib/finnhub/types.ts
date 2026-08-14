export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  updatedAt: string;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  logo: string;
  exchange: string;
  industry: string;
  marketCap: number;
  sharesOutstanding: number;
  currency: string;
  peRatio: number;
  week52High: number;
  week52Low: number;
  avgVolume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  related: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type ChartRange = "1D" | "1W" | "1M" | "1Y";
