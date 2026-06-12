import { Router } from "express";
import {
  getSettings,
  updateSettings,
  resetSettings,
} from "../controllers/settings.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();
const adminOnly = [protect, authorizeRoles("ADMIN")];

router.get("/", ...adminOnly, getSettings);
router.put("/", ...adminOnly, updateSettings);
router.post("/reset", ...adminOnly, resetSettings);

export default router;
