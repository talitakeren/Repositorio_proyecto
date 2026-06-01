import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let data = await db.collection("students").find({}).toArray();
  res.send(data);
});

router.post("/", async (req, res) => {
  let student = {
    code: req.body.code,
    name: req.body.name,
    email: req.body.email,
    approvedCourses: req.body.approvedCourses || [],
  };

  let result = await db.collection("students").insertOne(student);
  res.send(result);
});

export default router;