import { generateBasicSchedule } from "../../../backend/src/services/csp.service.js";

const slot = (day = "MONDAY", start = "07:00", end = "07:44") => ({
  _id: `${day}-${start}`,
  day,
  startTime: start,
  endTime: end,
  active: true,
});

describe("csp.service — generateBasicSchedule", () => {
  const baseTeachers = [
    {
      _id: "t1",
      active: true,
      availableCourses: [],
      availability: [slot()],
    },
  ];
  const baseClassrooms = [
    {
      _id: "r1",
      active: true,
      status: "AVAILABLE",
      type: "STANDARD",
      capacity: 40,
    },
  ];
  const baseCourse = {
    _id: "c1",
    classroomTypeRequired: "STANDARD",
    active: true,
  };

  test("asigna curso cuando hay recursos suficientes", () => {
    const result = generateBasicSchedule({
      enrollments: [
        {
          status: "CONFIRMED",
          student: { _id: "s1" },
          courses: [baseCourse],
        },
      ],
      teachers: baseTeachers,
      classrooms: baseClassrooms,
      timeSlots: [slot()],
    });
    expect(result.assignments.length).toBe(1);
    expect(result.conflicts.length).toBe(0);
    expect(result.status).toBe("GENERATED");
  });

  test("registra conflicto si no hay aula compatible", () => {
    const result = generateBasicSchedule({
      enrollments: [
        {
          status: "CONFIRMED",
          student: { _id: "s1" },
          courses: [{ ...baseCourse, classroomTypeRequired: "LAB" }],
        },
      ],
      teachers: baseTeachers,
      classrooms: baseClassrooms,
      timeSlots: [slot()],
    });
    expect(result.assignments.length).toBe(0);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  test("ignora matrículas no elegibles", () => {
    const result = generateBasicSchedule({
      enrollments: [
        {
          status: "DRAFT",
          student: { _id: "s1" },
          courses: [baseCourse],
        },
      ],
      teachers: baseTeachers,
      classrooms: baseClassrooms,
      timeSlots: [slot()],
    });
    expect(result.assignments.length).toBe(0);
  });

  test("PARTIAL cuando un curso no cabe en recursos disponibles", () => {
    const course2 = { _id: "c2", classroomTypeRequired: "STANDARD", active: true, code: "CS102" };
    const result = generateBasicSchedule({
      enrollments: [
        {
          status: "CONFIRMED",
          student: { _id: "s1" },
          courses: [baseCourse],
        },
        {
          status: "CONFIRMED",
          student: { _id: "s2" },
          courses: [course2],
        },
      ],
      teachers: baseTeachers,
      classrooms: baseClassrooms,
      timeSlots: [slot()],
    });
    expect(result.assignments.length).toBe(1);
    expect(result.conflicts.length).toBe(1);
    expect(result.status).toBe("PARTIAL");
  });

  test("ignora franjas fuera del catálogo HORALV", () => {
    const result = generateBasicSchedule({
      enrollments: [
        {
          status: "CONFIRMED",
          student: { _id: "s1" },
          courses: [baseCourse],
        },
      ],
      teachers: baseTeachers,
      classrooms: baseClassrooms,
      timeSlots: [
        {
          _id: "invalid",
          day: "MONDAY",
          startTime: "03:00",
          endTime: "03:44",
          active: true,
        },
      ],
    });
    expect(result.assignments.length).toBe(0);
    expect(result.status).toBe("FAILED");
  });
});
