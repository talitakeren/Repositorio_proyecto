import { api, getData } from "../config/api.js";
import { RESTRICTIONS_CATALOG } from "../data/restrictionsCatalog.js";
import { scheduleService } from "./scheduleService.js";
import { TIME_BLOCKS, WEEKLY_SLOT_COUNT } from "../constants/timeBlocks.js";

function buildSummary(restrictions = RESTRICTIONS_CATALOG) {
  const active = restrictions.filter((r) => r.status === "ACTIVE");
  const hard = active.filter((r) => r.type === "HARD");
  const operational = active.filter((r) => r.type === "OPERATIONAL");
  return {
    totalActive: active.length,
    hardCount: hard.length,
    operationalCount: operational.length,
    restrictions: active,
    hard,
    operational,
  };
}

function mapPrecheckToPanel(precheck) {
  if (!precheck) return null;
  const s = precheck.summary || {};
  const checks = precheck.checks || [];

  const byId = Object.fromEntries(checks.map((c) => [c.id, c]));

  return {
    canGenerate: precheck.canGenerate,
    warnings: precheck.warnings || [],
    items: [
      {
        id: "enrollments",
        label: "Matrículas listas para horarios",
        message:
          byId.enrollments?.message ||
          `${s.eligibleEnrollments ?? 0} matrícula(s) (${s.confirmedEnrollments ?? 0} confirmadas)`,
        status: byId.enrollments?.status || "pending",
      },
      {
        id: "teacherAvailability",
        label: "Docentes con disponibilidad",
        message:
          byId.teacherAvailability?.message ||
          `${s.availableTeachers ?? 0} docente(s) con disponibilidad`,
        status: byId.teacherAvailability?.status || "pending",
      },
      {
        id: "courseTeachers",
        label: "Cursos con docentes asignados",
        message: byId.courseTeachers?.message || "—",
        status: byId.courseTeachers?.status || "pending",
      },
      {
        id: "courseClassrooms",
        label: "Aulas compatibles",
        message: byId.courseClassrooms?.message || "—",
        status: byId.courseClassrooms?.status || "pending",
      },
      {
        id: "timeSlots",
        label: "Franjas horarias activas",
        message:
          byId.timeSlots?.message ||
          `${s.activeTimeSlots ?? 0} franjas HORALV activas (${WEEKLY_SLOT_COUNT} esperadas)`,
        status: byId.timeSlots?.status || "pending",
      },
    ],
  };
}

export const restrictionService = {
  getRestrictions: async () => {
    try {
      const data = await api.get("/restrictions").then(getData);
      if (data?.restrictions?.length) {
        return {
          ...data,
          hard: data.hard || data.restrictions.filter((r) => r.type === "HARD"),
          operational:
            data.operational ||
            data.restrictions.filter((r) => r.type === "OPERATIONAL"),
        };
      }
    } catch {
      /* catálogo local */
    }
    return buildSummary();
  },

  getRestrictionsSummary: async () => {
    try {
      const data = await api.get("/restrictions/summary").then(getData);
      return {
        totalActive: data.totalActive,
        hardCount: data.hardCount,
        operationalCount: data.operationalCount,
        motorStatus: data.motorStatus || "Revisar datos",
        canGenerate: data.canGenerate,
      };
    } catch {
      const local = buildSummary();
      return {
        totalActive: local.totalActive,
        hardCount: local.hardCount,
        operationalCount: local.operationalCount,
        motorStatus: "Revisar datos",
        canGenerate: false,
      };
    }
  },

  getSystemPrecheck: async () => {
    try {
      const precheck = await scheduleService.getSchedulePrecheck();
      return {
        precheck: mapPrecheckToPanel(precheck),
        canGenerate: precheck?.canGenerate,
        timeBlocks: TIME_BLOCKS,
      };
    } catch {
      return {
        precheck: null,
        canGenerate: false,
        timeBlocks: TIME_BLOCKS,
      };
    }
  },
};
