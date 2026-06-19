import request from "supertest";
import { app, getAdminToken } from "../../setup/backend/authHelpers.js";

describe("API /api/schedules", () => {
  let token;

  beforeEach(async () => {
    token = await getAdminToken();
  });

  test("GET /precheck retorna diagnóstico del motor", async () => {
    const res = await request(app)
      .get("/api/schedules/precheck")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      canGenerate: expect.any(Boolean),
      summary: expect.objectContaining({
        eligibleEnrollments: expect.any(Number),
        activeTimeSlots: expect.any(Number),
      }),
      checks: expect.any(Array),
      warnings: expect.any(Array),
    });
  });

  test("GET /precheck sin matrículas → canGenerate false", async () => {
    const res = await request(app)
      .get("/api/schedules/precheck")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.data.canGenerate).toBe(false);
    expect(res.body.data.warnings.some((w) => w.includes("matrículas"))).toBe(true);
  });

  test("GET /latest sin horarios generados", async () => {
    const res = await request(app)
      .get("/api/schedules/latest")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  test("GET /precheck sin token → 401", async () => {
    const res = await request(app).get("/api/schedules/precheck");
    expect(res.status).toBe(401);
  });
});
