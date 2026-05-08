import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// --- OBTENER TODOS LOS CURSOS ---
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("courses");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    res.status(500).send({ message: "Error interno del servidor", error });
  }
});

// --- CREAR UN NUEVO CURSO ---
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

    res.status(201).send(result);
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.status(500).send({ message: "Error interno del servidor", error });
  }
});

// --- ACTUALIZAR UN CURSO ---
router.patch("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };

    // Extraemos el _id (lo ignoramos) y guardamos el resto en 'updateData'
    // Esto evita el error de intentar sobrescribir el _id en MongoDB
    const { _id, ...updateData } = req.body;

    let updates = {
      $set: updateData,
    };

    let collection = await db.collection("courses");
    let result = await collection.updateOne(query, updates);

    res.status(200).send(result);
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).send({ message: "Error interno del servidor", error });
  }
});

// --- ELIMINAR UN CURSO ---
router.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };

    let collection = await db.collection("courses");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).send({ message: "Error interno del servidor", error });
  }
});

export default router;