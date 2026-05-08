import express from "express";
import db from "../db/connection.js";
import { generateSchedule } from "../services/scheduler.js";

const router = express.Router();

/**
 * GET /schedule/generate
 * Ejecuta el algoritmo de optimización y persiste el resultado.
 * Devuelve el horario generado junto con métricas de la función objetivo.
 *
 * Respuesta:
 * {
 *   schedule:       Array  — asignaciones exitosas
 *   totalAssigned:  number — cursos asignados
 *   conflicts:      number — cursos sin asignar (incumplimientos HC)
 *   unassigned:     string[] — nombres de cursos no asignados
 *   preferencesMet: number — bloques que coincidieron con SC1
 *   objectiveScore: number — [0,1] calidad de la solución
 * }
 */
router.get("/generate", async (req, res) => {
  try {
    let courses    = await db.collection("courses").find({}).toArray();
    let teachers   = await db.collection("teachers").find({}).toArray();
    let classrooms = await db.collection("classrooms").find({}).toArray();

    // Ejecutar algoritmo con restricciones formales (backtracking + SC)
    let result = generateSchedule(courses, teachers, classrooms);

    // Persistir solo las asignaciones exitosas
    await db.collection("schedules").deleteMany({});
    if (result.schedule.length > 0) {
      await db.collection("schedules").insertMany(result.schedule);
    }

    // Log para evidencia de ejecución (visible en consola del servidor)
    console.log(
      `[SCHEDULE] Generado: ${result.schedule.length} asignaciones | ` +
      `Conflictos: ${result.conflicts} | ` +
      `Preferencias cumplidas: ${result.preferencesMet} | ` +
      `objectiveScore: ${result.objectiveScore}`
    );

    // Respuesta con métricas al nivel raíz
    res.send({
      schedule:       result.schedule,
      totalAssigned:  result.totalAssigned,
      conflicts:      result.conflicts,
      unassigned:     result.unassigned,
      preferencesMet: result.preferencesMet,
      objectiveScore: result.objectiveScore,
    });

  } catch (error) {
    res.status(500).send({ error: "Error al generar horario", detail: error.message });
  }
});

/**
 * GET /schedule
 * Retorna el último horario generado persistido en la base de datos.
 */
router.get("/", async (req, res) => {
  try {
    let data = await db.collection("schedules").find({}).toArray();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener horario", detail: error.message });
  }
});

export default router;