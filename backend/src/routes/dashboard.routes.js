import { Router } from "express";
import {
  getDashboardSummary,
  getSystemStatus,
  getRecentActivity,
} from "../controllers/dashboard.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();
const adminOnly = [protect, authorizeRoles("ADMIN")];

router.get("/summary", ...adminOnly, getDashboardSummary);
router.get("/status", ...adminOnly, getSystemStatus);
router.get("/activity", ...adminOnly, getRecentActivity);

export default router;
