import {
  DAYS,
  TIME_BLOCKS,
  slotKey,
  blocksForShift,
} from "../constants/timeBlocks.js";

/** Genera todos los slots de un turno para los siete días. */
export function buildSlotsForShift(shiftId) {
  const blocks = blocksForShift(shiftId);
  return DAYS.flatMap((d) =>
    blocks.map((b) => ({
      day: d.key,
      startTime: b.startTime,
      endTime: b.endTime,
    }))
  );
}

/** Todos los slots oficiales (7 días × 18 bloques = 126). */
export function buildSlotsForFullWeek() {
  return DAYS.flatMap((d) =>
    TIME_BLOCKS.map((b) => ({
      day: d.key,
      startTime: b.startTime,
      endTime: b.endTime,
    }))
  );
}

/** Fusiona slots sin duplicar. */
export function mergeAvailabilitySlots(current = [], toAdd = []) {
  const keys = new Set(
    current.map((v) => slotKey(v.day, v.startTime, v.endTime))
  );
  const next = [...current];
  for (const s of toAdd) {
    const k = slotKey(s.day, s.startTime, s.endTime);
    if (!keys.has(k)) {
      keys.add(k);
      next.push(s);
    }
  }
  return next;
}
