import { courseService } from "../../../frontend/src/services/courseService.js";
import { server } from "../../setup/frontend/server.js";
import { errorHandlers } from "../../setup/frontend/handlers.js";

describe("courseService — MSW", () => {
  test("list retorna cursos", async () => {
    const list = await courseService.list();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].code).toBe("CS101");
  });

  test("create curso", async () => {
    const c = await courseService.create({
      code: "NEW1",
      name: "Nuevo",
      credits: 3,
      classroomTypeRequired: "STANDARD",
    });
    expect(c.code).toBe("NEW1");
  });

  test("create incompleto falla", async () => {
    await expect(courseService.create({ name: "X" })).rejects.toThrow();
  });

  test("error 500", async () => {
    server.use(errorHandlers.serverError);
    await expect(courseService.list()).rejects.toThrow();
  });

  test("lista vacía", async () => {
    server.use(errorHandlers.emptyList);
    expect(await courseService.list()).toEqual([]);
  });

  test("getCourseById retorna curso", async () => {
    const course = await courseService.getCourseById("c1");
    expect(course.code).toBe("CS101");
  });

  test("updateCourse actualiza nombre", async () => {
    const updated = await courseService.updateCourse("c1", { name: "Nuevo nombre" });
    expect(updated.name).toBe("Nuevo nombre");
  });

  test("deleteCourse desactiva curso", async () => {
    const result = await courseService.deleteCourse("c1");
    expect(result.course.active).toBe(false);
  });
});
