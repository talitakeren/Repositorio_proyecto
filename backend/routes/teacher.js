import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let data = await db.collection("teachers").find({}).toArray();
  res.send(data);
});

router.post("/", async (req, res) => {
  let teacher = {
    name: req.body.name,
    email: req.body.email,
    availability: req.body.availability || [],
  };

  let result = await db.collection("teachers").insertOne(teacher);
  res.send(result);
});

export default router;