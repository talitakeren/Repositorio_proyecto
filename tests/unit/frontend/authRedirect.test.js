import { getHomePathForRole } from "../../../frontend/src/utils/authRedirect.js";

describe("getHomePathForRole", () => {
  test.each([
    ["ADMIN", "/dashboard"],
    ["TEACHER", "/teacher/home"],
    ["STUDENT", "/student/home"],
  ])("rol %s → %s", (role, path) => {
    expect(getHomePathForRole(role)).toBe(path);
  });

  test("rol desconocido → /login", () => {
    expect(getHomePathForRole("X")).toBe("/login");
  });
});
