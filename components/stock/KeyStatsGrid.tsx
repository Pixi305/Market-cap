import type { CompanyProfile, Quote } from "@/lib/finnhub/types";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/formatCurrency";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-neutral-900 tabular-nums">{value}</p>
    </div>
  );
}

export function KeyStatsGrid({
  profile,
  quote,
}: {
  profile: CompanyProfile;
  quote: Quote | null | undefined;
}) {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-medium text-neutral-500">Key statistics</h2>
      <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4">
        <Stat label="Market cap" value={formatCompactNumber(profile.marketCap)} />
        <Stat label="P/E ratio" value={profile.peRatio.toFixed(1)} />
        <Stat
          label="52-wk range"
          value={`${formatCurrency(profile.week52Low)} – ${formatCurrency(profile.week52High)}`}
        />
        <Stat label="Avg volume" value={formatCompactNumber(profile.avgVolume)} />
        <Stat label="Open" value={quote ? formatCurrency(quote.open) : "—"} />
        <Stat label="Prev close" value={quote ? formatCurrency(quote.previousClose) : "—"} />
        <Stat
          label="Day range"
          value={quote ? `${formatCurrency(quote.low)} – ${formatCurrency(quote.high)}` : "—"}
        />
        <Stat label="Industry" value={profile.industry} />
      </div>
    </Card>
  );
}
