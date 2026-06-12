import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";

const STATUS_PRIORITY = {
  CONFIRMED: 100,
  VALIDATED: 80,
  VALID: 70,
  OBSERVED: 40,
  PENDING: 30,
  DRAFT: 20,
  INVALID: 10,
  REJECTED: 0,
};

/** Estado visible en la ficha del estudiante (admin). */
export function mapEnrollmentToStudentStatus(enrollmentStatus) {
  switch (enrollmentStatus) {
    case "CONFIRMED":
      return "CONFIRMED";
    case "VALIDATED":
    case "VALID":
      return "VALIDATED";
    case "REJECTED":
      return "REJECTED";
    default:
      return "PENDING";
  }
}

export async function syncStudentEnrollmentStatus(studentId, enrollmentStatus) {
  if (!studentId) return;
  await Student.findByIdAndUpdate(studentId, {
    enrollmentStatus: mapEnrollmentToStudentStatus(enrollmentStatus),
  });
}

/**
 * Mantiene una sola matrícula por estudiante.
 * Conserva la de mayor prioridad de estado; ante empate, la más reciente.
 */
export async function dedupeStudentEnrollments(studentId) {
  const all = await Enrollment.find({ student: studentId }).sort({
    updatedAt: -1,
  });
  if (all.length <= 1) return all[0] || null;

  const sorted = [...all].sort((a, b) => {
    const pa = STATUS_PRIORITY[a.status] ?? 0;
    const pb = STATUS_PRIORITY[b.status] ?? 0;
    if (pb !== pa) return pb - pa;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  const keeper = sorted[0];
  const removeIds = sorted.slice(1).map((e) => e._id);
  await Enrollment.deleteMany({ _id: { $in: removeIds } });
  return keeper;
}
