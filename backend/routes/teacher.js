import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /teachers
 * Retorna todos los docentes registrados.
 */
router.get("/", async (req, res) => {
  let data = await db.collection("teachers").find({}).toArray();
  res.send(data);
});

/**
 * POST /teachers
 * Crea un nuevo docente.
 *
 * Body esperado:
 * {
 *   name:         string   — nombre completo del docente
 *   email:        string   — correo institucional
 *   availability: string[] — bloques disponibles, formato "Día-HH-HH"
 *                            Ej: ["Lunes-8-10", "Martes-14-16"]
 *   preferences:  string[] — bloques preferidos (restricción blanda SC1)
 *                            Ej: ["Lunes-8-10", "Miércoles-10-12"]
 * }
 *
 * Nota: availability define CUÁNDO puede dictar (restricción dura HC3).
 *       preferences define cuándo PREFIERE dictar (restricción blanda SC1),
 *       debe ser un subconjunto de availability.
 */
router.post("/", async (req, res) => {
  try {
    let teacher = {
      name:         req.body.name,
      email:        req.body.email,
      availability: req.body.availability || [],  // HC3 — restricción dura
      preferences:  req.body.preferences  || [],  // SC1 — restricción blanda
    };

    let result = await db.collection("teachers").insertOne(teacher);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error al registrar docente", detail: error.message });
  }
});

/**
 * PATCH /teachers/:id
 * Actualiza parcialmente un docente (disponibilidad y/o preferencias).
 */
router.patch("/:id", async (req, res) => {
  try {
    let query   = { _id: new ObjectId(req.params.id) };
    let updates = { $set: req.body };

    let result = await db.collection("teachers").updateOne(query, updates);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error al actualizar docente", detail: error.message });
  }
});

/**
 * DELETE /teachers/:id
 * Elimina un docente por ID.
 */
router.delete("/:id", async (req, res) => {
  try {
    let query  = { _id: new ObjectId(req.params.id) };
    let result = await db.collection("teachers").deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar docente", detail: error.message });
  }
});

export default router;