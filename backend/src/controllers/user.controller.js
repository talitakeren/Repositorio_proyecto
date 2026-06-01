import { asyncHandler } from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/apiResponse.js";
import { userService } from "../services/user.service.js";
import { ROLES } from "../utils/constants.js";

function handleDuplicate(error, res) {
  if (error?.code === 11000) {
    return fail(res, "Ya existe un usuario con ese correo", 409);
  }
  throw error;
}

export const listUsers = asyncHandler(async (req, res) => {
  const items = await userService.list({
    search: req.query.search,
    role: req.query.role,
    active: req.query.active,
  });
  ok(res, items);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  if (!user) return fail(res, "Usuario no encontrado", 404);
  ok(res, user);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, active } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return fail(res, "Nombre, correo y contraseña son obligatorios", 400);
  }
  if (!ROLES.includes(role)) {
    return fail(res, "Rol inválido", 400);
  }
  try {
    const user = await userService.create({ name, email, password, role, active });
    ok(res, user, 201);
  } catch (error) {
    if (error?.code === 11000) return handleDuplicate(error, res);
    if (error?.status) return fail(res, error.message, error.status);
    throw error;
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, active } = req.body;
  if (role && !ROLES.includes(role)) {
    return fail(res, "Rol inválido", 400);
  }
  try {
    const user = await userService.update(req.params.id, {
      name,
      email,
      role,
      active,
    });
    if (!user) return fail(res, "Usuario no encontrado", 404);
    ok(res, user);
  } catch (error) {
    if (error?.code === 11000) return handleDuplicate(error, res);
    throw error;
  }
});

export const toggleUser = asyncHandler(async (req, res) => {
  const user = await userService.toggleActive(req.params.id);
  if (!user) return fail(res, "Usuario no encontrado", 404);
  ok(res, user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === String(req.params.id)) {
    return fail(res, "No puedes eliminar tu propio usuario", 400);
  }
  const user = await userService.remove(req.params.id);
  if (!user) return fail(res, "Usuario no encontrado", 404);
  ok(res, { deleted: true });
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const user = await userService.resetPassword(
      req.params.id,
      req.body.password
    );
    if (!user) return fail(res, "Usuario no encontrado", 404);
    ok(res, { id: user.id, message: "Contraseña actualizada" });
  } catch (error) {
    if (error?.status) return fail(res, error.message, error.status);
    throw error;
  }
});
