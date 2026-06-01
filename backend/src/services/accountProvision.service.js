import User from "../models/User.js";

const MIN_PASSWORD = 6;

/**
 * Construye una contraseña inicial aceptable (mín. 6 chars) a partir de
 * una semilla — normalmente el código del estudiante o el prefijo del email
 * del docente. Es legible y comunicable por el admin; el usuario podrá
 * cambiarla desde "Mi cuenta" o el admin la puede resetear desde Usuarios.
 */
function buildInitialPassword(seed, fallbackPrefix) {
  const raw = (seed || "").trim();
  if (raw.length >= MIN_PASSWORD) return raw;
  return `${fallbackPrefix}-${raw || "sgoha"}`.toLowerCase();
}

/**
 * Garantiza que exista una cuenta `User` vinculada al perfil (`Student` o
 * `Teacher`) con el `email` y `role` indicados.
 *
 *  - Si ya existe un User con ese email, lo devuelve sin tocar la contraseña.
 *    Se considera "vinculable" sólo si el rol coincide; en caso contrario el
 *    perfil no podrá vincularse a ese User (otro rol).
 *  - Si no existe, lo crea con una contraseña inicial derivada de la semilla
 *    (típicamente el código del estudiante o el prefijo del email del
 *    docente). Devuelve la contraseña inicial en `initialPassword` para que
 *    el admin pueda comunicarla.
 *
 * @returns {{
 *   user: import("mongoose").Document | null,
 *   created: boolean,
 *   initialPassword: string | null,
 *   conflictRole: string | null,
 * }}
 */
export async function ensureUserAccount({
  email,
  name,
  role,
  passwordSeed,
}) {
  if (!email || !role) {
    return { user: null, created: false, initialPassword: null, conflictRole: null };
  }
  const cleanEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: cleanEmail });
  if (existing) {
    if (existing.role !== role) {
      return {
        user: null,
        created: false,
        initialPassword: null,
        conflictRole: existing.role,
      };
    }
    return {
      user: existing,
      created: false,
      initialPassword: null,
      conflictRole: null,
    };
  }

  const fallbackPrefix = role === "STUDENT" ? "alumno" : "docente";
  const initialPassword = buildInitialPassword(passwordSeed, fallbackPrefix);

  const created = await User.create({
    name: (name || cleanEmail.split("@")[0] || "Usuario SGOHA").trim(),
    email: cleanEmail,
    password: initialPassword,
    role,
    active: true,
  });

  return {
    user: created,
    created: true,
    initialPassword,
    conflictRole: null,
  };
}

/**
 * Mantiene en sincronía el nombre/email del User vinculado cuando el admin
 * edita el perfil académico (Student/Teacher) sin romper la cuenta.
 */
export async function syncUserFromProfile(userId, { name, email }) {
  if (!userId) return null;
  const patch = {};
  if (name) patch.name = name.trim();
  if (email) patch.email = email.trim().toLowerCase();
  if (!Object.keys(patch).length) return null;
  return User.findByIdAndUpdate(userId, patch, {
    new: true,
    runValidators: true,
  });
}
