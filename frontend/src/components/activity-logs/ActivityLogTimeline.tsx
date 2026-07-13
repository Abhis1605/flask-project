import { ScrollText } from "lucide-react";

import ActivityIcon from "@/components/activity-logs/ActivityIcon";
import ActivityActionBadge from "@/components/activity-logs/ActivityActionBadge";
import type { ActivityLog } from "@/types/activity-log";
import { formatIndianDateTime } from "@/utils/date";

interface ActivityLogTimelineProps {
  logs: ActivityLog[];
  showUser?: boolean;
}

export default function ActivityLogTimeline({
  logs,
  showUser = true,
}: ActivityLogTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
        <ScrollText className="h-10 w-10" />
        <p className="text-sm">No activity found.</p>
      </div>
    );
  }

  return (
    <ul className="relative">
      {logs.map((log, index) => (
        <li key={log.id} className="relative flex gap-3 pb-6 last:pb-0">
          {index !== logs.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-px bg-slate-200 dark:bg-slate-800"
            />
          )}

          <ActivityIcon action={log.action} />

          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {log.description}
              </p>

              <ActivityActionBadge action={log.action} />
            </div>

            <p className="mt-0.5 text-xs text-slate-400">
              {showUser && log.user_name ? `${log.user_name} · ` : ""}
              {formatIndianDateTime(log.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
