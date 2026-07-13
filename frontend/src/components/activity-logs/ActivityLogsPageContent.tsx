"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import ActivityLogFilters from "@/components/activity-logs/ActivityLogFilters";
import ActivityLogTimeline from "@/components/activity-logs/ActivityLogTimeline";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import type { ActivityAction, ActivityEntityType } from "@/types/activity-log";

export default function ActivityLogsPageContent() {
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useActivityLogs({
    action: (action || undefined) as ActivityAction | undefined,
    entity_type: (entityType || undefined) as ActivityEntityType | undefined,
    user_id: userId ? Number(userId) : undefined,
    page,
    per_page: 10,
  });

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        View all activity across your inventory.
      </p>

      <Card>
        <ActivityLogFilters
          action={action}
          onActionChange={changeFilter(setAction)}
          entityType={entityType}
          onEntityTypeChange={changeFilter(setEntityType)}
          userId={userId}
          onUserIdChange={changeFilter(setUserId)}
          showUserFilter
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <ActivityLogTimeline logs={data?.items ?? []} />
            </div>
          )}
        </div>

        {data?.pagination && (
          <div className="mt-4">
            <Pagination
              page={data.pagination.page}
              pages={data.pagination.pages}
              total={data.pagination.total}
              perPage={data.pagination.per_page}
              hasPrev={data.pagination.has_prev}
              hasNext={data.pagination.has_next}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
