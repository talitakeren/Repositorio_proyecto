import {
  RESTRICTIONS_CATALOG,
  buildRestrictionsSummary,
} from "../constants/restrictionsCatalog.js";
import { scheduleService } from "./schedule.service.js";
import { TIME_BLOCKS, WEEKLY_SLOT_COUNT } from "../constants/timeBlocks.js";

export const restrictionService = {
  getCatalog: () => {
    const summary = buildRestrictionsSummary(RESTRICTIONS_CATALOG);
    return {
      ...summary,
      timeBlocks: TIME_BLOCKS,
      weeklySlotCount: WEEKLY_SLOT_COUNT,
    };
  },

  getSummaryWithMotorStatus: async () => {
    const catalog = restrictionService.getCatalog();
    let motorStatus = "Revisar datos";
    try {
      const precheck = await scheduleService.precheck();
      motorStatus = precheck.canGenerate ? "Listo" : "Revisar datos";
      return {
        ...catalog,
        motorStatus,
        canGenerate: precheck.canGenerate,
        precheck,
      };
    } catch {
      return { ...catalog, motorStatus, canGenerate: false, precheck: null };
    }
  },

  getPrecheck: () => scheduleService.precheck(),
};
