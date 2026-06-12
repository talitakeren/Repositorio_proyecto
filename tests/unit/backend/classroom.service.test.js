import { classroomService } from "../../../backend/src/services/classroom.service.js";
import Classroom from "../../../backend/src/models/Classroom.js";
import { validClassroom } from "../../fixtures/backend/classrooms.js";

describe("classroomService", () => {
  test("create normaliza código a mayúsculas", async () => {
    const room = await classroomService.create({
      ...validClassroom,
      code: "lab-01",
    });
    expect(room.code).toBe("LAB-01");
  });

  test("list filtra por búsqueda de código", async () => {
    await classroomService.create({ ...validClassroom, code: "A101" });
    const items = await classroomService.list({ search: "a101" });
    expect(items.some((r) => r.code === "A101")).toBe(true);
  });

  test("list filtra por capacidad mínima", async () => {
    await classroomService.create({ ...validClassroom, code: "BIG1", capacity: 50 });
    await classroomService.create({ ...validClassroom, code: "SML1", capacity: 10 });
    const items = await classroomService.list({ capacityMin: "30" });
    expect(items.every((r) => r.capacity >= 30)).toBe(true);
  });

  test("remove desactiva aula (eliminación lógica)", async () => {
    const room = await classroomService.create({ ...validClassroom, code: "OFF1" });
    const removed = await classroomService.remove(room._id);
    expect(removed.active).toBe(false);
    expect(removed.status).toBe("INACTIVE");
  });

  test("getById null si no existe", async () => {
    const fake = new Classroom()._id;
    expect(await classroomService.getById(fake)).toBeNull();
  });
});
