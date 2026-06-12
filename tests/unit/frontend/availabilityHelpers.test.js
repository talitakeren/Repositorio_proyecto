import {
  buildSlotsForShift,
  buildSlotsForFullWeek,
  mergeAvailabilitySlots,
} from "../../../frontend/src/utils/availabilityHelpers.js";
import { WEEKLY_SLOT_COUNT } from "../../../frontend/src/constants/timeBlocks.js";

describe("availabilityHelpers", () => {
  test("buildSlotsForFullWeek genera 126 slots (7 días × 18 bloques)", () => {
    const slots = buildSlotsForFullWeek();
    expect(slots).toHaveLength(WEEKLY_SLOT_COUNT);
    expect(slots[0]).toMatchObject({
      day: expect.any(String),
      startTime: expect.any(String),
      endTime: expect.any(String),
    });
  });

  test("buildSlotsForShift MORNING genera slots solo de mañana", () => {
    const slots = buildSlotsForShift("MORNING");
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.startTime < "14:00")).toBe(true);
  });

  test("mergeAvailabilitySlots evita duplicados", () => {
    const existing = [{ day: "MONDAY", startTime: "07:00", endTime: "07:44" }];
    const toAdd = [
      { day: "MONDAY", startTime: "07:00", endTime: "07:44" },
      { day: "MONDAY", startTime: "07:55", endTime: "08:39" },
    ];
    const merged = mergeAvailabilitySlots(existing, toAdd);
    expect(merged).toHaveLength(2);
  });

  test("mergeAvailabilitySlots con arrays vacíos", () => {
    expect(mergeAvailabilitySlots([], [])).toEqual([]);
    expect(
      mergeAvailabilitySlots(undefined, [{ day: "TUESDAY", startTime: "14:00", endTime: "14:44" }])
    ).toHaveLength(1);
  });
});
