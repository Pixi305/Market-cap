"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MOCK_COMPANIES } from "@/lib/finnhub/mock-data";
import { usePortfolio } from "@/hooks/usePortfolio";

const schema = z.object({
  symbol: z.string().min(1, "Choose a symbol"),
  quantity: z
    .string()
    .min(1, "Required")
    .refine((v) => Number(v) > 0, "Quantity must be greater than 0"),
  avgCost: z.string().optional(),
  purchasedAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function HoldingForm({ onDone }: { onDone?: () => void }) {
  const { add } = usePortfolio();
  const [symbolQuery, setSymbolQuery] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { symbol: "", quantity: "", avgCost: "", purchasedAt: "" },
  });

  const selectedSymbol = watch("symbol");
  const matches = symbolQuery
    ? MOCK_COMPANIES.filter(
        (c) =>
          c.symbol.toLowerCase().includes(symbolQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(symbolQuery.toLowerCase()),
      ).slice(0, 5)
    : [];

  function onSubmit(values: FormValues) {
    add({
      symbol: values.symbol,
      quantity: Number(values.quantity),
      avgCost: values.avgCost ? Number(values.avgCost) : null,
      purchasedAt: values.purchasedAt || null,
    });
    reset();
    setSymbolQuery("");
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">Symbol</label>
        <Input
          value={selectedSymbol ? selectedSymbol : symbolQuery}
          onChange={(e) => {
            setValue("symbol", "");
            setSymbolQuery(e.target.value);
          }}
          placeholder="e.g. AAPL"
          error={Boolean(errors.symbol)}
        />
        {symbolQuery && !selectedSymbol && matches.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-neutral-100 bg-surface shadow-card">
            {matches.map((m) => (
              <button
                type="button"
                key={m.symbol}
                onMouseDown={() => {
                  setValue("symbol", m.symbol, { shouldValidate: true });
                  setSymbolQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50"
              >
                <span className="font-medium text-neutral-900">{m.symbol}</span>
                <span className="text-neutral-400">{m.name}</span>
              </button>
            ))}
          </div>
        )}
        {errors.symbol && <p className="text-xs text-danger-500">{errors.symbol.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Quantity</label>
          <Input type="number" step="any" {...register("quantity")} error={Boolean(errors.quantity)} />
          {errors.quantity && <p className="text-xs text-danger-500">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-neutral-700">Avg cost (optional)</label>
          <Input type="number" step="any" {...register("avgCost")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700">Purchase date (optional)</label>
        <Input type="date" {...register("purchasedAt")} />
      </div>

      <Button type="submit" intent="brand" className="w-full">
        Add holding
      </Button>
    </form>
  );
}
