import mongoose from "mongoose";
import { STUDENT_ENROLLMENT_STATUSES } from "../utils/constants.js";

/**
 * Estudiante del sistema SGOHA.
 *
 * Importante (CSP / matrícula):
 *  - `approvedCourses` representa el historial académico del estudiante y
 *    será usado para validar prerrequisitos en el módulo de matrícula.
 *  - `enrollmentStatus` refleja el estado administrativo visible en la ficha
 *    (pendiente, validada, confirmada, rechazada). El módulo de matrícula
 *    real (Enrollment) podrá sincronizarlo más adelante.
 *  - `active` controla si el estudiante es considerado para matrícula y para
 *    la generación de horarios.
 */
const studentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "El código del estudiante es obligatorio"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "El nombre completo es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo institucional es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    program: {
      type: String,
      required: [true, "El programa académico es obligatorio"],
      trim: true,
    },
    /** Vínculo opcional con el usuario que autentica como STUDENT. */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    /**
     * Historial académico — cursos ya aprobados.
     * approvedCourses será usado para validar prerrequisitos en el módulo de
     * matrícula (no representa los cursos del periodo actual).
     */
    approvedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    enrollmentStatus: {
      type: String,
      enum: STUDENT_ENROLLMENT_STATUSES,
      default: "PENDING",
    },
    /**
     * Indica si el estudiante aún no realizó su primera matrícula.
     *
     * El módulo de matrícula debe usar este flag para omitir la validación de
     * prerrequisitos y de créditos previos en la PRIMERA matrícula del alumno.
     * Una vez confirmada la primera matrícula, este flag se debe poner en
     * `false` (también se auto-deriva a `false` si el historial académico
     * `approvedCourses` deja de estar vacío).
     */
    isNewStudent: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
