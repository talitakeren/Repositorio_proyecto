import request from "supertest";
import { app, getAdminToken } from "../../setup/backend/authHelpers.js";
import { DEFAULT_SETTINGS } from "../../../backend/src/constants/defaultSettings.js";

describe("API /api/settings", () => {
  let token;

  beforeEach(async () => {
    token = await getAdminToken();
  });

  test("GET / retorna configuración del sistema", async () => {
    const res = await request(app)
      .get("/api/settings")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.systemName).toBeTruthy();
    expect(res.body.data.scheduleRules.totalWeeklySlots).toBe(126);
  });

  test("PUT / actualiza nombre del sistema", async () => {
    const res = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        systemName: "SGOHA Integración",
        academicPeriod: { name: "2026-I" },
        enrollmentRules: { minCredits: 20, maxCredits: 22 },
      });
    expect(res.status).toBe(200);
    expect(res.body.data.systemName).toBe("SGOHA Integración");
  });

  test("PUT / payload inválido → 400", async () => {
    const res = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        systemName: "",
        academicPeriod: { name: "" },
        enrollmentRules: { minCredits: 30, maxCredits: 10 },
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /reset restaura valores por defecto", async () => {
    await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ systemName: "Temporal QA" });
    const res = await request(app)
      .post("/api/settings/reset")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.systemName).toBe(DEFAULT_SETTINGS.systemName);
  });

  test("GET / sin token → 401", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(401);
  });
});
