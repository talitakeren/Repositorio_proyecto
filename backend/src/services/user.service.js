import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

/**
 * Devuelve un objeto público sin password.
 */
const toPublic = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

function buildListQuery({ search, role, active }) {
  const q = {};
  if (role && role !== "ALL") q.role = role;
  if (active === "true") q.active = true;
  else if (active === "false") q.active = false;
  if (search?.trim()) {
    const term = search.trim();
    q.$or = [
      { name: { $regex: term, $options: "i" } },
      { email: { $regex: term, $options: "i" } },
    ];
  }
  return q;
}

function normalize(data = {}) {
  const payload = { ...data };
  if (payload.email) payload.email = payload.email.trim().toLowerCase();
  if (payload.name) payload.name = payload.name.trim();
  return payload;
}

/** Asegura que exista (y se vincule) un perfil Teacher/Student según rol. */
async function ensureProfileFor(user) {
  if (user.role === "TEACHER") {
    let teacher = await Teacher.findOne({
      $or: [{ user: user._id }, { email: user.email }],
    });
    if (!teacher) {
      teacher = await Teacher.create({
        fullName: user.name,
        email: user.email,
        specialty: "Por definir",
        user: user._id,
      });
    } else if (!teacher.user) {
      teacher.user = user._id;
      await teacher.save();
    }
    return teacher;
  }
  if (user.role === "STUDENT") {
    let student = await Student.findOne({
      $or: [{ user: user._id }, { email: user.email }],
    });
    if (!student) {
      const code = await generateStudentCode();
      student = await Student.create({
        code,
        fullName: user.name,
        email: user.email,
        user: user._id,
      });
    } else if (!student.user) {
      student.user = user._id;
      await student.save();
    }
    return student;
  }
  return null;
}

/** Genera un código de alumno único tipo AL2026NNN. */
async function generateStudentCode() {
  const year = new Date().getFullYear();
  const base = `AL${year}`;
  const last = await Student.findOne({ code: { $regex: `^${base}` } })
    .sort({ code: -1 })
    .lean();
  const lastNum = last?.code ? parseInt(last.code.slice(base.length), 10) || 0 : 0;
  return `${base}${String(lastNum + 1).padStart(3, "0")}`;
}

export const userService = {
  list: async (params = {}) => {
    const items = await User.find(buildListQuery(params))
      .sort({ createdAt: -1 })
      .lean();
    return items.map((u) => ({ ...toPublic(u), _id: u._id }));
  },

  getById: async (id) => {
    const user = await User.findById(id);
    return user ? toPublic(user) : null;
  },

  create: async (data) => {
    const payload = normalize(data);
    if (!payload.password || payload.password.length < 6) {
      const err = new Error("La contraseña debe tener al menos 6 caracteres");
      err.status = 400;
      throw err;
    }
    const user = await User.create(payload);
    await ensureProfileFor(user);
    return toPublic(user);
  },

  update: async (id, data) => {
    const payload = normalize(data);
    delete payload.password; // password no se cambia por aquí
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) return null;
    await ensureProfileFor(user);
    return toPublic(user);
  },

  toggleActive: async (id) => {
    const user = await User.findById(id);
    if (!user) return null;
    user.active = !user.active;
    await user.save();
    return toPublic(user);
  },

  remove: async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) return null;
    // Soltamos el vínculo en perfiles relacionados sin borrarlos.
    await Teacher.updateOne({ user: id }, { $unset: { user: 1 } });
    await Student.updateOne({ user: id }, { $unset: { user: 1 } });
    return toPublic(user);
  },

  resetPassword: async (id, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      const err = new Error("La contraseña debe tener al menos 6 caracteres");
      err.status = 400;
      throw err;
    }
    const user = await User.findById(id).select("+password");
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return toPublic(user);
  },

  /** Edita el perfil del usuario autenticado. */
  updateMyProfile: async (userId, data) => {
    const payload = normalize(data);
    delete payload.role;
    delete payload.active;
    delete payload.password;
    const user = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });
    if (!user) return null;
    // Mantenemos el email del perfil académico en sincronía.
    if (payload.email || payload.name) {
      await Teacher.updateOne(
        { user: userId },
        {
          ...(payload.email ? { email: payload.email } : {}),
          ...(payload.name ? { fullName: payload.name } : {}),
        }
      );
      await Student.updateOne(
        { user: userId },
        {
          ...(payload.email ? { email: payload.email } : {}),
          ...(payload.name ? { fullName: payload.name } : {}),
        }
      );
    }
    return toPublic(user);
  },

  /** Cambia la contraseña validando la actual. */
  changeMyPassword: async (userId, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
      const err = new Error("Ingresa tu contraseña actual y la nueva");
      err.status = 400;
      throw err;
    }
    if (newPassword.length < 6) {
      const err = new Error("La nueva contraseña debe tener al menos 6 caracteres");
      err.status = 400;
      throw err;
    }
    const user = await User.findById(userId).select("+password");
    if (!user) return null;
    const matches = await user.comparePassword(currentPassword);
    if (!matches) {
      const err = new Error("La contraseña actual es incorrecta");
      err.status = 401;
      throw err;
    }
    user.password = newPassword;
    await user.save();
    return toPublic(user);
  },
};
