import Classroom from "../models/Classroom.js";
import {
  CLASSROOM_TYPES,
  CLASSROOM_STATUSES,
} from "../utils/constants.js";

function buildListQuery({ search, type, status, capacityMin, active }) {
  const query = {};

  if (active === "true") query.active = true;
  else if (active === "false") query.active = false;

  if (type && type !== "ALL" && CLASSROOM_TYPES.includes(type))
    query.type = type;

  if (status && status !== "ALL" && CLASSROOM_STATUSES.includes(status))
    query.status = status;

  const min = Number(capacityMin);
  if (!Number.isNaN(min) && min > 0) query.capacity = { $gte: min };

  if (search?.trim()) {
    const term = search.trim();
    query.$or = [
      { code: { $regex: term, $options: "i" } },
      { location: { $regex: term, $options: "i" } },
    ];
  }

  return query;
}

function normalizePayload(data = {}) {
  const payload = { ...data };
  if (payload.code) payload.code = payload.code.trim().toUpperCase();
  if (payload.location) payload.location = payload.location.trim();
  if (payload.capacity !== undefined)
    payload.capacity = Number(payload.capacity);
  return payload;
}

export const classroomService = {
  list: (params = {}) =>
    Classroom.find(buildListQuery(params)).sort({ code: 1 }),

  getById: (id) => Classroom.findById(id),

  create: (data) => Classroom.create(normalizePayload(data)),

  update: (id, data) =>
    Classroom.findByIdAndUpdate(id, normalizePayload(data), {
      new: true,
      runValidators: true,
    }),

  /**
   * Eliminación lógica: marca la aula como inactiva.
   * El motor CSP ignorará las aulas con active=false o status=INACTIVE.
   */
  remove: (id) =>
    Classroom.findByIdAndUpdate(
      id,
      { active: false, status: "INACTIVE" },
      { new: true, runValidators: true }
    ),
};
