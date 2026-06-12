import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { settingsService } from "../services/settings.service.js";

export const getSettings = asyncHandler(async (_req, res) =>
  ok(res, await settingsService.get())
);

export const updateSettings = asyncHandler(async (req, res) => {
  try {
    const data = await settingsService.update(req.body);
    return ok(res, data);
  } catch (e) {
    if (e.status === 400) {
      return fail(res, e.message, 400, e.errors);
    }
    throw e;
  }
});

export const resetSettings = asyncHandler(async (_req, res) =>
  ok(res, await settingsService.reset())
);
