const API = "http://localhost:5001/api";

export const mockAdmin = {
  id: "admin-1",
  name: "Admin Demo",
  email: "admin@sgoha.edu",
  role: "ADMIN",
};

export const mockTeacher = {
  id: "teacher-1",
  name: "Docente Demo",
  email: "docente@sgoha.edu",
  role: "TEACHER",
};

export const mockStudent = {
  id: "student-1",
  name: "Alumno Demo",
  email: "alumno@sgoha.edu",
  role: "STUDENT",
};

export const mockCourses = [
  {
    _id: "c1",
    code: "CS101",
    name: "Programación I",
    credits: 4,
    classroomTypeRequired: "STANDARD",
    active: true,
  },
];

export const mockSettings = {
  systemName: "SGOHA",
  fullName: "Sistema de Generación Óptima de Horarios Académicos",
  institutionName: "Institución Académica",
  supportEmail: "soporte@sgoha.edu",
  systemStatus: "ACTIVE",
  academicPeriod: {
    name: "2026-I",
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
  csp: { maxIterations: 1000, timeoutMs: 30000 },
};

export const mockEnrollments = [
  {
    _id: "enr1",
    status: "VALIDATED",
    totalCredits: 20,
    student: { _id: "s1", fullName: "Ana Estudiante" },
    courses: mockCourses,
  },
];

export const mockPrecheck = {
  canGenerate: false,
  summary: {
    eligibleEnrollments: 1,
    confirmedEnrollments: 0,
    coursesToSchedule: 1,
    activeTimeSlots: 126,
  },
  checks: [{ id: "enrollments", status: "ok" }],
  warnings: ["Hay matrículas sin confirmar"],
};

export { API };
