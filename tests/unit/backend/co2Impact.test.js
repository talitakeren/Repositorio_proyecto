import {
  estimateCo2Impact,
  formatCo2Report,
} from "../../utils/co2Impact.js";

describe("co2Impact — huella de carbono en QA", () => {
  test("estima CO₂ para suite de 60 segundos", () => {
    const r = estimateCo2Impact(60_000);
    expect(r.durationSec).toBe(60);
    expect(r.co2Grams).toBeGreaterThan(0);
    expect(r.energyKwh).toBeGreaterThan(0);
  });

  test("duración cero → impacto cero", () => {
    expect(estimateCo2Impact(0).co2Grams).toBe(0);
  });

  test("duración negativa lanza error", () => {
    expect(() => estimateCo2Impact(-1)).toThrow();
  });

  test("formatCo2Report genera texto legible", () => {
    expect(formatCo2Report(estimateCo2Impact(30_000))).toMatch(/CO₂/);
  });

  test("permite ajustar potencia CPU", () => {
    const r = estimateCo2Impact(3600_000, { cpuWatts: 100 });
    expect(r.co2Grams).toBeGreaterThan(0.04);
  });
});
