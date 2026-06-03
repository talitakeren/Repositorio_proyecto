import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { dashboardService } from "../services/dashboard.service.js";

export const getDashboardSummary = asyncHandler(async (_req, res) =>
  ok(res, await dashboardService.getSummary())
);

export const getSystemStatus = asyncHandler(async (_req, res) =>
  ok(res, await dashboardService.getSystemStatus())
);

export const getRecentActivity = asyncHandler(async (_req, res) =>
  ok(res, await dashboardService.getRecentActivity())
);
