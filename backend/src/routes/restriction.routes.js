import { Router } from "express";
import {
  listRestrictions,
  restrictionsSummary,
  restrictionsPrecheck,
} from "../controllers/restriction.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();
const adminOnly = [protect, authorizeRoles("ADMIN")];

router.get("/", ...adminOnly, listRestrictions);
router.get("/summary", ...adminOnly, restrictionsSummary);
router.get("/precheck", ...adminOnly, restrictionsPrecheck);

export default router;
