import { courseService } from "../../../backend/src/services/course.service.js";
import Course from "../../../backend/src/models/Course.js";
import { validCourse } from "../../fixtures/backend/courses.js";

describe("courseService", () => {
  test("create persiste curso válido", async () => {
    const c = await courseService.create(validCourse);
    expect(c.code).toBe("CS101");
    expect(c.active).toBe(true);
  });

  test("create normaliza código a mayúsculas", async () => {
    const c = await courseService.create({ ...validCourse, code: "cs200" });
    expect(c.code).toBe("CS200");
  });

  test("list filtra por búsqueda", async () => {
    await courseService.create(validCourse);
    const items = await courseService.list({ search: "Programación" });
    expect(items.some((x) => x.code === "CS101")).toBe(true);
  });

  test("update rechaza prerrequisito circular", async () => {
    const c = await courseService.create({ ...validCourse, code: "CIR01" });
    await expect(
      courseService.update(c._id, { prerequisites: [c._id] })
    ).rejects.toMatchObject({ status: 400 });
  });

  test("remove desactiva curso", async () => {
    const c = await courseService.create({ ...validCourse, code: "DEL01" });
    const r = await courseService.remove(c._id);
    expect(r.active).toBe(false);
  });

  test("getById null si no existe", async () => {
    const fake = new Course()._id;
    expect(await courseService.getById(fake)).toBeNull();
  });
});
