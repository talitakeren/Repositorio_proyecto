import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let data = await db.collection("classrooms").find({}).toArray();
  res.send(data);
});

router.post("/", async (req, res) => {
  let classroom = {
    code: req.body.code,
    capacity: req.body.capacity,
    type: req.body.type,
  };

  let result = await db.collection("classrooms").insertOne(classroom);
  res.send(result);
});

export default router;