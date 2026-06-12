import { validateEnrollmentPayload } from "../../../backend/src/services/enrollment.service.js";
import { courseService } from "../../../backend/src/services/course.service.js";
import Student from "../../../backend/src/models/Student.js";
import { validCourse } from "../../fixtures/backend/courses.js";
import { validStudent } from "../../fixtures/backend/students.js";

/** Crea N cursos de 4 créditos (total 20 = mínimo válido). */
async function seedCreditCourses(prefix, count = 5) {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const c = await courseService.create({
      ...validCourse,
      code: `${prefix}${i}`,
      name: `Curso ${prefix}${i}`,
      credits: 4,
    });
    courses.push(c);
  }
  return courses;
}

describe("validateEnrollmentPayload", () => {
  test("matrícula válida para estudiante nuevo (20 créditos)", async () => {
    const student = await Student.create(validStudent);
    const courses = await seedCreditCourses("NC", 5);
    const result = await validateEnrollmentPayload({
      studentId: student._id,
      courseIds: courses.map((c) => c._id),
    });
    expect(result.valid).toBe(true);
    expect(result.status).toBe("VALID");
    expect(result.totalCredits).toBe(20);
    expect(result.validationResults.newStudentPrereqsSkipped).toBe(true);
    expect(result.messages.some((m) => m.includes("Estudiante nuevo"))).toBe(true);
  });

  test("rechaza cursos duplicados", async () => {
    const student = await Student.create({ ...validStudent, code: "EST002", email: "dup@sgoha.edu" });
    const course = await courseService.create({ ...validCourse, code: "DUP01" });
    const result = await validateEnrollmentPayload({
      studentId: student._id,
      courseIds: [course._id, course._id],
    });
    expect(result.valid).toBe(false);
    expect(result.messages.some((m) => m.includes("repetidos"))).toBe(true);
  });

  test("rechaza créditos por debajo del mínimo", async () => {
    const student = await Student.create({ ...validStudent, code: "EST003", email: "min@sgoha.edu" });
    const course = await courseService.create({ ...validCourse, code: "LOW01", credits: 4 });
    const result = await validateEnrollmentPayload({
      studentId: student._id,
      courseIds: [course._id],
    });
    expect(result.valid).toBe(false);
    expect(result.messages.some((m) => m.includes("insuficientes"))).toBe(true);
  });

  test("rechaza créditos por encima del máximo", async () => {
    const student = await Student.create({ ...validStudent, code: "EST004", email: "max@sgoha.edu" });
    const courses = await seedCreditCourses("MX", 6);
    const result = await validateEnrollmentPayload({
      studentId: student._id,
      courseIds: courses.map((c) => c._id),
    });
    expect(result.valid).toBe(false);
    expect(result.messages.some((m) => m.includes("Supera"))).toBe(true);
  });

  test("estudiante inexistente → INVALID", async () => {
    const fakeId = new Student()._id;
    const result = await validateEnrollmentPayload({
      studentId: fakeId,
      courseIds: [],
    });
    expect(result.valid).toBe(false);
    expect(result.messages).toContain("Estudiante no encontrado");
  });

  test("rechaza curso ya aprobado en historial", async () => {
    const course = await courseService.create({ ...validCourse, code: "APR01" });
    const filler = await seedCreditCourses("FL", 4);
    const student = await Student.create({
      ...validStudent,
      code: "EST005",
      email: "apr@sgoha.edu",
      isNewStudent: false,
      approvedCourses: [course._id],
    });
    const result = await validateEnrollmentPayload({
      studentId: student._id,
      courseIds: [course._id, ...filler.map((c) => c._id)],
    });
    expect(result.valid).toBe(false);
    expect(result.messages.some((m) => /ya aprobó/i.test(m))).toBe(true);
  });
});
