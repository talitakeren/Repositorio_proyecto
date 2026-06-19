import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { notFound, errorHandler } from "../../../backend/src/middlewares/error.middleware.js";

describe("error.middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("notFound → 404 con ruta solicitada", () => {
    const res = mockRes();
    notFound({ method: "GET", originalUrl: "/api/inexistente" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining("/api/inexistente"),
      })
    );
  });

  test("errorHandler ValidationError → 400 con mensajes", () => {
    const res = mockRes();
    const err = new mongoose.Error.ValidationError();
    err.errors = {
      code: { message: "El código es obligatorio" },
    };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Error de validación",
        errors: ["El código es obligatorio"],
      })
    );
  });

  test("errorHandler código 11000 → 409 duplicado", () => {
    const res = mockRes();
    errorHandler({ code: 11000, message: "dup" }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Registro duplicado" })
    );
  });

  test("errorHandler CastError → 400 identificador inválido", () => {
    const res = mockRes();
    errorHandler({ name: "CastError", message: "bad id" }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Identificador inválido" })
    );
  });

  test("errorHandler err.status personalizado", () => {
    const res = mockRes();
    const err = new Error("Sin permisos");
    err.status = 403;
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Sin permisos" })
    );
  });
});
