import {
  getStudentEnrollmentLabel,
  getApprovedCreditsTotal,
  isNewStudent,
} from "../../../frontend/src/utils/studentLabels.js";

describe("studentLabels", () => {
  test.each([
    ["CONFIRMED", "Confirmada"],
    ["PENDING", "Pendiente"],
    ["UNKNOWN", "UNKNOWN"],
    [null, "—"],
  ])("getStudentEnrollmentLabel(%s) → %s", (status, label) => {
    expect(getStudentEnrollmentLabel(status)).toBe(label);
  });

  test("getApprovedCreditsTotal suma créditos de objetos", () => {
    const total = getApprovedCreditsTotal([
      { credits: 4 },
      { credits: 3 },
      { credits: 5 },
    ]);
    expect(total).toBe(12);
  });

  test("getApprovedCreditsTotal ignora IDs sin poblar", () => {
    expect(getApprovedCreditsTotal(["id1", "id2"])).toBe(0);
  });

  test.each([
    [null, true],
    [{ isNewStudent: true }, true],
    [{ isNewStudent: false }, false],
    [{ approvedCourses: [] }, true],
    [{ approvedCourses: [{ credits: 4 }] }, false],
  ])("isNewStudent %#", (student, expected) => {
    expect(isNewStudent(student)).toBe(expected);
  });
});
