// localStorage-backed watchlist used during the frontend-first build.
// Same shape (array of symbols) it will have once backed by the
// `watchlist_items` Supabase table — swapping the read/write bodies for
// Supabase calls later won't change the useWatchlist hook's public API.

const STORAGE_KEY = "marketcap:watchlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(symbols: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
}

export async function getWatchlist(): Promise<string[]> {
  return read();
}

export async function addToWatchlist(symbol: string): Promise<string[]> {
  const current = read();
  if (!current.includes(symbol)) {
    const next = [...current, symbol];
    write(next);
    return next;
  }
  return current;
}

export async function removeFromWatchlist(symbol: string): Promise<string[]> {
  const next = read().filter((s) => s !== symbol);
  write(next);
  return next;
}
