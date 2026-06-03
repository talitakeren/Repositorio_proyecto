import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import classroomRoutes from "./routes/classroom.routes.js";
import studentRoutes from "./routes/student.routes.js";
import timeslotRoutes from "./routes/timeslot.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import restrictionRoutes from "./routes/restriction.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

import { co2Middleware } from "./middlewares/co2.middleware.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors(
    isProduction
      ? { origin: clientUrl.split(",").map((o) => o.trim()) }
      : { origin: true }
  )
);
app.use(express.json());
app.use(morgan("dev"));
app.use(co2Middleware);   // ← acá, antes de cualquier ruta
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "SGOHA API operativa" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/timeslots", timeslotRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/restrictions", restrictionRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
