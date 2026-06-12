import { api, getData } from "../config/api.js";

export const dashboardService = {
  getDashboardSummary: () =>
    api.get("/dashboard/summary").then(getData),

  getSystemStatus: () => api.get("/dashboard/status").then(getData),

  getRecentActivity: () => api.get("/dashboard/activity").then(getData),
};
