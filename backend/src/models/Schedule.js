import mongoose from "mongoose";
import { SCHEDULE_STATUS } from "../utils/constants.js";

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSlot", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { _id: false }
);

const conflictSchema = new mongoose.Schema(
  {
    type: String,
    message: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSlot" },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    period: { type: String, default: "2026-1" },
    assignments: [assignmentSchema],
    status: { type: String, enum: SCHEDULE_STATUS, default: "GENERATED" },
    conflicts: [conflictSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
