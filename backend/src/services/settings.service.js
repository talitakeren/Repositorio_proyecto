import Settings from "../models/Settings.js";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings.js";
import { DAYS, TIME_BLOCKS, WEEKLY_SLOT_COUNT } from "../constants/timeBlocks.js";

function enrichScheduleRules(settings) {
  return {
    ...settings,
    scheduleRules: {
      activeDays: DAYS.map((d) => d.key),
      blocksPerDay: TIME_BLOCKS.length,
      totalWeeklySlots: WEEKLY_SLOT_COUNT,
      timeBlockLabels: TIME_BLOCKS.map((b) => b.label),
    },
  };
}

function toPlain(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  const { singletonKey, _id, __v, createdAt, updatedAt, ...rest } = obj;
  return enrichScheduleRules(rest);
}

function validatePayload(body) {
  const errors = {};
  if (!body.systemName?.trim()) {
    errors.systemName = "El nombre del sistema es obligatorio.";
  }
  if (!body.academicPeriod?.name?.trim()) {
    errors.periodName = "El periodo académico es obligatorio.";
  }
  const min = Number(body.enrollmentRules?.minCredits);
  const max = Number(body.enrollmentRules?.maxCredits);
  if (!(min > 0)) errors.minCredits = "Los créditos mínimos deben ser mayores a 0.";
  if (!(max > 0)) errors.maxCredits = "Los créditos máximos deben ser mayores a 0.";
  if (min > max) {
    errors.minCredits = "No puede ser mayor que el máximo.";
    errors.maxCredits = "No puede ser menor que el mínimo.";
  }
  const email = body.supportEmail?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.supportEmail = "Correo de soporte inválido.";
  }
  return errors;
}

export const settingsService = {
  get: async () => {
    const doc = await Settings.getSingleton();
    return toPlain(doc);
  },

  update: async (payload) => {
    const errors = validatePayload(payload);
    if (Object.keys(errors).length > 0) {
      const err = new Error("Revisa los valores ingresados antes de guardar.");
      err.status = 400;
      err.errors = errors;
      throw err;
    }

    const doc = await Settings.getSingleton();
    const fields = [
      "systemName",
      "fullName",
      "institutionName",
      "supportEmail",
      "systemStatus",
      "academicPeriod",
      "enrollmentRules",
      "csp",
    ];
    for (const key of fields) {
      if (payload[key] !== undefined) doc[key] = payload[key];
    }
    await doc.save();
    return toPlain(doc);
  },

  reset: async () => {
    await Settings.deleteMany({ singletonKey: "global" });
    const doc = await Settings.create({
      singletonKey: "global",
      ...DEFAULT_SETTINGS,
    });
    return toPlain(doc);
  },
};
