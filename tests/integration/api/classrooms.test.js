import request from "supertest";
import { app, getAdminToken } from "../../setup/backend/authHelpers.js";
import { validClassroom } from "../../fixtures/backend/classrooms.js";

describe("API /api/classrooms", () => {
  let token;

  beforeEach(async () => {
    token = await getAdminToken();
  });

  test("GET / lista aulas", async () => {
    const res = await request(app)
      .get("/api/classrooms")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST / crea aula → 201", async () => {
    const res = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validClassroom, code: "INT01" });
    expect(res.status).toBe(201);
    expect(res.body.data.code).toBe("INT01");
  });

  test("GET /:id obtiene aula creada", async () => {
    const created = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validClassroom, code: "GET01" });
    const res = await request(app)
      .get(`/api/classrooms/${created.body.data._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.code).toBe("GET01");
  });

  test("PUT /:id actualiza capacidad", async () => {
    const created = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validClassroom, code: "UPD01" });
    const res = await request(app)
      .put(`/api/classrooms/${created.body.data._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ capacity: 45 });
    expect(res.body.data.capacity).toBe(45);
  });

  test("DELETE /:id desactiva aula", async () => {
    const created = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validClassroom, code: "DEL01" });
    const res = await request(app)
      .delete(`/api/classrooms/${created.body.data._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.classroom.active).toBe(false);
  });

  test("GET / es público (no requiere token)", async () => {
    const res = await request(app).get("/api/classrooms");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
