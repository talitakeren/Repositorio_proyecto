import { fail } from "../utils/apiResponse.js";

export const notFound = (req, res) => {
  fail(res, `Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, _next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return fail(res, "Error de validación", 400, messages);
  }

  if (err.code === 11000) {
    return fail(res, "Registro duplicado", 409);
  }

  if (err.name === "CastError") {
    return fail(res, "Identificador inválido", 400);
  }

  fail(res, err.message || "Error interno del servidor", err.status || 500);
};
