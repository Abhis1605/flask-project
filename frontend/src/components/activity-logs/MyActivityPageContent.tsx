"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import ActivityLogFilters from "@/components/activity-logs/ActivityLogFilters";
import ActivityLogTimeline from "@/components/activity-logs/ActivityLogTimeline";
import { useMyActivityLogs } from "@/hooks/useActivityLogs";
import type { ActivityAction, ActivityEntityType } from "@/types/activity-log";

export default function MyActivityPageContent() {
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useMyActivityLogs({
    action: (action || undefined) as ActivityAction | undefined,
    entity_type: (entityType || undefined) as ActivityEntityType | undefined,
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
        View your own activity history.
      </p>

      <Card>
        <ActivityLogFilters
          action={action}
          onActionChange={changeFilter(setAction)}
          entityType={entityType}
          onEntityTypeChange={changeFilter(setEntityType)}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
              <ActivityLogTimeline logs={data?.items ?? []} showUser={false} />
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
