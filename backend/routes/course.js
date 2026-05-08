import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// LISTAR
router.get("/", async (req, res) => {
  let collection = await db.collection("courses");
  let results = await collection.find({}).toArray();
  res.send(results);
});

// CREAR
router.post("/", async (req, res) => {
  try {
    const { code, name, credits, classroomType } = req.body;

    if (!code || !name || !credits) {
      return res.status(400).send({ message: "Campos obligatorios faltantes" });
    }

    let newDoc = {
      code,
      name,
      credits,
      prerequisites: req.body.prerequisites || [],
      classroomType,
    };

    let collection = await db.collection("courses");
    let result = await collection.insertOne(newDoc);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ACTUALIZAR
router.patch("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };

    let updates = {
      $set: req.body,
    };

    let collection = await db.collection("courses");
    let result = await collection.updateOne(query, updates);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };

    let collection = await db.collection("courses");
    let result = await collection.deleteOne(query);

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;