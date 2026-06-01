import Schedule from "../models/Schedule.js";
import Enrollment from "../models/Enrollment.js";
import Teacher from "../models/Teacher.js";
import Classroom from "../models/Classroom.js";
import TimeSlot from "../models/TimeSlot.js";
import Course from "../models/Course.js";
import { generateBasicSchedule } from "./csp.service.js";
import { VALID_SLOT_KEYS, slotKey as buildSlotKey } from "../constants/timeBlocks.js";
import { scheduleEligibleEnrollmentQuery } from "../utils/scheduleEnrollment.js";

function teacherCanTeach(teacher, courseId) {
  if (!teacher.availableCourses?.length) return true;
  return teacher.availableCourses.some(
    (c) => String(c._id || c) === String(courseId)
  );
}

function slotKey(timeSlot) {
  return buildSlotKey(timeSlot.day, timeSlot.startTime, timeSlot.endTime);
}

const populatePaths = [
  { path: "assignments.course" },
  { path: "assignments.teacher" },
  { path: "assignments.classroom" },
  { path: "assignments.timeSlot" },
  { path: "assignments.students" },
  { path: "conflicts.course" },
];

export const scheduleService = {
  list: () =>
    Schedule.find()
      .sort({ createdAt: -1 })
      .populate(populatePaths),

  getLatest: async () => {
    const withAssignments = await Schedule.findOne({
      assignments: { $exists: true, $not: { $size: 0 } },
    })
      .sort({ createdAt: -1 })
      .populate(populatePaths);
    if (withAssignments) return withAssignments;
    return Schedule.findOne()
      .sort({ createdAt: -1 })
      .populate(populatePaths);
  },

  getById: (id) =>
    Schedule.findById(id)
      .populate("assignments.course")
      .populate("assignments.teacher")
      .populate("assignments.classroom")
      .populate("assignments.timeSlot")
      .populate("assignments.students"),

  generate: async (period = "2026-1") => {
    const startedAt = Date.now();
    const enrollments = await Enrollment.find(scheduleEligibleEnrollmentQuery())
      .populate("student")
      .populate("courses");
    const teachers = await Teacher.find({ active: true }).populate("availableCourses");
    const classrooms = await Classroom.find({ active: true, status: "AVAILABLE" });
    const timeSlots = await TimeSlot.find({ active: true });

    const { assignments, conflicts, status } = generateBasicSchedule({
      enrollments,
      teachers,
      classrooms,
      timeSlots,
    });

    const schedule = await Schedule.create({
      period,
      assignments,
      conflicts,
      status,
      generatedAt: new Date(),
    });

    const populated = await schedule.populate(populatePaths);
    const generationMs = Date.now() - startedAt;
    const studentIds = new Set();
    for (const a of assignments) {
      for (const sid of a.students || []) studentIds.add(String(sid));
    }

    return {
      schedule: populated,
      stats: {
        coursesAssigned: assignments.length,
        teachersUsed: new Set(assignments.map((a) => String(a.teacher))).size,
        classroomsUsed: new Set(assignments.map((a) => String(a.classroom)))
          .size,
        studentsConsidered: studentIds.size,
        generationMs,
        conflictsCount: conflicts.length,
      },
    };
  },

  precheck: async () => {
    const [eligibleEnrollments, confirmedOnly, validatedOnly, validOnly] =
      await Promise.all([
        Enrollment.find(scheduleEligibleEnrollmentQuery()).populate("courses"),
        Enrollment.countDocuments({ status: "CONFIRMED" }),
        Enrollment.countDocuments({ status: "VALIDATED" }),
        Enrollment.countDocuments({ status: "VALID" }),
      ]);

    const enrollments = eligibleEnrollments;
    const teachers = await Teacher.find({ active: true }).populate(
      "availableCourses"
    );
    const classrooms = await Classroom.find({
      active: true,
      status: "AVAILABLE",
    });
    const timeSlots = await TimeSlot.find({ active: true });

    const eligibleEnrollmentsCount = enrollments.length;
    const courseStudents = new Map();

    for (const enr of enrollments) {
      for (const course of enr.courses || []) {
        const id = String(course._id || course);
        courseStudents.set(id, (courseStudents.get(id) || 0) + 1);
      }
    }

    const coursesToSchedule = courseStudents.size;
    const courseIds = [...courseStudents.keys()];

    const activeTimeSlots = timeSlots.filter(
      (t) => t.active !== false && VALID_SLOT_KEYS.has(slotKey(t))
    );

    const teachersWithAvailability = teachers.filter(
      (t) => (t.availability?.length ?? 0) > 0
    );

    const teachersForProgram = teachersWithAvailability.filter((t) =>
      courseIds.some((cid) => teacherCanTeach(t, cid))
    );

    const availableClassrooms = classrooms.filter((c) => c.capacity > 0);

    const warnings = [];
    let coursesWithoutTeacher = 0;
    let coursesWithoutClassroom = 0;

    for (const courseId of courseIds) {
      const course =
        enrollments
          .flatMap((e) => e.courses || [])
          .find((c) => String(c._id || c) === courseId) ||
        (await Course.findById(courseId));
      if (!course) continue;

      const needed = courseStudents.get(courseId) || 0;
      const hasTeacher = teachers.some(
        (t) =>
          teacherCanTeach(t, courseId) && (t.availability?.length ?? 0) > 0
      );
      if (!hasTeacher) {
        coursesWithoutTeacher += 1;
        warnings.push(
          `El curso ${course.name || course.code} no tiene docentes habilitados con disponibilidad registrada.`
        );
      }

      const hasRoom = availableClassrooms.some(
        (r) =>
          r.type === course.classroomTypeRequired && r.capacity >= needed
      );
      if (!hasRoom) {
        coursesWithoutClassroom += 1;
        warnings.push(
          `El curso ${course.name || course.code} requiere aula tipo ${course.classroomTypeRequired} con capacidad ≥ ${needed}, pero no hay opciones disponibles.`
        );
      }
    }

  const pendingEnrollmentCount = await Enrollment.countDocuments({
      status: { $in: ["PENDING", "DRAFT", "OBSERVED"] },
    });

    if (eligibleEnrollmentsCount === 0) {
      warnings.push(
        "No hay matrículas listas para horarios (confirmadas, validadas o válidas). Revise el módulo Matrícula."
      );
    } else if (confirmedOnly === 0 && (validatedOnly > 0 || validOnly > 0)) {
      warnings.push(
        `Hay ${validatedOnly + validOnly} matrícula(s) validada(s) sin confirmar. Puede generar el horario o confirmarlas en Matrícula.`
      );
    }
    if (pendingEnrollmentCount > 0) {
      warnings.push(
        `${pendingEnrollmentCount} matrícula(s) aún en borrador/pendiente no se incluirán en la generación.`
      );
    }
    if (activeTimeSlots.length === 0) {
      warnings.push("No hay franjas horarias oficiales HORALV activas.");
    }

    const checks = [
      {
        id: "enrollments",
        label: "Matrículas listas para horarios",
        message:
          eligibleEnrollmentsCount > 0
            ? `${eligibleEnrollmentsCount} matrícula(s) (${confirmedOnly} confirmadas, ${validatedOnly} validadas, ${validOnly} válidas legado)`
            : "No hay matrículas confirmadas, validadas ni válidas",
        status: eligibleEnrollmentsCount > 0 ? "ok" : "error",
      },
      {
        id: "courseTeachers",
        label: "Cursos con docentes asignados",
        message:
          coursesToSchedule === 0
            ? "Sin cursos en matrículas listas"
            : coursesWithoutTeacher === 0
              ? "Todos los cursos tienen docente habilitado"
              : `${coursesWithoutTeacher} curso(s) sin docente habilitado`,
        status:
          coursesToSchedule === 0
            ? "pending"
            : coursesWithoutTeacher === 0
              ? "ok"
              : "warning",
      },
      {
        id: "courseClassrooms",
        label: "Cursos con aulas compatibles",
        message:
          coursesToSchedule === 0
            ? "Sin cursos en matrículas listas"
            : coursesWithoutClassroom === 0
              ? "Todos los cursos tienen aula compatible"
              : `${coursesWithoutClassroom} curso(s) sin aula compatible`,
        status:
          coursesToSchedule === 0
            ? "pending"
            : coursesWithoutClassroom === 0
              ? "ok"
              : "warning",
      },
      {
        id: "timeSlots",
        label: "Franjas horarias activas",
        message:
          activeTimeSlots.length > 0
            ? `${activeTimeSlots.length} franjas HORALV activas`
            : "No hay franjas oficiales activas",
        status: activeTimeSlots.length > 0 ? "ok" : "error",
      },
      {
        id: "teacherAvailability",
        label: "Disponibilidad docente registrada",
        message:
          teachersWithAvailability.length > 0
            ? `${teachersWithAvailability.length} docente(s) con disponibilidad`
            : "Ningún docente tiene disponibilidad registrada",
        status:
          teachersWithAvailability.length > 0 ? "ok" : "warning",
      },
    ];

    const canGenerate =
      eligibleEnrollmentsCount > 0 &&
      coursesToSchedule > 0 &&
      activeTimeSlots.length > 0;

    return {
      summary: {
        confirmedEnrollments: confirmedOnly,
        eligibleEnrollments: eligibleEnrollmentsCount,
        validatedEnrollments: validatedOnly,
        coursesToSchedule,
        availableTeachers:
          coursesToSchedule > 0
            ? teachersForProgram.length
            : teachersWithAvailability.length,
        availableClassrooms: availableClassrooms.length,
        activeTimeSlots: activeTimeSlots.length,
        totalClassroomsActive: await Classroom.countDocuments({
          active: true,
          status: "AVAILABLE",
        }),
        totalTeachersActive: await Teacher.countDocuments({ active: true }),
      },
      checks,
      warnings,
      canGenerate,
    };
  },

  byStudent: async (studentId) => {
    const schedule = await scheduleService.getLatest();
    if (!schedule) return [];
    return schedule.assignments.filter((a) =>
      (a.students || []).some(
        (st) => String(st._id || st) === String(studentId)
      )
    );
  },

  byTeacher: async (teacherId) => {
    const schedule = await scheduleService.getLatest();
    if (!schedule) return [];
    return schedule.assignments.filter(
      (a) => String(a.teacher?._id || a.teacher) === String(teacherId)
    );
  },

  byClassroom: async (classroomId) => {
    const schedule = await scheduleService.getLatest();
    if (!schedule) return [];
    return schedule.assignments.filter(
      (a) => String(a.classroom?._id || a.classroom) === String(classroomId)
    );
  },
};
