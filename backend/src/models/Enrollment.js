import mongoose from "mongoose";
import { ENROLLMENT_STATUS } from "../utils/constants.js";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    totalCredits: { type: Number, default: 0 },
    status: { type: String, enum: ENROLLMENT_STATUS, default: "DRAFT" },
    validationResults: {
      prerequisitesValid: { type: Boolean, default: null },
      creditsValid: { type: Boolean, default: null },
      coursesAvailable: { type: Boolean, default: null },
      duplicatedCourses: { type: Boolean, default: false },
      alreadyApprovedCourses: { type: Boolean, default: false },
    },
    validationMessages: [{ type: String }],
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
