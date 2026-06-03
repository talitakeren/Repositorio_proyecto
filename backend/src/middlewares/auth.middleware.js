import jwt from "jsonwebtoken";
import { fail } from "../utils/apiResponse.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return fail(res, "No autorizado", 401);
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId).select("-password");
    if (!user || !user.active) {
      return fail(res, "Usuario no válido", 401);
    }

    req.user = user;
    next();
  } catch {
    return fail(res, "Token inválido o expirado", 401);
  }
};

/** Alias solicitado: proteger rutas por rol */
export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, "Sin permisos para esta acción", 403);
    }
    next();
  };

export const authorize = authorizeRoles;
