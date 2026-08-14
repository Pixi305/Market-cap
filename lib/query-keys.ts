export const queryKeys = {
  quote: (symbol: string) => ["quote", symbol] as const,
  quotesBatch: (symbols: string[]) => ["quotes-batch", ...symbols] as const,
  search: (query: string) => ["search", query] as const,
  companyProfile: (symbol: string) => ["company-profile", symbol] as const,
  candles: (symbol: string, range: string) => ["candles", symbol, range] as const,
  companyNews: (symbol: string) => ["company-news", symbol] as const,
  marketNews: () => ["market-news"] as const,
  watchlist: () => ["watchlist"] as const,
  portfolio: () => ["portfolio"] as const,
};
