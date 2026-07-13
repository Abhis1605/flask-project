import { useQuery } from "@tanstack/react-query";

import { ActivityLogService } from "@/services/activity-log.service";
import type {
  ActivityLogListResult,
  ActivityLogQuery,
} from "@/types/activity-log";

const ACTIVITY_LOGS_KEY = ["activity-logs"];
const MY_ACTIVITY_LOGS_KEY = ["my-activity-logs"];

export function useActivityLogs(query: ActivityLogQuery, enabled = true) {
  return useQuery<ActivityLogListResult>({
    queryKey: [...ACTIVITY_LOGS_KEY, query],
    queryFn: () => ActivityLogService.getLogs(query),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

export function useMyActivityLogs(
  query: Pick<ActivityLogQuery, "page" | "per_page" | "action" | "entity_type">,
  enabled = true
) {
  return useQuery<ActivityLogListResult>({
    queryKey: [...MY_ACTIVITY_LOGS_KEY, query],
    queryFn: () => ActivityLogService.getMyLogs(query),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}
