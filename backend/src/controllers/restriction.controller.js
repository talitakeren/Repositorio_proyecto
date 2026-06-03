import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { restrictionService } from "../services/restriction.service.js";

export const listRestrictions = asyncHandler(async (_req, res) =>
  ok(res, restrictionService.getCatalog())
);

export const restrictionsSummary = asyncHandler(async (_req, res) =>
  ok(res, await restrictionService.getSummaryWithMotorStatus())
);

export const restrictionsPrecheck = asyncHandler(async (_req, res) =>
  ok(res, await restrictionService.getPrecheck())
);
