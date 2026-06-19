import { validateSettings } from "../../../frontend/src/utils/settingsValidation.js";

const valid = {
  systemName: "SGOHA",
  academicPeriod: { name: "2026-I" },
  enrollmentRules: { minCredits: 20, maxCredits: 22 },
  supportEmail: "soporte@sgoha.edu",
};

describe("validateSettings", () => {
  test("formulario válido", () => {
    const r = validateSettings(valid);
    expect(r.valid).toBe(true);
  });

  test("systemName obligatorio", () => {
    expect(validateSettings({ ...valid, systemName: "" }).valid).toBe(false);
  });

  test("minCredits > maxCredits → error", () => {
    const r = validateSettings({
      ...valid,
      enrollmentRules: { minCredits: 25, maxCredits: 20 },
    });
    expect(r.valid).toBe(false);
    expect(r.errors.minCredits).toBeDefined();
  });

  test("correo soporte inválido", () => {
    const r = validateSettings({ ...valid, supportEmail: "no-email" });
    expect(r.valid).toBe(false);
  });
});
