import { api } from "@/lib/axios/api";

import type {
  StockTransactionListResult,
  StockTransactionQuery,
} from "@/types/stock-transaction";

export const StockTransactionService = {
  getTransactions: (query: StockTransactionQuery) =>
    api.get<StockTransactionListResult>("/stock-transactions", {
      params: query,
    }),

  getMyTransactions: (
    query: Pick<StockTransactionQuery, "page" | "limit" | "type">
  ) =>
    api.get<StockTransactionListResult>("/stock-transactions/me", {
      params: query,
    }),
};
