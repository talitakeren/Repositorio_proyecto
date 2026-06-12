import request from "supertest";
import { app, getAdminToken } from "../../setup/backend/authHelpers.js";

describe("API /api/restrictions", () => {
  let token;

  beforeEach(async () => {
    token = await getAdminToken();
  });

  test("GET / retorna catálogo de restricciones", async () => {
    const res = await request(app)
      .get("/api/restrictions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalActive).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data.restrictions)).toBe(true);
  });

  test("GET /summary incluye estado del motor", async () => {
    const res = await request(app)
      .get("/api/restrictions/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      hardCount: expect.any(Number),
      totalActive: expect.any(Number),
      canGenerate: expect.any(Boolean),
    });
  });

  test("GET /precheck retorna precheck del sistema", async () => {
    const res = await request(app)
      .get("/api/restrictions/precheck")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.canGenerate).toBeDefined();
  });
});
