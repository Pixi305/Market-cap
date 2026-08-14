"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { TrendingUp, TrendingDown, Search } from "lucide-react";

const ranges = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "1Y", label: "1Y" },
] as const;

export default function UiKitPage() {
  const [range, setRange] = useState<(typeof ranges)[number]["value"]>("1D");

  return (
    <div className="min-h-screen bg-canvas p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Marketcap UI Kit</h1>

        <section className="flex flex-wrap gap-3">
          <Button intent="primary">Overview</Button>
          <Button intent="brand">Add to portfolio</Button>
          <Button intent="secondary">Request</Button>
          <Button intent="ghost">Cancel</Button>
          <Button intent="destructive">Remove</Button>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-brand-500 text-white shadow-none">
            <CardTitle className="text-white/80">Total Earnings</CardTitle>
            <p className="mt-2 text-3xl font-semibold">$950.00</p>
            <Badge intent="success" className="mt-3 bg-white/20 text-white">
              <TrendingUp size={12} /> 7% this month
            </Badge>
          </Card>

          <Card>
            <CardTitle>Portfolio Value</CardTitle>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">$689,372.00</p>
            <Badge intent="success" className="mt-3">
              <TrendingUp size={12} /> 5.2%
            </Badge>
          </Card>

          <Card>
            <CardTitle>Day Change</CardTitle>
            <p className="mt-2 text-3xl font-semibold text-danger-600">-$1,204.10</p>
            <Badge intent="danger" className="mt-3">
              <TrendingDown size={12} /> 1.8%
            </Badge>
          </Card>
        </section>

        <section className="space-y-3">
          <CardHeader>
            <h2 className="text-sm font-medium text-neutral-500">Chart range</h2>
          </CardHeader>
          <Tabs value={range} onChange={setRange} options={ranges} />
        </section>

        <section className="max-w-sm space-y-2">
          <label className="text-sm font-medium text-neutral-700">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <Input placeholder="Search symbol or company" className="pl-9" />
          </div>
        </section>

        <section className="max-w-sm space-y-2">
          <span className="text-sm font-medium text-neutral-700">Loading state</span>
          <Card className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        </section>
      </div>
    </div>
  );
}
