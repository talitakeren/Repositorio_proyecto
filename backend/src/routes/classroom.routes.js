import { Router } from "express";
import {
  listClassrooms,
  getClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from "../controllers/classroom.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", listClassrooms);
router.get("/:id", getClassroom);
router.post("/", protect, authorizeRoles("ADMIN"), createClassroom);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateClassroom);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteClassroom);

export default router;
