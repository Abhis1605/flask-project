import { api } from "@/lib/axios/api";
import type { ApiResponse } from "@/types/auth";

import type {
  ActivityLogListResult,
  ActivityLogQuery,
} from "@/types/activity-log";

export const ActivityLogService = {
  getLogs: (query: ActivityLogQuery) =>
    api
      .get<ApiResponse<ActivityLogListResult>>("/activity-logs", {
        params: query,
      })
      .then((res) => res.data),

  getMyLogs: (
    query: Pick<ActivityLogQuery, "page" | "per_page" | "action" | "entity_type">
  ) =>
    api
      .get<ApiResponse<ActivityLogListResult>>("/activity-logs/me", {
        params: query,
      })
      .then((res) => res.data),
};
