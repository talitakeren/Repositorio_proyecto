import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { teacherService } from "../services/teacher.service.js";

export const listTeachers = asyncHandler(async (req, res) => {
  const { search, active } = req.query;
  ok(res, await teacherService.list({ search, active }));
});

export const getTeacher = asyncHandler(async (req, res) => {
  const item = await teacherService.getById(req.params.id);
  if (!item) return fail(res, "Docente no encontrado", 404);
  ok(res, item);
});

/** Devuelve el perfil docente del usuario autenticado. */
export const getMyTeacher = asyncHandler(async (req, res) => {
  const item = await teacherService.getByUserId(req.user._id);
  if (!item) {
    return fail(
      res,
      "No hay un perfil docente vinculado a tu usuario. Contacta al administrador.",
      404
    );
  }
  ok(res, item);
});

export const updateMyAvailability = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getByUserId(req.user._id);
  if (!teacher) return fail(res, "Perfil docente no encontrado", 404);
  const updated = await teacherService.updateAvailability(
    teacher._id,
    req.body.availability || []
  );
  ok(res, updated);
});

export const createTeacher = asyncHandler(async (req, res) => {
  try {
    const { teacher, account } = await teacherService.create(req.body);
    const payload = teacher.toObject();
    if (account) payload._account = account;
    ok(res, payload, 201);
  } catch (error) {
    if (error.code === 11000) {
      return fail(res, "El correo institucional ya está registrado", 409);
    }
    throw error;
  }
});

export const updateTeacher = asyncHandler(async (req, res) => {
  try {
    const item = await teacherService.update(req.params.id, req.body);
    if (!item) return fail(res, "Docente no encontrado", 404);
    ok(res, item);
  } catch (error) {
    if (error.code === 11000) {
      return fail(res, "El correo institucional ya está registrado", 409);
    }
    throw error;
  }
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const item = await teacherService.remove(req.params.id);
  if (!item) return fail(res, "Docente no encontrado", 404);
  ok(res, { message: "Docente desactivado", teacher: item });
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const item = await teacherService.updateAvailability(
    req.params.id,
    req.body.availability || []
  );
  if (!item) return fail(res, "Docente no encontrado", 404);
  ok(res, item);
});

export const updateTeacherCourses = asyncHandler(async (req, res) => {
  const item = await teacherService.updateCourses(
    req.params.id,
    req.body.availableCourses || []
  );
  if (!item) return fail(res, "Docente no encontrado", 404);
  ok(res, item);
});
