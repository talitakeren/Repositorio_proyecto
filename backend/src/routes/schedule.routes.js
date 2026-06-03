import { Router } from "express";
import {
  generateSchedule,
  precheckSchedule,
  latestSchedule,
  listSchedules,
  getSchedule,
  scheduleByStudent,
  scheduleByTeacher,
  scheduleByClassroom,
  myTeacherSchedule,
  myStudentSchedule,
} from "../controllers/schedule.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/me/teacher",
  protect,
  authorizeRoles("TEACHER"),
  myTeacherSchedule
);
router.get(
  "/me/student",
  protect,
  authorizeRoles("STUDENT"),
  myStudentSchedule
);

const adminOnly = [protect, authorizeRoles("ADMIN")];

router.get("/precheck", ...adminOnly, precheckSchedule);
router.get("/latest", ...adminOnly, latestSchedule);
router.post("/generate", ...adminOnly, generateSchedule);
router.get("/", ...adminOnly, listSchedules);
router.get("/student/:studentId", ...adminOnly, scheduleByStudent);
router.get("/teacher/:teacherId", ...adminOnly, scheduleByTeacher);
router.get("/classroom/:classroomId", ...adminOnly, scheduleByClassroom);
router.get("/:id", ...adminOnly, getSchedule);

export default router;
