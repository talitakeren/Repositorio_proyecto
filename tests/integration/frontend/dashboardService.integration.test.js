import { dashboardService } from "../../../frontend/src/services/dashboardService.js";
import { TOKEN_KEY } from "../../../frontend/src/config/api.js";

describe("dashboardService — MSW", () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, "mock-token-ADMIN");
  });

  test("getDashboardSummary retorna contadores", async () => {
    const summary = await dashboardService.getDashboardSummary();
    expect(summary).toMatchObject({
      courses: 5,
      teachers: 3,
      students: 10,
    });
  });

  test("getSystemStatus retorna estado operativo", async () => {
    const status = await dashboardService.getSystemStatus();
    expect(status.status).toBe("ACTIVE");
    expect(status.database).toBe("ok");
  });

  test("getRecentActivity retorna lista de eventos", async () => {
    const activity = await dashboardService.getRecentActivity();
    expect(Array.isArray(activity)).toBe(true);
    expect(activity[0].type).toBe("course");
  });
});
