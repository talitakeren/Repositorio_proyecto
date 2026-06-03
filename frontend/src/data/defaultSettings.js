import { DAYS, TIME_BLOCKS, WEEKLY_SLOT_COUNT } from "../constants/timeBlocks.js";

export const DEFAULT_SETTINGS = {
  systemName: "SGOHA",
  fullName: "Sistema de Generación Óptima de Horarios Académicos",
  institutionName: "Institución Académica",
  supportEmail: "soporte@sgoha.edu",
  systemStatus: "ACTIVE",
  academicPeriod: {
    name: "2024-I",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    enrollmentEnabled: true,
    scheduleGenerationEnabled: true,
  },
  enrollmentRules: {
    minCredits: 20,
    maxCredits: 22,
    validatePrerequisites: true,
    blockApprovedCourses: true,
    allowObservedEnrollment: false,
    onlyConfirmedForSchedules: true,
  },
  scheduleRules: {
    activeDays: DAYS.map((d) => d.key),
    blocksPerDay: TIME_BLOCKS.length,
    totalWeeklySlots: WEEKLY_SLOT_COUNT,
  },
  csp: {
    enabled: true,
    algorithm: "CSP_BASIC_BACKTRACKING",
  },
};
