import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { studentCode, selectedCourses } = req.body;

  let student = await db.collection("students").findOne({ code: studentCode });

  if (!student) {
    return res.status(404).send("Estudiante no encontrado");
  }

  let courses = await db
    .collection("courses")
    .find({ code: { $in: selectedCourses } })
    .toArray();

  let totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  if (totalCredits < 20 || totalCredits > 22) {
    return res.status(400).send("Créditos fuera de rango (20-22)");
  }

  for (let course of courses) {
    for (let pre of course.prerequisites) {
      if (!student.approvedCourses.includes(pre)) {
        return res
          .status(400)
          .send(`Falta prerrequisito ${pre} para ${course.code}`);
      }
    }
  }

  await db.collection("enrollments").insertOne({
    studentCode,
    selectedCourses,
  });

  res.send("Matrícula registrada");
});

export default router;