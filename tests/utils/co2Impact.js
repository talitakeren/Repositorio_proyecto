/** Utilidad QA — estimación de impacto CO₂ en ejecución de pruebas. */
export const DEFAULT_CPU_WATTS = 65;
export const DEFAULT_CARBON_INTENSITY = 250;

export function estimateCo2Impact(durationMs, options = {}) {
  const cpuWatts = options.cpuWatts ?? DEFAULT_CPU_WATTS;
  const carbonIntensity = options.carbonIntensity ?? DEFAULT_CARBON_INTENSITY;
  if (durationMs < 0) throw new Error("durationMs debe ser >= 0");
  const hours = durationMs / 3_600_000;
  const energyKwh = (cpuWatts / 1000) * hours;
  const co2Grams = energyKwh * carbonIntensity;
  return {
    durationMs,
    durationSec: Number((durationMs / 1000).toFixed(2)),
    energyKwh: Number(energyKwh.toFixed(6)),
    co2Grams: Number(co2Grams.toFixed(4)),
    co2Mg: Number((co2Grams * 1000).toFixed(2)),
  };
}

export function formatCo2Report(impact) {
  return `Duración: ${impact.durationSec}s | Energía: ${impact.energyKwh} kWh | CO₂: ${impact.co2Grams} gCO₂e`;
}
