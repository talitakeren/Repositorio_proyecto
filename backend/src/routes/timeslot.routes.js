import { Router } from "express";
import {
  listTimeSlots,
  getTimeSlot,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  syncTimeSlots,
} from "../controllers/timeslot.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listTimeSlots);
router.post(
  "/sync-official",
  protect,
  authorizeRoles("ADMIN"),
  syncTimeSlots
);
router.get("/:id", getTimeSlot);
router.post("/", protect, authorizeRoles("ADMIN"), createTimeSlot);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateTimeSlot);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteTimeSlot);

export default router;
