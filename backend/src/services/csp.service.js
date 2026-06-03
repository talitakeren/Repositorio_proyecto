/**
 * Motor CSP básico para asignación curso + docente + aula + franja.
 * Solo opera sobre franjas que pertenecen al catálogo oficial HORALV.
 */
import { VALID_SLOT_KEYS, slotKey as buildSlotKey } from "../constants/timeBlocks.js";
import { isScheduleEligibleEnrollment } from "../utils/scheduleEnrollment.js";

function slotKey(timeSlot) {
  return buildSlotKey(timeSlot.day, timeSlot.startTime, timeSlot.endTime);
}

function teacherAvailable(teacher, timeSlot) {
  return teacher.availability?.some(
    (a) =>
      a.day === timeSlot.day &&
      a.startTime === timeSlot.startTime &&
      a.endTime === timeSlot.endTime
  );
}

function teacherCanTeach(teacher, courseId) {
  if (!teacher.availableCourses?.length) return true;
  return teacher.availableCourses.some((c) => String(c._id || c) === String(courseId));
}

export function generateBasicSchedule({
  enrollments,
  teachers,
  classrooms,
  timeSlots,
}) {
  const eligible = enrollments.filter(isScheduleEligibleEnrollment);
  const courseStudents = new Map();

  for (const enr of eligible) {
    for (const course of enr.courses || []) {
      const id = String(course._id || course);
      if (!courseStudents.has(id)) courseStudents.set(id, new Set());
      courseStudents.get(id).add(String(enr.student._id || enr.student));
    }
  }

  const courseIds = [...courseStudents.keys()];
  const assignments = [];
  const conflicts = [];
  const busyTeacher = new Set();
  const busyClassroom = new Set();
  const busyStudent = new Set();

  // Solo aceptamos franjas activas y dentro del catálogo HORALV.
  const activeSlots = timeSlots.filter(
    (t) => t.active !== false && VALID_SLOT_KEYS.has(slotKey(t))
  );

  for (const courseId of courseIds) {
    const course = eligible
      .flatMap((e) => e.courses)
      .find((c) => String(c._id || c) === courseId);
    if (!course) continue;

    const studentIds = [...courseStudents.get(courseId)];
    const neededCapacity = studentIds.length;
    let assigned = false;

    for (const timeSlot of activeSlots) {
      const sk = slotKey(timeSlot);
      for (const teacher of teachers.filter((t) => t.active !== false)) {
        if (!teacherCanTeach(teacher, courseId)) continue;
        if (!teacherAvailable(teacher, timeSlot)) continue;

        const tk = `${teacher._id}|${sk}`;
        if (busyTeacher.has(tk)) continue;

        for (const classroom of classrooms.filter(
          (r) => r.active !== false && (r.status === "AVAILABLE" || !r.status)
        )) {
          if (classroom.type !== course.classroomTypeRequired) continue;
          if (classroom.capacity < neededCapacity) continue;

          const rk = `${classroom._id}|${sk}`;
          if (busyClassroom.has(rk)) continue;

          const studentConflict = studentIds.some((sid) =>
            busyStudent.has(`${sid}|${sk}`)
          );
          if (studentConflict) continue;

          assignments.push({
            course: course._id,
            teacher: teacher._id,
            classroom: classroom._id,
            timeSlot: timeSlot._id,
            students: studentIds,
          });

          busyTeacher.add(tk);
          busyClassroom.add(rk);
          studentIds.forEach((sid) => busyStudent.add(`${sid}|${sk}`));
          assigned = true;
          break;
        }
        if (assigned) break;
      }
      if (assigned) break;
    }

    if (!assigned) {
      conflicts.push({
        type: "UNASSIGNED_COURSE",
        message: `No se pudo asignar el curso ${course.code}`,
        course: course._id,
      });
    }
  }

  const status =
    conflicts.length === 0
      ? "GENERATED"
      : assignments.length > 0
        ? "PARTIAL"
        : "FAILED";

  return { assignments, conflicts, status };
}
