import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { sanitizeAvailabilitySlots } from "../constants/timeBlocks.js";
import {
  ensureUserAccount,
  syncUserFromProfile,
} from "./accountProvision.service.js";

function buildListQuery({ search, active }) {
  const query = {};

  if (active === "true") query.active = true;
  else if (active === "false") query.active = false;

  if (search?.trim()) {
    const term = search.trim();
    query.$or = [
      { fullName: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
    ];
  }

  return query;
}

function normalizePayload(data) {
  const payload = { ...data };
  if (payload.email) payload.email = payload.email.trim().toLowerCase();
  if (payload.fullName) payload.fullName = payload.fullName.trim();
  if (payload.specialty) payload.specialty = payload.specialty.trim();
  if (payload.availableCourses) {
    payload.availableCourses = payload.availableCourses.filter(Boolean);
  }
  return payload;
}

/**
 * Populamos los datos del curso que el portal docente necesita renderizar
 * (créditos y tipo de aula requerido) además de los administrativos.
 */
const populateOpts = {
  path: "availableCourses",
  select: "code name credits classroomTypeRequired active",
};

export const teacherService = {
  list: (params = {}) =>
    Teacher.find(buildListQuery(params))
      .populate(populateOpts)
      .sort({ fullName: 1 }),

  getById: (id) => Teacher.findById(id).populate(populateOpts),

  /**
   * Crea el docente y garantiza la existencia de la cuenta `User` vinculada
   * (rol `TEACHER`). Si la cuenta no existe se crea con una contraseña
   * inicial derivada del prefijo del email; el admin podrá resetearla luego
   * desde el módulo Usuarios.
   *
   * Devuelve `{ teacher, account }`.
   */
  create: async (data) => {
    const payload = normalizePayload(data);
    let account = null;

    if (!payload.user && payload.email) {
      const seed = payload.email.split("@")[0];
      account = await ensureUserAccount({
        email: payload.email,
        name: payload.fullName,
        role: "TEACHER",
        passwordSeed: seed,
      });
      if (account.user) payload.user = account.user._id;
    }

    const created = await Teacher.create(payload);
    const populated = await Teacher.findById(created._id).populate(
      populateOpts
    );
    return {
      teacher: populated,
      account: account
        ? {
            created: account.created,
            initialPassword: account.initialPassword,
            conflictRole: account.conflictRole,
            linkedUserId: account.user?._id || null,
          }
        : null,
    };
  },

  /** Resuelve el perfil docente vinculado a un usuario autenticado. */
  getByUserId: async (userId) => {
    let teacher = await Teacher.findOne({ user: userId }).populate(populateOpts);
    if (teacher) return teacher;
    const userDoc = await User.findById(userId);
    if (!userDoc) return null;
    teacher = await Teacher.findOne({ email: userDoc.email }).populate(populateOpts);
    if (teacher && !teacher.user) {
      teacher.user = userId;
      await teacher.save();
    }
    return teacher;
  },

  update: async (id, data) => {
    const payload = normalizePayload(data);
    const updated = await Teacher.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).populate(populateOpts);
    if (!updated) return null;
    if (updated.user && (payload.fullName || payload.email)) {
      await syncUserFromProfile(updated.user, {
        name: payload.fullName,
        email: payload.email,
      });
    }
    return updated;
  },

  /** Eliminación lógica */
  remove: (id) =>
    Teacher.findByIdAndUpdate(
      id,
      { active: false },
      { new: true, runValidators: true }
    ).populate(populateOpts),

  updateAvailability: (id, availability) =>
    Teacher.findByIdAndUpdate(
      id,
      { availability: sanitizeAvailabilitySlots(availability) },
      { new: true, runValidators: true }
    ).populate(populateOpts),

  updateCourses: (id, availableCourses) =>
    Teacher.findByIdAndUpdate(
      id,
      { availableCourses: availableCourses || [] },
      { new: true, runValidators: true }
    ).populate(populateOpts),
};
