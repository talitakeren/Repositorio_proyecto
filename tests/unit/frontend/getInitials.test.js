import { getInitials } from "../../../frontend/src/utils/getInitials.js";

describe("getInitials", () => {
  test.each([
    ["", "AD"],
    ["   ", "AD"],
    ["Ana", "AN"],
    ["Ana García", "AG"],
    ["Juan Carlos Pérez López", "JL"],
  ])('getInitials("%s")', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});
