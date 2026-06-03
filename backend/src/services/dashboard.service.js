import mongoose from "mongoose";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import Schedule from "../models/Schedule.js";
import Enrollment from "../models/Enrollment.js";
import TimeSlot from "../models/TimeSlot.js";
import { scheduleEligibleEnrollmentQuery } from "../utils/scheduleEnrollment.js";

function formatActivityDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isToday) return `Hoy, ${time}`;
  if (isYesterday) return `Ayer, ${time}`;
  return d.toLocaleString("es-PE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ENROLLMENT_ACTIVITY_STATUS = {
  CONFIRMED: "Completado",
  VALIDATED: "Validada",
  VALID: "Validada",
  OBSERVED: "Observada",
  REJECTED: "Rechazada",
  INVALID: "Fallido",
  DRAFT: "En progreso",
  PENDING: "En progreso",
};

const SCHEDULE_ACTIVITY_STATUS = {
  GENERATED: "Completado",
  PARTIAL: "Parcial",
  FAILED: "Fallido",
};

export const dashboardService = {
  getSummary: async () => {
    const [
      courses,
      teachers,
      classrooms,
      students,
      schedules,
      enrollmentsConfirmed,
      enrollmentsEligible,
    ] = await Promise.all([
      Course.countDocuments({ active: true }),
      Teacher.countDocuments({ active: true }),
      Classroom.countDocuments({ active: true }),
      Student.countDocuments({ active: true }),
      Schedule.countDocuments(),
      Enrollment.countDocuments({ status: "CONFIRMED" }),
      Enrollment.countDocuments(scheduleEligibleEnrollmentQuery()),
    ]);

    return {
      courses,
      teachers,
      classrooms,
      students,
      schedules,
      enrollmentsConfirmed,
      enrollmentsEligible,
    };
  },

  getSystemStatus: async () => {
    const dbState = mongoose.connection.readyState;
    const dbLabels = {
      0: "Desconectada",
      1: "Activa",
      2: "Conectando",
      3: "Desconectando",
    };

    const [activeTimeSlots, eligibleEnrollments, activeTeachers] =
      await Promise.all([
        TimeSlot.countDocuments({ active: true }),
        Enrollment.countDocuments(scheduleEligibleEnrollmentQuery()),
        Teacher.countDocuments({
          active: true,
          "availability.0": { $exists: true },
        }),
      ]);

    const cspReady =
      dbState === 1 && activeTimeSlots > 0 && eligibleEnrollments > 0;

    return [
      {
        id: "mongodb",
        label: "MongoDB",
        status: dbLabels[dbState] || "Desconocida",
        icon: "database",
        ok: dbState === 1,
      },
      {
        id: "api",
        label: "API",
        status: "Activa",
        icon: "server",
        ok: true,
      },
      {
        id: "csp",
        label: "Motor CSP",
        status: cspReady
          ? "Listo"
          : activeTimeSlots === 0
            ? "Sin franjas activas"
            : eligibleEnrollments === 0
              ? "Sin matrículas listas"
              : "Pendiente",
        icon: "cpu",
        ok: cspReady,
        hint:
          activeTeachers > 0
            ? `${activeTeachers} docente(s) con disponibilidad`
            : "Registre disponibilidad docente",
      },
    ];
  },

  getRecentActivity: async () => {
    const items = [];

    const schedules = await Schedule.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("period status assignments generatedAt createdAt");

    for (const s of schedules) {
      const assigned = s.assignments?.length ?? 0;
      items.push({
        id: `schedule-${s._id}`,
        date: s.generatedAt || s.createdAt,
        action: `Generación de horario ${s.period} (${assigned} asignaciones)`,
        user: "Administrador",
        status: SCHEDULE_ACTIVITY_STATUS[s.status] || s.status,
      });
    }

    const enrollments = await Enrollment.find()
      .populate("student", "fullName code")
      .sort({ updatedAt: -1 })
      .limit(6);

    for (const e of enrollments) {
      items.push({
        id: `enrollment-${e._id}`,
        date: e.updatedAt,
        action: `Matrícula ${e.status?.toLowerCase() || "actualizada"} — ${e.student?.fullName || "Estudiante"}`,
        user: e.student?.fullName || "Alumno",
        status: ENROLLMENT_ACTIVITY_STATUS[e.status] || e.status,
      });
    }

    const newStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("fullName code createdAt");

    for (const st of newStudents) {
      items.push({
        id: `student-${st._id}`,
        date: st.createdAt,
        action: `Estudiante registrado: ${st.fullName} (${st.code})`,
        user: "Administrador",
        status: "Completado",
      });
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    return items.slice(0, 10).map((item) => ({
      ...item,
      date: formatActivityDate(item.date),
    }));
  },
};
