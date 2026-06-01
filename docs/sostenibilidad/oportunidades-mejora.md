# Oportunidades de Mejora — SGOHA

## Introducción

A partir del análisis de los impactos ambientales identificados, se detectaron los siguientes componentes del proyecto susceptibles de optimización. Cada oportunidad está justificada con criterios de rendimiento y sostenibilidad.

---

## Oportunidad 1 — Compresión de respuestas HTTP en Express

**Componente afectado:** `backend/src/app.js`

**Situación actual:** El servidor Express no aplica ningún tipo de compresión a sus respuestas. Las respuestas JSON de endpoints como `GET /api/students` o `GET /api/schedules` se envían en texto plano.

**Mejora propuesta:** Agregar el middleware `compression` de Node.js antes de los demás middlewares en `app.js`. Este middleware aplica compresión gzip o deflate automáticamente a todas las respuestas.

**Justificación:** La compresión gzip reduce el tamaño de respuestas JSON típicamente entre un 60% y un 80%. Esto reduce el ancho de banda consumido, el tiempo de transferencia y el consumo energético de la red en cada petición.

---

## Oportunidad 2 — Optimización de consultas MongoDB con `.lean()` y `.select()`

**Componente afectado:** `backend/src/services/course.service.js`, `backend/src/services/teacher.service.js`, `backend/src/services/classroom.service.js`

**Situación actual:** Los servicios de curso, docente y aula realizan consultas que retornan documentos Mongoose completos sin proyección de campos. El `courseService.list()`, por ejemplo, devuelve todos los campos incluyendo `prerequisites` completo cuando la vista de listado solo necesita `code`, `name`, `credits` y `active`.

**Mejora propuesta:**
- Agregar `.lean()` en operaciones de listado para obtener objetos JavaScript planos en lugar de instancias Mongoose.
- Agregar `.select()` con los campos estrictamente necesarios según la vista que consume el dato.

**Justificación:** `.lean()` reduce el uso de memoria hasta en un 40% en listados grandes. `.select()` reduce el volumen de datos transferidos desde MongoDB. Ambas mejoras disminuyen el tiempo de procesamiento y el consumo de CPU del servidor.

---

## Oportunidad 3 — Paginación en endpoints de listado

**Componente afectado:** `backend/src/services/student.service.js`, `backend/src/services/teacher.service.js`, `backend/src/services/course.service.js`

**Situación actual:** Los endpoints `GET /api/students`, `GET /api/teachers` y `GET /api/courses` devuelven la totalidad de los registros activos sin ningún límite. En un entorno universitario real con cientos de estudiantes y docentes, esto puede generar respuestas de varios cientos de kilobytes.

**Mejora propuesta:** Implementar paginación basada en parámetros `?page=1&limit=20` en los servicios de listado usando `.skip()` y `.limit()` de Mongoose.

**Justificación:** La paginación limita el volumen de datos por petición, reduce el tiempo de respuesta del servidor, disminuye la carga de la base de datos y mejora la experiencia del usuario. Es la mejora con mayor impacto en sostenibilidad para este proyecto.

---

## Oportunidad 4 — Índices en modelos MongoDB

**Componente afectado:** `backend/src/models/Course.js`, `backend/src/models/Teacher.js`, `backend/src/models/Student.js`

**Situación actual:** Los modelos de curso, docente y estudiante no definen índices explícitos en campos frecuentemente consultados como `active`, `code` o `program`. Mongoose solo crea índices en campos marcados como `unique`.

**Mejora propuesta:** Agregar índices en campos usados como filtros frecuentes: `{ active: 1 }` en todos los modelos, `{ program: 1 }` en Student, `{ classroomTypeRequired: 1 }` en Course.

**Justificación:** Los índices reducen el costo de las consultas de filtrado de O(n) a O(log n). En colecciones grandes esto reduce significativamente el uso de CPU y I/O del servidor de base de datos, impactando directamente en el consumo energético.

---

## Resumen de oportunidades

| # | Oportunidad | Componente | Impacto esperado |
|---|------------|-----------|-----------------|
| 1 | Compresión gzip en Express | `app.js` | Reducción 60-80% en tamaño de respuestas |
| 2 | `.lean()` y `.select()` en servicios | Services de MongoDB | Reducción de memoria y CPU |
| 3 | Paginación en endpoints de listado | Student, Teacher, Course services | Reducción de transferencia de datos |
| 4 | Índices en modelos MongoDB | Modelos Mongoose | Reducción de I/O en base de datos |
