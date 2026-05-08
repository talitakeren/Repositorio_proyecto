import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /teacher
 * Retorna todos los docentes registrados.
 */
router.get("/", async (req, res) => {
  try {
    let data = await db.collection("teachers").find({}).toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener docentes", detail: error.message });
  }
});

/**
 * POST /teacher
 * Crea un nuevo docente (con validación de email único)
 */
router.post("/", async (req, res) => {
  try {
    // 🔥 VALIDACIÓN EMAIL ÚNICO
    const existing = await db.collection("teachers").findOne({
      email: req.body.email
    });

    if (existing) {
      return res.status(400).send({ error: "El correo ya está registrado" });
    }

    let teacher = {
      name: req.body.name,
      email: req.body.email,
      availability: req.body.availability || [],
      preferences: req.body.preferences || [],
    };

    let result = await db.collection("teachers").insertOne(teacher);
    res.send(result);

  } catch (error) {
    res.status(500).send({ error: "Error al registrar docente", detail: error.message });
  }
});

/**
 * PATCH /teacher/:id
 * Actualiza docente (con validación email único si cambia)
 */
router.patch("/:id", async (req, res) => {
  try {
    // 🔥 VALIDACIÓN EMAIL ÚNICO EN UPDATE
    if (req.body.email) {
      const existing = await db.collection("teachers").findOne({
        email: req.body.email,
        _id: { $ne: new ObjectId(req.params.id) }
      });

      if (existing) {
        return res.status(400).send({ error: "El correo ya está en uso" });
      }
    }

    let query = { _id: new ObjectId(req.params.id) };
    let updates = { $set: req.body };

    let result = await db.collection("teachers").updateOne(query, updates);
    res.send(result);

  } catch (error) {
    res.status(500).send({ error: "Error al actualizar docente", detail: error.message });
  }
});

/**
 * DELETE /teacher/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    let query = { _id: new ObjectId(req.params.id) };
    let result = await db.collection("teachers").deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar docente", detail: error.message });
  }
});

export default router;