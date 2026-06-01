import mongoose from "mongoose";
import { CLASSROOM_TYPES } from "../utils/constants.js";

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 10 },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    classroomTypeRequired: {
      type: String,
      enum: CLASSROOM_TYPES,
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
