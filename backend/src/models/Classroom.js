import mongoose from "mongoose";
import { CLASSROOM_TYPES, CLASSROOM_STATUSES } from "../utils/constants.js";

/**
 * Aula física del sistema SGOHA.
 *
 * Importante: estos campos son consumidos por el motor CSP para validar la
 * compatibilidad y la disponibilidad durante la generación de horarios.
 *  - `type`     se compara con Course.classroomTypeRequired (debe coincidir).
 *  - `capacity` se compara con la cantidad de estudiantes del curso.
 *  - `active` y `status` filtran qué aulas son candidatas reales.
 */
const classroomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "El código del aula es obligatorio"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: CLASSROOM_TYPES,
      required: [true, "Selecciona el tipo de aula"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad debe ser mayor a 0"],
    },
    location: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: CLASSROOM_STATUSES,
      default: "AVAILABLE",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Classroom", classroomSchema);
