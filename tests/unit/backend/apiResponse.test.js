import { jest } from "@jest/globals";
import { ok, fail } from "../../../backend/src/utils/apiResponse.js";

describe("apiResponse", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("ok responde success true con data", () => {
    const res = mockRes();
    ok(res, { id: 1 }, 200);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
  });

  test("fail responde success false con message", () => {
    const res = mockRes();
    fail(res, "Error", 400);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error" });
  });

  test("fail incluye errors opcionales", () => {
    const res = mockRes();
    fail(res, "Validación", 422, ["email"]);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validación",
      errors: ["email"],
    });
  });
});
