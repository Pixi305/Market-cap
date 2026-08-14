// localStorage-backed holdings used during the frontend-first build.
// Same shape the `holdings` Supabase table will have — swapping the
// read/write bodies for Supabase calls later won't change usePortfolio's
// public API.

export interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  avgCost: number | null;
  purchasedAt: string | null;
}

const STORAGE_KEY = "marketcap:portfolio";

function read(): Holding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Holding[]) : [];
  } catch {
    return [];
  }
}

function write(holdings: Holding[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
}

export async function getHoldings(): Promise<Holding[]> {
  return read();
}

export interface AddHoldingInput {
  symbol: string;
  quantity: number;
  avgCost: number | null;
  purchasedAt: string | null;
}

export async function addHolding(input: AddHoldingInput): Promise<Holding[]> {
  const current = read();
  const holding: Holding = { id: crypto.randomUUID(), ...input };
  const next = [...current, holding];
  write(next);
  return next;
}

export async function removeHolding(id: string): Promise<Holding[]> {
  const next = read().filter((h) => h.id !== id);
  write(next);
  return next;
}
