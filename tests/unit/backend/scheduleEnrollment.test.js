import {
  SCHEDULE_ENROLLMENT_STATUSES,
  isScheduleEligibleEnrollment,
  scheduleEligibleEnrollmentQuery,
} from "../../../backend/src/utils/scheduleEnrollment.js";

describe("scheduleEnrollment", () => {
  test.each(["CONFIRMED", "VALIDATED", "VALID"])(
    "isScheduleEligibleEnrollment acepta status %s",
    (status) => {
      expect(isScheduleEligibleEnrollment({ status })).toBe(true);
    }
  );

  test.each(["DRAFT", "PENDING", "REJECTED", "OBSERVED"])(
    "isScheduleEligibleEnrollment rechaza status %s",
    (status) => {
      expect(isScheduleEligibleEnrollment({ status })).toBe(false);
    }
  );

  test("isScheduleEligibleEnrollment false si enrollment es null", () => {
    expect(isScheduleEligibleEnrollment(null)).toBe(false);
  });

  test("scheduleEligibleEnrollmentQuery filtra estados elegibles", () => {
    expect(scheduleEligibleEnrollmentQuery()).toEqual({
      status: { $in: SCHEDULE_ENROLLMENT_STATUSES },
    });
  });
});
