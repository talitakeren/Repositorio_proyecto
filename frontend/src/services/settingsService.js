import { api, getData } from "../config/api.js";
import { DEFAULT_SETTINGS } from "../data/defaultSettings.js";
import {
  TIME_BLOCKS,
  DAYS,
  WEEKLY_SLOT_COUNT,
} from "../constants/timeBlocks.js";

const CACHE_KEY = "sgoha_settings";

function enrich(settings) {
  return {
    ...settings,
    scheduleRules: {
      ...settings.scheduleRules,
      activeDays: DAYS.map((d) => d.key),
      blocksPerDay: TIME_BLOCKS.length,
      totalWeeklySlots: WEEKLY_SLOT_COUNT,
      timeBlockLabels: TIME_BLOCKS.map((b) => b.label),
    },
  };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? enrich(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export const settingsService = {
  getSettings: async () => {
    try {
      const data = await api.get("/settings").then(getData);
      writeCache(data);
      return enrich(data);
    } catch {
      return readCache() || enrich({ ...DEFAULT_SETTINGS });
    }
  },

  updateSettings: async (payload) => {
    try {
      const data = await api.put("/settings", payload).then(getData);
      writeCache(data);
      return enrich(data);
    } catch (err) {
      const cached = enrich(payload);
      writeCache(payload);
      if (err?.response?.status === 400) throw err;
      return cached;
    }
  },

  resetSettings: async () => {
    try {
      const data = await api.post("/settings/reset").then(getData);
      writeCache(data);
      return enrich(data);
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return enrich({ ...DEFAULT_SETTINGS });
    }
  },
};
