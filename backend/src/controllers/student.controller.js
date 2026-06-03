import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { studentService } from "../services/student.service.js";
import { enrollmentService } from "../services/enrollment.service.js";

function handleDuplicate(error, res) {
  if (error?.code !== 11000) return null;
  const field = Object.keys(error.keyPattern || {})[0];
  if (field === "code")
    return fail(res, "Ya existe un estudiante con ese código", 409);
  if (field === "email")
    return fail(res, "Ya existe un estudiante con ese correo", 409);
  return fail(res, "Estudiante duplicado", 409);
}

export const listStudents = asyncHandler(async (req, res) => {
  await enrollmentService.repairAll();
  ok(res, await studentService.list(req.query));
});

export const getStudent = asyncHandler(async (req, res) => {
  const item = await studentService.getById(req.params.id);
  if (!item) return fail(res, "Estudiante no encontrado", 404);
  ok(res, item);
});

/** Devuelve el perfil del alumno autenticado. */
export const getMyStudent = asyncHandler(async (req, res) => {
  const item = await studentService.getByUserId(req.user._id);
  if (!item) {
    return fail(
      res,
      "No hay un perfil de alumno vinculado a tu usuario. Contacta al administrador.",
      404
    );
  }
  ok(res, item);
});

export const createStudent = asyncHandler(async (req, res) => {
  try {
    const { student, account } = await studentService.create(req.body);
    // Se adjunta `_account` con la metadata de la cuenta auto-provisionada
    // (contraseña inicial visible solo en la respuesta de creación) para
    // que el admin pueda comunicarla al estudiante.
    const payload = student.toObject();
    if (account) payload._account = account;
    ok(res, payload, 201);
  } catch (error) {
    const dup = handleDuplicate(error, res);
    if (dup) return dup;
    if (error?.name === "ValidationError")
      return fail(res, error.message, 400);
    throw error;
  }
});

export const updateStudent = asyncHandler(async (req, res) => {
  try {
    const item = await studentService.update(req.params.id, req.body);
    if (!item) return fail(res, "Estudiante no encontrado", 404);
    ok(res, item);
  } catch (error) {
    const dup = handleDuplicate(error, res);
    if (dup) return dup;
    if (error?.name === "ValidationError")
      return fail(res, error.message, 400);
    throw error;
  }
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const item = await studentService.remove(req.params.id);
  if (!item) return fail(res, "Estudiante no encontrado", 404);
  ok(res, { deleted: true, student: item });
});

export const updateApprovedCourses = asyncHandler(async (req, res) => {
  const item = await studentService.updateApprovedCourses(
    req.params.id,
    req.body.approvedCourses || []
  );
  if (!item) return fail(res, "Estudiante no encontrado", 404);
  ok(res, item);
});
