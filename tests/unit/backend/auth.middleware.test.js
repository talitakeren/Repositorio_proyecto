import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { protect, authorizeRoles } from "../../../backend/src/middlewares/auth.middleware.js";
import { seedAdmin } from "../../setup/backend/authHelpers.js";

describe("auth.middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("protect → 401 sin Authorization", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("protect → 401 con token inválido", async () => {
    const req = { headers: { authorization: "Bearer invalido" } };
    const res = mockRes();
    await protect(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("protect adjunta usuario con token válido", async () => {
    const { user } = await seedAdmin();
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    await protect(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user.email).toBe("admin-test@sgoha.edu");
  });

  test("authorizeRoles → 403 rol incorrecto", () => {
    const res = mockRes();
    authorizeRoles("ADMIN")({ user: { role: "STUDENT" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("authorizeRoles permite rol autorizado", () => {
    const next = jest.fn();
    authorizeRoles("ADMIN")({ user: { role: "ADMIN" } }, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
