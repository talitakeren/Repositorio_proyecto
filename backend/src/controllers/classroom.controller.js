import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { classroomService } from "../services/classroom.service.js";

function handleDuplicate(error, res) {
  if (error?.code === 11000) {
    return fail(res, "Ya existe un aula con ese código", 409);
  }
  return null;
}

export const listClassrooms = asyncHandler(async (req, res) =>
  ok(res, await classroomService.list(req.query))
);

export const getClassroom = asyncHandler(async (req, res) => {
  const item = await classroomService.getById(req.params.id);
  if (!item) return fail(res, "Aula no encontrada", 404);
  ok(res, item);
});

export const createClassroom = asyncHandler(async (req, res) => {
  try {
    const item = await classroomService.create(req.body);
    ok(res, item, 201);
  } catch (error) {
    const duplicated = handleDuplicate(error, res);
    if (duplicated) return duplicated;
    if (error?.name === "ValidationError") {
      return fail(res, error.message, 400);
    }
    throw error;
  }
});

export const updateClassroom = asyncHandler(async (req, res) => {
  try {
    const item = await classroomService.update(req.params.id, req.body);
    if (!item) return fail(res, "Aula no encontrada", 404);
    ok(res, item);
  } catch (error) {
    const duplicated = handleDuplicate(error, res);
    if (duplicated) return duplicated;
    if (error?.name === "ValidationError") {
      return fail(res, error.message, 400);
    }
    throw error;
  }
});

export const deleteClassroom = asyncHandler(async (req, res) => {
  const item = await classroomService.remove(req.params.id);
  if (!item) return fail(res, "Aula no encontrada", 404);
  ok(res, { deleted: true, classroom: item });
});
