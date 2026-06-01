import { Router } from "express";
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  updateApprovedCourses,
  getMyStudent,
} from "../controllers/student.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, authorizeRoles("STUDENT"), getMyStudent);

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", protect, authorizeRoles("ADMIN"), createStudent);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateStudent);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteStudent);
router.put(
  "/:id/approved-courses",
  protect,
  authorizeRoles("ADMIN"),
  updateApprovedCourses
);

export default router;
