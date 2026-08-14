import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPercent, formatSigned } from "@/lib/utils/formatPercent";
import { cn } from "@/lib/utils/cn";

export function PriceChangeBadge({
  change,
  changePercent,
  className,
}: {
  change: number;
  changePercent: number;
  className?: string;
}) {
  const positive = change >= 0;

  return (
    <Badge intent={positive ? "success" : "danger"} className={cn(className)}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {formatSigned(change)} ({formatPercent(changePercent)})
    </Badge>
  );
}
