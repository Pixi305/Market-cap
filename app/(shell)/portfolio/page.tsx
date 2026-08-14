"use client";

import { useState } from "react";
import { Briefcase, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HoldingForm } from "@/components/portfolio/HoldingForm";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useQuotesBatch } from "@/hooks/useQuote";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { PriceChangeBadge } from "@/components/stock/PriceChangeBadge";

export default function PortfolioPage() {
  const { holdings, isLoading, remove } = usePortfolio();
  const symbols = holdings.map((h) => h.symbol);
  const { data: quotes } = useQuotesBatch(symbols);
  const [showForm, setShowForm] = useState(false);

  const totalValue = holdings.reduce((sum, h) => {
    const price = quotes?.[h.symbol]?.price;
    return price ? sum + price * h.quantity : sum;
  }, 0);

  const totalCost = holdings.reduce((sum, h) => {
    return h.avgCost != null ? sum + h.avgCost * h.quantity : sum;
  }, 0);

  const totalGain = totalCost > 0 ? totalValue - totalCost : null;
  const totalGainPercent = totalGain != null && totalCost > 0 ? (totalGain / totalCost) * 100 : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Portfolio</h1>
        <Button intent="brand" size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add holding"}
        </Button>
      </div>

      {holdings.length > 0 && (
        <Card className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs font-medium text-neutral-400">Total value</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900 tabular-nums">
              {formatCurrency(totalValue)}
            </p>
          </div>
          {totalGain != null && totalGainPercent != null && (
            <div>
              <p className="text-xs font-medium text-neutral-400">Total gain/loss</p>
              <div className="mt-1.5">
                <PriceChangeBadge change={totalGain} changePercent={totalGainPercent} />
              </div>
            </div>
          )}
        </Card>
      )}

      {showForm && (
        <Card>
          <HoldingForm onDone={() => setShowForm(false)} />
        </Card>
      )}

      <Card>
        {isLoading ? null : holdings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Briefcase className="text-neutral-300" size={28} />
            <p className="text-sm text-neutral-500">You have no holdings yet.</p>
            <Button intent="secondary" size="sm" className="mt-2" onClick={() => setShowForm(true)}>
              Add your first holding
            </Button>
          </div>
        ) : (
          <HoldingsTable holdings={holdings} quotes={quotes} onRemove={remove} />
        )}
      </Card>
    </div>
  );
}
