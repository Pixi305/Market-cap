import { Suspense } from "react";
import PricingClient from "./PricingClient";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      <PricingClient />
    </Suspense>
  );
}

function PricingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10 text-center space-y-2">
        <Skeleton className="h-9 w-64 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}
