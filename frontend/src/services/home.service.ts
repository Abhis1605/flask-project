import { api } from "@/lib/axios/api";

import type { ApiResponse } from "@/types/auth";
import type { Dashboard } from "@/types/dashboard";

export const HomeService = {
  getDashboard: () => api.get<ApiResponse<Dashboard>>("/home"),
};
