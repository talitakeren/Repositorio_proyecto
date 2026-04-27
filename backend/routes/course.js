import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("courses");
  let results = await collection.find({}).toArray();
  res.send(results);
});

router.post("/", async (req, res) => {
  try {
    let newDoc = {
      code: req.body.code,
      name: req.body.name,
      credits: req.body.credits,
      prerequisites: req.body.prerequisites || [],
      classroomType: req.body.classroomType,
    };

    let collection = await db.collection("courses");
    let result = await collection.insertOne(newDoc);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/:id", async (req, res) => {
  let query = { _id: new ObjectId(req.params.id) };

  let updates = {
    $set: req.body,
  };

  let collection = await db.collection("courses");
  let result = await collection.updateOne(query, updates);

  res.send(result);
});

router.delete("/:id", async (req, res) => {
  let query = { _id: new ObjectId(req.params.id) };

  let collection = await db.collection("courses");
  let result = await collection.deleteOne(query);

  res.send(result);
});

export default router;