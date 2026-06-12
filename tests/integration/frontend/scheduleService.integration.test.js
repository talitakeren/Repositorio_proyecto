import { scheduleService } from "../../../frontend/src/services/scheduleService.js";
import { TOKEN_KEY } from "../../../frontend/src/config/api.js";

describe("scheduleService — MSW", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, "mock-token-ADMIN");
  });

  test("getSchedulePrecheck retorna diagnóstico del motor", async () => {
    const precheck = await scheduleService.getSchedulePrecheck();
    expect(precheck.canGenerate).toBe(false);
    expect(precheck.summary.eligibleEnrollments).toBe(1);
    expect(Array.isArray(precheck.checks)).toBe(true);
  });
});
