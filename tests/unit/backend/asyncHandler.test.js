import { jest } from "@jest/globals";
import { asyncHandler } from "../../../backend/src/utils/asyncHandler.js";

describe("asyncHandler", () => {
  test("ejecuta handler async y no llama next en éxito", async () => {
    const req = {};
    const res = { json: jest.fn() };
    const next = jest.fn();
    const handler = asyncHandler(async (r, re) => {
      re.json({ ok: true });
    });
    await handler(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });

  test("reenvía error rechazado a next", async () => {
    const err = new Error("fallo");
    const next = jest.fn();
    const handler = asyncHandler(async () => {
      throw err;
    });
    await handler({}, {}, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
