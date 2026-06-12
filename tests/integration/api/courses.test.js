import request from "supertest";
import { app, seedAdmin } from "../../setup/backend/authHelpers.js";
import {
  invalidCourseNoCode,
  validCourse,
} from "../../fixtures/backend/courses.js";

describe("API /api/courses", () => {
  test("GET / lista cursos", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST / crea curso válido → 201", async () => {
    const res = await request(app).post("/api/courses").send(validCourse);
    expect(res.status).toBe(201);
    expect(res.body.data.code).toBe("CS101");
  });

  test("POST / sin código → error validación", async () => {
    const res = await request(app).post("/api/courses").send(invalidCourseNoCode);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /:id 404 inexistente", async () => {
    const res = await request(app).get("/api/courses/507f1f77bcf86cd799439011");
    expect(res.status).toBe(404);
  });

  test("PUT /:id actualiza nombre", async () => {
    const created = await request(app)
      .post("/api/courses")
      .send({ ...validCourse, code: "UPD01" });
    const res = await request(app)
      .put(`/api/courses/${created.body.data._id}`)
      .send({ name: "Actualizado" });
    expect(res.body.data.name).toBe("Actualizado");
  });

  test("DELETE /:id desactiva curso", async () => {
    const created = await request(app)
      .post("/api/courses")
      .send({ ...validCourse, code: "DEL01" });
    const res = await request(app).delete(
      `/api/courses/${created.body.data._id}`
    );
    expect(res.body.data.course.active).toBe(false);
  });

  test("POST / código duplicado → 409", async () => {
    await request(app).post("/api/courses").send(validCourse);
    const res = await request(app).post("/api/courses").send(validCourse);
    expect(res.status).toBe(409);
  });
});

describe("API /api/classrooms — protegido ADMIN", () => {
  test("POST sin token → 401", async () => {
    const res = await request(app).post("/api/classrooms").send({
      code: "A1",
      capacity: 30,
      type: "STANDARD",
    });
    expect(res.status).toBe(401);
  });

  test("POST con admin → 201", async () => {
    await seedAdmin();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin-test@sgoha.edu", password: "123456" });
    const res = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${login.body.data.token}`)
      .send({
        code: "LAB-QA",
        capacity: 25,
        type: "LAB",
        status: "AVAILABLE",
        building: "Bloque A",
      });
    expect(res.status).toBe(201);
  });
});
