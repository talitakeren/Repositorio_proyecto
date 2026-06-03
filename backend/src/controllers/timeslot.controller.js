import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { timeslotService } from "../services/timeslot.service.js";

export const listTimeSlots = asyncHandler(async (req, res) =>
  ok(res, await timeslotService.list(req.query))
);

export const getTimeSlot = asyncHandler(async (req, res) => {
  const item = await timeslotService.getById(req.params.id);
  if (!item) return fail(res, "Franja no encontrada", 404);
  ok(res, item);
});

export const createTimeSlot = asyncHandler(async (req, res) => {
  try {
    const item = await timeslotService.create(req.body);
    ok(res, item, 201);
  } catch (error) {
    if (error?.status) return fail(res, error.message, error.status);
    if (error?.code === 11000)
      return fail(res, "Esa franja ya existe en el sistema", 409);
    throw error;
  }
});

export const updateTimeSlot = asyncHandler(async (req, res) => {
  try {
    const item = await timeslotService.update(req.params.id, req.body);
    if (!item) return fail(res, "Franja no encontrada", 404);
    ok(res, item);
  } catch (error) {
    if (error?.status) return fail(res, error.message, error.status);
    throw error;
  }
});

export const deleteTimeSlot = asyncHandler(async (req, res) =>
  ok(res, { deleted: !!(await timeslotService.remove(req.params.id)) })
);

/** Reinicia/sincroniza el catálogo oficial HORALV. */
export const syncTimeSlots = asyncHandler(async (_req, res) => {
  const result = await timeslotService.syncOfficial();
  ok(res, result);
});
