import request from "supertest";
import { app, getAdminToken } from "../../setup/backend/authHelpers.js";

describe("API /api/dashboard", () => {
  let token;

  beforeEach(async () => {
    token = await getAdminToken();
  });

  test("GET /summary retorna contadores", async () => {
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      courses: expect.any(Number),
      teachers: expect.any(Number),
      students: expect.any(Number),
    });
  });

  test("GET /status retorna estado del sistema", async () => {
    const res = await request(app)
      .get("/api/dashboard/status")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((item) => item.id === "mongodb")).toBe(true);
  });

  test("GET /activity retorna actividad reciente", async () => {
    const res = await request(app)
      .get("/api/dashboard/activity")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /summary como STUDENT → 403", async () => {
    const { seedStudent, loginAs } = await import("../../setup/backend/authHelpers.js");
    await seedStudent();
    const login = await loginAs("student-test@sgoha.edu");
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${login.body.data.token}`);
    expect(res.status).toBe(403);
  });
});
