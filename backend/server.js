import express from "express";
import cors from "cors";

import courseRoutes from "./routes/course.js";
import teacherRoutes from "./routes/teacher.js";
import classroomRoutes from "./routes/classroom.js";
import studentRoutes from "./routes/student.js";
import enrollmentRoutes from "./routes/enrollment.js";
import scheduleRoutes from "./routes/schedule.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/course", courseRoutes);
app.use("/teacher", teacherRoutes);
app.use("/classroom", classroomRoutes);
app.use("/student", studentRoutes);
app.use("/enrollment", enrollmentRoutes);
app.use("/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});