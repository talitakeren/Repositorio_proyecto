import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim()) {
    return fail(res, "Ingresa tu correo institucional.", 400);
  }
  if (!password) {
    return fail(res, "Ingresa tu contraseña.", 400);
  }

  try {
    const data = await authService.login({ email, password });
    res.status(200).json({
      success: true,
      message: "Inicio de sesión correcto",
      data,
    });
  } catch (error) {
    if (error.status === 401) {
      return fail(res, "Credenciales incorrectas", 401);
    }
    throw error;
  }
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user._id);
  ok(res, user);
});

/** Edita el propio nombre/correo. */
export const updateMe = asyncHandler(async (req, res) => {
  try {
    const updated = await userService.updateMyProfile(req.user._id, {
      name: req.body.name,
      email: req.body.email,
    });
    if (!updated) return fail(res, "Usuario no encontrado", 404);
    ok(res, {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return fail(res, "Ese correo ya está en uso por otro usuario", 409);
    }
    throw error;
  }
});

/** Cambia la propia contraseña validando la actual. */
export const changeMyPassword = asyncHandler(async (req, res) => {
  try {
    const updated = await userService.changeMyPassword(req.user._id, {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    if (!updated) return fail(res, "Usuario no encontrado", 404);
    ok(res, { message: "Contraseña actualizada correctamente" });
  } catch (error) {
    if (error?.status) return fail(res, error.message, error.status);
    throw error;
  }
});
