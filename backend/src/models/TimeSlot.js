import mongoose from "mongoose";
import { DAYS } from "../utils/constants.js";

const timeSlotSchema = new mongoose.Schema(
  {
    day: { type: String, enum: DAYS, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    label: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

timeSlotSchema.index({ day: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model("TimeSlot", timeSlotSchema);
