import Course from "../models/Course.js";

function buildListQuery({ search, classroomType, active }) {
  const query = {};

  if (active === "true") query.active = true;
  else if (active === "false") query.active = false;

  if (classroomType && classroomType !== "ALL") {
    query.classroomTypeRequired = classroomType;
  }

  if (search?.trim()) {
    const term = search.trim();
    query.$or = [
      { code: { $regex: term, $options: "i" } },
      { name: { $regex: term, $options: "i" } },
    ];
  }

  return query;
}

function normalizePayload(data) {
  const payload = { ...data };
  if (payload.code) payload.code = payload.code.trim().toUpperCase();
  if (payload.name) payload.name = payload.name.trim();
  if (payload.prerequisites) {
    payload.prerequisites = payload.prerequisites.filter(Boolean);
  }
  return payload;
}

export const courseService = {
  list: (params = {}) =>
    Course.find(buildListQuery(params))
      .populate("prerequisites", "code name")
      .sort({ code: 1 }),

  getById: (id) => Course.findById(id).populate("prerequisites", "code name"),

  create: async (data) => {
    const payload = normalizePayload(data);
    const created = await Course.create(payload);
    return Course.findById(created._id).populate("prerequisites", "code name");
  },

  update: async (id, data) => {
    const payload = normalizePayload(data);

    if (payload.prerequisites?.some((p) => String(p) === String(id))) {
      const err = new Error("Un curso no puede ser prerrequisito de sí mismo");
      err.status = 400;
      throw err;
    }

    return Course.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).populate("prerequisites", "code name");
  },

  /** Eliminación lógica */
  remove: (id) =>
    Course.findByIdAndUpdate(
      id,
      { active: false },
      { new: true, runValidators: true }
    ).populate("prerequisites", "code name"),
};
