import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function StockNotFound() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="text-center">
        <p className="text-neutral-600">We couldn&apos;t find that symbol.</p>
        <Link href="/search" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
          Back to search
        </Link>
      </Card>
    </div>
  );
}
