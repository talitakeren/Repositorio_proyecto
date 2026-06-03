import { Router } from "express";
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateAvailability,
  updateTeacherCourses,
  getMyTeacher,
  updateMyAvailability,
} from "../controllers/teacher.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, authorizeRoles("TEACHER"), getMyTeacher);
router.put(
  "/me/availability",
  protect,
  authorizeRoles("TEACHER"),
  updateMyAvailability
);

router.get("/", listTeachers);
router.get("/:id", getTeacher);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.put("/:id/availability", updateAvailability);
router.put("/:id/courses", updateTeacherCourses);
export default router;
