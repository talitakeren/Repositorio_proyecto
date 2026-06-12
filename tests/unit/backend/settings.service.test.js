import { settingsService } from "../../../backend/src/services/settings.service.js";
import { DEFAULT_SETTINGS } from "../../../backend/src/constants/defaultSettings.js";

describe("settingsService", () => {
  test("get retorna configuración con reglas de horario enriquecidas", async () => {
    const settings = await settingsService.get();
    expect(settings.systemName).toBeTruthy();
    expect(settings.scheduleRules.totalWeeklySlots).toBe(126);
    expect(settings.scheduleRules.activeDays).toHaveLength(7);
  });

  test("update persiste cambios válidos", async () => {
    const updated = await settingsService.update({
      systemName: "SGOHA QA",
      academicPeriod: { name: "2026-I" },
      enrollmentRules: { minCredits: 20, maxCredits: 22 },
    });
    expect(updated.systemName).toBe("SGOHA QA");
    expect(updated.academicPeriod.name).toBe("2026-I");
  });

  test("update payload inválido → 400 con errores", async () => {
    await expect(
      settingsService.update({
        systemName: "",
        academicPeriod: { name: "" },
        enrollmentRules: { minCredits: 25, maxCredits: 20 },
        supportEmail: "correo-invalido",
      })
    ).rejects.toMatchObject({
      status: 400,
      errors: expect.objectContaining({
        systemName: expect.any(String),
        periodName: expect.any(String),
        supportEmail: expect.any(String),
      }),
    });
  });

  test("reset restaura valores por defecto", async () => {
    await settingsService.update({
      systemName: "Temporal",
      academicPeriod: { name: "2026-II" },
      enrollmentRules: { minCredits: 20, maxCredits: 22 },
    });
    const reset = await settingsService.reset();
    expect(reset.systemName).toBe(DEFAULT_SETTINGS.systemName);
    expect(reset.enrollmentRules.minCredits).toBe(DEFAULT_SETTINGS.enrollmentRules.minCredits);
  });
});
