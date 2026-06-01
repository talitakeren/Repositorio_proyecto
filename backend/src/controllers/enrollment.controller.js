import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { enrollmentService } from "../services/enrollment.service.js";
import { studentService } from "../services/student.service.js";

export const listEnrollments = asyncHandler(async (_req, res) => {
  await enrollmentService.repairAll();
  ok(res, await enrollmentService.list(_req.query));
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const item = await enrollmentService.getById(req.params.id);
  if (!item) return fail(res, "Matrícula no encontrada", 404);
  ok(res, item);
});

export const createEnrollment = asyncHandler(async (req, res) => {
  const { studentId, courseIds } = req.body;
  if (!studentId || !courseIds?.length) {
    return fail(res, "Estudiante y cursos son obligatorios");
  }
  const item = await enrollmentService.create({ studentId, courseIds });
  ok(res, await enrollmentService.getById(item._id), 201);
});

export const updateEnrollment = asyncHandler(async (req, res) => {
  const item = await enrollmentService.update(req.params.id, {
    courseIds: req.body.courseIds,
  });
  if (!item) return fail(res, "Matrícula no encontrada", 404);
  ok(res, await enrollmentService.getById(item._id));
});

export const validateEnrollment = asyncHandler(async (req, res) => {
  const { studentId, courseIds } = req.body;
  const result = await enrollmentService.validate({ studentId, courseIds });
  ok(res, result);
});

export const confirmEnrollment = asyncHandler(async (req, res) => {
  try {
    const item = await enrollmentService.confirm(req.params.id);
    if (!item) return fail(res, "Matrícula no encontrada", 404);
    ok(res, await enrollmentService.getById(item._id));
  } catch (e) {
    fail(res, e.message, e.status || 400, e.details);
  }
});

/** Valida una matrícula existente por ID y actualiza estado/resultados. */
export const validateEnrollmentById = asyncHandler(async (req, res) => {
  const item = await enrollmentService.validateAndUpdate(req.params.id);
  if (!item) return fail(res, "Matrícula no encontrada", 404);
  ok(res, await enrollmentService.getById(item._id));
});

/** Rechaza matrícula por revisión administrativa. */
export const rejectEnrollment = asyncHandler(async (req, res) => {
  const item = await enrollmentService.reject(req.params.id, req.body?.reason);
  if (!item) return fail(res, "Matrícula no encontrada", 404);
  ok(res, await enrollmentService.getById(item._id));
});

/** Marca matrícula como observada por revisión administrativa. */
export const observeEnrollment = asyncHandler(async (req, res) => {
  const item = await enrollmentService.observe(req.params.id, req.body?.note);
  if (!item) return fail(res, "Matrícula no encontrada", 404);
  ok(res, await enrollmentService.getById(item._id));
});

/** Matrícula activa del alumno autenticado. */
export const getMyEnrollment = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user._id);
  if (!student) return fail(res, "Perfil de alumno no vinculado", 404);
  await enrollmentService.repairAll();
  const enrollment = await enrollmentService.getLatestByStudent(student._id);
  ok(res, { student, enrollment });
});

/** Upsert de selección de cursos del alumno autenticado (DRAFT/VALID). */
export const saveMyEnrollment = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user._id);
  if (!student) return fail(res, "Perfil de alumno no vinculado", 404);
  const courseIds = (req.body.courseIds || []).filter(Boolean);
  const enrollment = await enrollmentService.upsertDraft({
    studentId: student._id,
    courseIds,
  });
  ok(res, await enrollmentService.getById(enrollment._id));
});

/** Valida la selección del alumno autenticado sin guardarla. */
export const validateMyEnrollment = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user._id);
  if (!student) return fail(res, "Perfil de alumno no vinculado", 404);
  const result = await enrollmentService.validate({
    studentId: student._id,
    courseIds: (req.body.courseIds || []).filter(Boolean),
  });
  ok(res, result);
});

/** Confirma la última matrícula del alumno autenticado si es válida. */
export const confirmMyEnrollment = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user._id);
  if (!student) return fail(res, "Perfil de alumno no vinculado", 404);
  await enrollmentService.repairAll();
  const latest = await enrollmentService.getLatestByStudent(student._id);
  if (!latest) return fail(res, "No tienes una selección guardada", 404);
  try {
    const confirmed = await enrollmentService.confirm(latest._id);
    ok(res, await enrollmentService.getById(confirmed._id));
  } catch (e) {
    fail(res, e.message, e.status || 400, e.details);
  }
});
