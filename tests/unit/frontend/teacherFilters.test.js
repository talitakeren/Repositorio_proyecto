import {
  matchesShiftFilter,
  computeTeacherSummary,
} from "../../../frontend/src/utils/teacherFilters.js";

describe("teacherFilters", () => {
  const morningSlot = [{ day: "MONDAY", startTime: "07:00", endTime: "07:44" }];
  const afternoonSlot = [{ day: "MONDAY", startTime: "14:00", endTime: "14:44" }];
  const nightSlot = [{ day: "MONDAY", startTime: "17:20", endTime: "18:04" }];
  const weekendSlot = [{ day: "SATURDAY", startTime: "07:00", endTime: "07:44" }];

  test.each([
    ["MORNING", morningSlot, true],
    ["MORNING", afternoonSlot, false],
    ["AFTERNOON", afternoonSlot, true],
    ["NIGHT", nightSlot, true],
    ["WEEKEND", weekendSlot, true],
    ["ALL", morningSlot, true],
  ])("matchesShiftFilter %s", (shift, availability, expected) => {
    expect(matchesShiftFilter(availability, shift)).toBe(expected);
  });

  test("matchesShiftFilter false si no hay disponibilidad", () => {
    expect(matchesShiftFilter([], "MORNING")).toBe(false);
  });

  test("computeTeacherSummary calcula totales", () => {
    const summary = computeTeacherSummary([
      {
        active: true,
        availability: morningSlot,
        availableCourses: ["c1"],
      },
      {
        active: true,
        availability: [],
        availableCourses: [],
      },
      { active: false, availability: afternoonSlot },
    ]);
    expect(summary).toEqual({
      totalActive: 2,
      totalInactive: 1,
      totalBlocks: 2,
      withoutAvailability: 1,
      withoutCourses: 1,
    });
  });
});
