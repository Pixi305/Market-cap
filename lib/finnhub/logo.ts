// Finnhub serves company logos from a predictable per-symbol path, so we
// can construct the URL directly without an extra profile fetch. Not every
// symbol has a logo at this URL — components using it fall back to an
// initials avatar on load error.
export function getLogoUrl(symbol: string): string {
  return `https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/${symbol.toUpperCase()}.png`;
}
