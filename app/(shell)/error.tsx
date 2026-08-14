"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ShellError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="text-center">
        <p className="text-neutral-600">Something went wrong loading this page.</p>
        <Button intent="secondary" className="mt-4" onClick={reset}>
          Try again
        </Button>
      </Card>
    </div>
  );
}
