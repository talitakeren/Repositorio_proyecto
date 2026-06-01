import { Router } from "express";
import {
  listEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  validateEnrollment,
  confirmEnrollment,
  validateEnrollmentById,
  rejectEnrollment,
  observeEnrollment,
  getMyEnrollment,
  saveMyEnrollment,
  validateMyEnrollment,
  confirmMyEnrollment,
} from "../controllers/enrollment.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, authorizeRoles("STUDENT"), getMyEnrollment);
router.put("/me", protect, authorizeRoles("STUDENT"), saveMyEnrollment);
router.post(
  "/me/validate",
  protect,
  authorizeRoles("STUDENT"),
  validateMyEnrollment
);
router.post(
  "/me/confirm",
  protect,
  authorizeRoles("STUDENT"),
  confirmMyEnrollment
);

router.get("/", protect, authorizeRoles("ADMIN"), listEnrollments);
router.post("/validate", protect, authorizeRoles("ADMIN"), validateEnrollment);
router.get("/:id", protect, authorizeRoles("ADMIN"), getEnrollment);
router.post("/", protect, authorizeRoles("ADMIN"), createEnrollment);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateEnrollment);
router.post("/:id/validate", protect, authorizeRoles("ADMIN"), validateEnrollmentById);
router.post("/:id/confirm", protect, authorizeRoles("ADMIN"), confirmEnrollment);
router.post("/:id/reject", protect, authorizeRoles("ADMIN"), rejectEnrollment);
router.post("/:id/observe", protect, authorizeRoles("ADMIN"), observeEnrollment);
export default router;
