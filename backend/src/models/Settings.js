import mongoose from "mongoose";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings.js";

const academicPeriodSchema = new mongoose.Schema(
  {
    name: { type: String, default: DEFAULT_SETTINGS.academicPeriod.name },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "PREPARING"],
      default: "ACTIVE",
    },
    enrollmentEnabled: { type: Boolean, default: true },
    scheduleGenerationEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const enrollmentRulesSchema = new mongoose.Schema(
  {
    minCredits: { type: Number, default: 20 },
    maxCredits: { type: Number, default: 22 },
    validatePrerequisites: { type: Boolean, default: true },
    blockApprovedCourses: { type: Boolean, default: true },
    allowObservedEnrollment: { type: Boolean, default: false },
    onlyConfirmedForSchedules: { type: Boolean, default: true },
  },
  { _id: false }
);

const cspSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    algorithm: {
      type: String,
      default: "CSP_BASIC_BACKTRACKING",
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "global",
      unique: true,
      immutable: true,
    },
    systemName: { type: String, default: DEFAULT_SETTINGS.systemName },
    fullName: { type: String, default: DEFAULT_SETTINGS.fullName },
    institutionName: {
      type: String,
      default: DEFAULT_SETTINGS.institutionName,
    },
    supportEmail: { type: String, default: DEFAULT_SETTINGS.supportEmail },
    systemStatus: {
      type: String,
      enum: ["ACTIVE", "MAINTENANCE"],
      default: "ACTIVE",
    },
    academicPeriod: {
      type: academicPeriodSchema,
      default: () => ({ ...DEFAULT_SETTINGS.academicPeriod }),
    },
    enrollmentRules: {
      type: enrollmentRulesSchema,
      default: () => ({ ...DEFAULT_SETTINGS.enrollmentRules }),
    },
    csp: {
      type: cspSchema,
      default: () => ({ ...DEFAULT_SETTINGS.csp }),
    },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne({ singletonKey: "global" });
  if (!doc) {
    doc = await this.create({ singletonKey: "global", ...DEFAULT_SETTINGS });
  }
  return doc;
};

export default mongoose.model("Settings", settingsSchema);
