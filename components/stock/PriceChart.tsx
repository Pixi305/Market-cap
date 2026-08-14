"use client";

import { useEffect, useRef, useState } from "react";
import { AreaSeries, createChart, ColorType, type IChartApi, type ISeriesApi } from "lightweight-charts";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCandles } from "@/hooks/useCandles";
import type { ChartRange } from "@/lib/finnhub/types";

const RANGE_OPTIONS = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "1Y", label: "1Y" },
] as const satisfies readonly { value: ChartRange; label: string }[];

export function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<ChartRange>("1D");
  const { data: candles, isLoading } = useCandles(symbol, range);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71747e",
        fontFamily: "var(--font-geist-sans)",
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "#f0f1f3" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      crosshair: { horzLine: { visible: false }, vertLine: { labelVisible: false } },
      height: 288,
      autoSize: true,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#ff5a1f",
      topColor: "rgba(255, 90, 31, 0.28)",
      bottomColor: "rgba(255, 90, 31, 0.02)",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !candles) return;
    seriesRef.current.setData(
      candles.map((c) => ({ time: c.time as never, value: c.close })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-500">Price history</h2>
        <Tabs value={range} onChange={setRange} options={RANGE_OPTIONS} />
      </div>
      <div className="relative h-72">
        {isLoading && <Skeleton className="absolute inset-0" />}
        <div ref={containerRef} className="h-full w-full" />
      </div>
      <p className="mt-2 text-xs text-neutral-400">
        Simulated history &middot; live-anchored to the current price
      </p>
    </Card>
  );
}
