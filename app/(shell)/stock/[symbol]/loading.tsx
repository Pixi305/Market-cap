import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StockLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-32" />
      </Card>
      <Card>
        <Skeleton className="h-72 w-full" />
      </Card>
      <Card>
        <Skeleton className="h-32 w-full" />
      </Card>
    </div>
  );
}
