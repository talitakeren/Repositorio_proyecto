import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { courseService } from "../services/course.service.js";

export const listCourses = asyncHandler(async (req, res) => {
  const { search, classroomType, active } = req.query;
  const items = await courseService.list({ search, classroomType, active });
  ok(res, items);
});

export const getCourse = asyncHandler(async (req, res) => {
  const item = await courseService.getById(req.params.id);
  if (!item) return fail(res, "Curso no encontrado", 404);
  ok(res, item);
});

export const createCourse = asyncHandler(async (req, res) => {
  try {
    const item = await courseService.create(req.body);
    ok(res, item, 201);
  } catch (error) {
    if (error.code === 11000) {
      return fail(res, "El código del curso ya existe", 409);
    }
    throw error;
  }
});

export const updateCourse = asyncHandler(async (req, res) => {
  try {
    const item = await courseService.update(req.params.id, req.body);
    if (!item) return fail(res, "Curso no encontrado", 404);
    ok(res, item);
  } catch (error) {
    if (error.status === 400) {
      return fail(res, error.message, 400);
    }
    if (error.code === 11000) {
      return fail(res, "El código del curso ya existe", 409);
    }
    throw error;
  }
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const item = await courseService.remove(req.params.id);
  if (!item) return fail(res, "Curso no encontrado", 404);
  ok(res, { message: "Curso desactivado", course: item });
});
