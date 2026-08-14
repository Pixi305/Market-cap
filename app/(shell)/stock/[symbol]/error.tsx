"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function StockError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="text-center">
        <p className="text-neutral-600">Something went wrong loading this stock.</p>
        <Button intent="secondary" className="mt-4" onClick={reset}>
          Try again
        </Button>
      </Card>
    </div>
  );
}
