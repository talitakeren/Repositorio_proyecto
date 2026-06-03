import TimeSlot from "../models/TimeSlot.js";
import {
  buildAllTimeSlots,
  TIME_BLOCKS,
  DAYS,
  VALID_SLOT_KEYS,
  slotKey,
} from "../constants/timeBlocks.js";

function ensureValidSlot(data = {}) {
  const key = slotKey(data.day, data.startTime, data.endTime);
  if (!VALID_SLOT_KEYS.has(key)) {
    const err = new Error(
      "La franja no pertenece al catálogo oficial HORALV (día + bloque inválidos)."
    );
    err.status = 400;
    throw err;
  }
}

export const timeslotService = {
  list: (params = {}) => {
    const q = {};
    if (params.day) q.day = params.day;
    if (params.active === "true") q.active = true;
    if (params.active === "false") q.active = false;
    return TimeSlot.find(q).sort({ day: 1, startTime: 1 });
  },

  getById: (id) => TimeSlot.findById(id),

  create: (data) => {
    ensureValidSlot(data);
    return TimeSlot.create({
      ...data,
      label: data.label || `${data.day} ${data.startTime}-${data.endTime}`,
    });
  },

  update: (id, data) => {
    if (data.day && data.startTime && data.endTime) ensureValidSlot(data);
    return TimeSlot.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  remove: (id) => TimeSlot.findByIdAndDelete(id),

  /**
   * Sincroniza la BD con el catálogo oficial HORALV.
   * Crea las franjas faltantes y elimina las que no pertenecen al catálogo.
   * Devuelve un resumen de la operación.
   */
  syncOfficial: async () => {
    const expected = buildAllTimeSlots();
    const existing = await TimeSlot.find().lean();

    const existingMap = new Map(
      existing.map((s) => [slotKey(s.day, s.startTime, s.endTime), s])
    );

    const toCreate = [];
    const validKeys = new Set();

    for (const slot of expected) {
      const key = slotKey(slot.day, slot.startTime, slot.endTime);
      validKeys.add(key);
      if (!existingMap.has(key)) {
        toCreate.push({ ...slot, active: true });
      }
    }

    const toRemove = existing
      .filter((s) => !validKeys.has(slotKey(s.day, s.startTime, s.endTime)))
      .map((s) => s._id);

    if (toRemove.length) {
      await TimeSlot.deleteMany({ _id: { $in: toRemove } });
    }
    if (toCreate.length) {
      await TimeSlot.insertMany(toCreate, { ordered: false });
    }

    const total = await TimeSlot.countDocuments();
    return {
      created: toCreate.length,
      removed: toRemove.length,
      total,
      days: DAYS.length,
      blocksPerDay: TIME_BLOCKS.length,
    };
  },
};
