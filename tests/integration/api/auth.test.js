import request from "supertest";
import { app, seedAdmin, seedStudent, seedTeacher } from "../../setup/backend/authHelpers.js";

describe("POST /api/auth/login", () => {
  beforeEach(() => seedAdmin());

  test("login válido retorna token JWT", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin-test@sgoha.edu", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe("ADMIN");
  });

  test("401 credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin-test@sgoha.edu", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/auth/me", () => {
  test("401 sin token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("200 con token válido", async () => {
    await seedTeacher();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "teacher-test@sgoha.edu", password: "123456" });
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("TEACHER");
  });
});

describe("Autorización por rol", () => {
  test("STUDENT no accede a dashboard admin", async () => {
    await seedStudent();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "student-test@sgoha.edu", password: "123456" });
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(403);
  });

  test("ADMIN accede a dashboard", async () => {
    await seedAdmin();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin-test@sgoha.edu", password: "123456" });
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(200);
  });
});
