# Registro de Defectos (Defect Log)
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

**Versión:** 1.0.0  
**Fecha:** Junio 2026  
**Proyecto:** SGOHA — Taller de Proyectos 2

---

## Escala de Severidad

| Severidad | Descripción |
|-----------|-------------|
| 🔴 Crítica | El sistema no puede ejecutar su función principal; bloquea la entrega |
| 🟠 Alta | Funcionalidad importante afectada; existe workaround complejo |
| 🟡 Media | Funcionalidad afectada con workaround disponible |
| 🟢 Baja | Cosmético, UX menor, sin impacto funcional |

---

## Registro de Defectos

| ID | Fecha detección | Sprint | Módulo | Descripción del defecto | Severidad | Detectado por | Causa raíz | Corrección aplicada | Estado | Fecha corrección | Validado por |
|----|----------------|--------|--------|------------------------|-----------|--------------|------------|---------------------|--------|-----------------|-------------|
| DEF-01 | Abr 2026 | Sprint 1 | API REST – Cursos | Endpoint POST `/cursos` aceptaba documentos duplicados (mismo nombre y código) sin error, generando registros duplicados en MongoDB | 🔴 Crítica | Juan Carlos | Ausencia de índice único en colección y sin validación de duplicados en el servicio | Se añadió índice único compuesto en MongoDB (`nombre + código`). Se implementó manejo de error 409 cuando MongoDB lanza `code: 11000` (duplicate key). Test: `auth.service.test.js` verifica el comportamiento | ✅ Corregido | 15 Abr 2026 | Tatiana (prueba unitaria) |
| DEF-02 | Abr 2026 | Sprint 1 | API REST – Auth | Login aceptaba emails con espacios o mayúsculas sin normalización, creando sesiones duplicadas para el mismo usuario | 🟠 Alta | Tatiana | Falta de sanitización del campo `email` en el servicio de autenticación antes de comparar con la base de datos | Se añadió `.trim().toLowerCase()` en el campo email antes de la consulta a MongoDB. Test en `auth.service.test.js`: caso límite "email con espacios y mayúsculas" | ✅ Corregido | 16 Abr 2026 | Alexandra |
| DEF-03 | Abr 2026 | Sprint 1 | Backend – Middleware | El middleware de manejo de errores no devolvía el campo `message` en el formato estándar `ApiResponse` cuando el error no tenía status code definido, retornando 500 sin cuerpo estructurado | 🟠 Alta | Alexandra | El `error.middleware.js` no manejaba el caso de errores sin `status` property | Se actualizó el middleware para asignar status 500 por defecto y envolver el mensaje en el formato `ApiResponse`. Test en `error.middleware.test.js` | ✅ Corregido | 18 Abr 2026 | Juan Carlos |
| DEF-04 | May 2026 | Sprint 2 | Motor CSP | El algoritmo backtracking no terminaba (timeout) en escenarios con >30 cursos y ausencia de restricciones blandas, ejecutando iteraciones redundantes | 🟠 Alta | Yenifer | Falta de poda por detección temprana de dominios vacíos (AC-3 incompleto en primeras iteraciones) | Se implementó AC-3 completo antes del backtracking y detección de dominio vacío como condición de corte. Tiempo de respuesta reducido a <10 s en escenario PMV | ✅ Corregido | 3 May 2026 | Yenifer (T-05.3 prueba de rendimiento) |
| DEF-05 | May 2026 | Sprint 2 | Frontend – Grilla de horarios | La grilla semanal no renderizaba correctamente cursos asignados a la franja horaria "20:00–22:00" (última franja), mostrando el bloque fuera del contenedor | 🟡 Media | Talita | Error en el cálculo de la posición CSS (`top`) para franjas horarias nocturnas en el componente de grilla | Se corrigió el cálculo de posición relativa usando índice de franja (0-based) en lugar de hora absoluta. Validado visualmente en Chrome, Firefox y Safari | ✅ Corregido | 7 May 2026 | Talita |
| DEF-06 | May 2026 | Sprint 2 | Frontend – Formulario de matrícula | El formulario de matrícula no mostraba mensaje de error cuando un estudiante intentaba matricularse en un curso sin cumplir los prerrequisitos; simplemente no ejecutaba la acción sin retroalimentación al usuario | 🟡 Media | Tatiana | El handler del formulario capturaba el error 400 del backend pero no lo mostraba en el estado de la UI | Se añadió manejo del error 400 en el componente de matrícula para mostrar el mensaje descriptivo retornado por el API en un toast de error visible | ✅ Corregido | 8 May 2026 | Tatiana |
| DEF-07 | May 2026 | Sprint 2 | Backend – Sonar | SonarQube reporta 4 bugs de confiabilidad (Reliability Rating D) en módulos de validación y manejo de excepciones | 🟡 Media | SonarQube | Hallazgos estáticos: null references no gestionadas en controladores de estudiante y aula | Parcialmente corregidos: 2 de 4 bugs resueltos antes del cierre del sprint. 2 bugs restantes documentados en plan de remediación v2.0 | ⚠️ Parcial | — | Alexandra |
| DEF-08 | May 2026 | Sprint 2 | Backend – Sonar | SonarQube reporta 3 vulnerabilidades de seguridad (Security Rating E) en módulos de autenticación y manejo de cabeceras HTTP | 🟠 Alta | SonarQube | Hallazgos estáticos de seguridad: cabeceras HTTP sin Helmet completo y expresiones regulares potencialmente inseguras | Se configuró `helmet` correctamente. Se añadió `loginRateLimiter` y `apiRateLimiter`. Las 3 vulnerabilidades Sonar restantes están documentadas en el plan de v2.0 | ⚠️ Parcial | — | Juan Carlos |

---

## Resumen de Defectos

| Severidad | Total | Corregidos | Parciales |
|-----------|-------|-----------|-----------|
| 🔴 Crítica | 1 | 1 | 0 |
| 🟠 Alta | 3 | 2 | 1 |
| 🟡 Media | 4 | 2 | 2 |
| **Total** | **8** | **5 (62,5%)** | **3 (37,5%)** |
