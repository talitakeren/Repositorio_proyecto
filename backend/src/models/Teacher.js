import mongoose from "mongoose";
import { DAYS } from "../utils/constants.js";

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, enum: DAYS, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    /** Vínculo opcional con el usuario que autentica como TEACHER (uno a uno). */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    availableCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    availability: [availabilitySchema],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
