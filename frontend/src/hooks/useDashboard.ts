import { useQuery } from "@tanstack/react-query";

import { HomeService } from "@/services/home.service";
import type { Dashboard } from "@/types/dashboard";

export function useDashboard() {
  return useQuery<Dashboard>({
    queryKey: ["dashboard"],
    queryFn: async () => (await HomeService.getDashboard()).data,
  });
}
