import Badge from "@/components/ui/Badge";
import type { TransactionType } from "@/types/stock-transaction";

const LABELS: Record<TransactionType, string> = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT: "Adjustment",
};

const VARIANTS: Record<TransactionType, "success" | "danger" | "warning"> = {
  STOCK_IN: "success",
  STOCK_OUT: "danger",
  ADJUSTMENT: "warning",
};

export default function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return <Badge variant={VARIANTS[type]}>{LABELS[type]}</Badge>;
}
