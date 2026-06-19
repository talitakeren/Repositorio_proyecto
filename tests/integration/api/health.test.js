import request from "supertest";
import { app } from "../../setup/backend/authHelpers.js";

describe("GET /api/health", () => {
  test("200 — API operativa", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "SGOHA API operativa",
    });
  });
});
