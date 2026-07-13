import { useQuery } from "@tanstack/react-query";

import { StockTransactionService } from "@/services/stock-transaction.service";
import type {
  StockTransactionListResult,
  StockTransactionQuery,
} from "@/types/stock-transaction";

const STOCK_TRANSACTIONS_KEY = ["stock-transactions"];
const MY_TRANSACTIONS_KEY = ["my-transactions"];

export function useStockTransactions(query: StockTransactionQuery, enabled = true) {
  return useQuery<StockTransactionListResult>({
    queryKey: [...STOCK_TRANSACTIONS_KEY, query],
    queryFn: () => StockTransactionService.getTransactions(query),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

export function useMyTransactions(
  query: Pick<StockTransactionQuery, "page" | "limit" | "type">,
  enabled = true
) {
  return useQuery<StockTransactionListResult>({
    queryKey: [...MY_TRANSACTIONS_KEY, query],
    queryFn: () => StockTransactionService.getMyTransactions(query),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}
