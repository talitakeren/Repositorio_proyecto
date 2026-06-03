import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { scheduleService } from "../services/schedule.service.js";
import { teacherService } from "../services/teacher.service.js";
import { studentService } from "../services/student.service.js";

export const generateSchedule = asyncHandler(async (req, res) => {
  const result = await scheduleService.generate(req.body?.period);
  ok(res, result, 201);
});

export const precheckSchedule = asyncHandler(async (_req, res) =>
  ok(res, await scheduleService.precheck())
);

export const latestSchedule = asyncHandler(async (_req, res) => {
  const item = await scheduleService.getLatest();
  ok(res, item);
});

export const listSchedules = asyncHandler(async (_req, res) =>
  ok(res, await scheduleService.list())
);

export const getSchedule = asyncHandler(async (req, res) => {
  const item = await scheduleService.getById(req.params.id);
  if (!item) return fail(res, "Horario no encontrado", 404);
  ok(res, item);
});

export const scheduleByStudent = asyncHandler(async (req, res) =>
  ok(res, await scheduleService.byStudent(req.params.studentId))
);

export const scheduleByTeacher = asyncHandler(async (req, res) =>
  ok(res, await scheduleService.byTeacher(req.params.teacherId))
);

export const scheduleByClassroom = asyncHandler(async (req, res) =>
  ok(res, await scheduleService.byClassroom(req.params.classroomId))
);

/** Horario del docente autenticado. */
export const myTeacherSchedule = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getByUserId(req.user._id);
  if (!teacher) return ok(res, []);
  ok(res, await scheduleService.byTeacher(teacher._id));
});

/** Horario del alumno autenticado. */
export const myStudentSchedule = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user._id);
  if (!student) return ok(res, []);
  ok(res, await scheduleService.byStudent(student._id));
});
