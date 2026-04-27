import express from "express";
import db from "../db/connection.js";
import { generateSchedule } from "../services/scheduler.js";

const router = express.Router();

router.get("/generate", async (req, res) => {
  let courses = await db.collection("courses").find({}).toArray();
  let teachers = await db.collection("teachers").find({}).toArray();
  let classrooms = await db.collection("classrooms").find({}).toArray();

  let result = generateSchedule(courses, teachers, classrooms);

  await db.collection("schedules").deleteMany({});
  await db.collection("schedules").insertMany(result);

  res.send(result);
});

router.get("/", async (req, res) => {
  let data = await db.collection("schedules").find({}).toArray();
  res.send(data);
});

export default router;