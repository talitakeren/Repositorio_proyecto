import { settingsService } from "../../../frontend/src/services/settingsService.js";
import { server } from "../../setup/frontend/server.js";
import { errorHandlers } from "../../setup/frontend/handlers.js";

describe("settingsService — MSW", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("getSettings retorna configuración enriquecida", async () => {
    const settings = await settingsService.getSettings();
    expect(settings.systemName).toBe("SGOHA");
    expect(settings.scheduleRules.totalWeeklySlots).toBe(126);
    expect(settings.scheduleRules.activeDays).toHaveLength(7);
  });

  test("getSettings cachea en localStorage", async () => {
    await settingsService.getSettings();
    expect(localStorage.getItem("sgoha_settings")).toBeTruthy();
  });

  test("updateSettings persiste cambios", async () => {
    const updated = await settingsService.updateSettings({
      systemName: "SGOHA QA",
    });
    expect(updated.systemName).toBe("SGOHA QA");
  });

  test("updateSettings error 400 relanza excepción", async () => {
    server.use(errorHandlers.settingsBadRequest);
    await expect(
      settingsService.updateSettings({ systemName: "" })
    ).rejects.toThrow();
  });

  test("resetSettings restaura valores", async () => {
    await settingsService.updateSettings({ systemName: "Temporal" });
    const reset = await settingsService.resetSettings();
    expect(reset.systemName).toBe("SGOHA");
  });
});
