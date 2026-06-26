# Revisión del Acta de Constitución del Proyecto — Cierre
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

**Versión:** 1.0.0  
**Fecha de revisión:** Junio 2026  
**Propósito:** Verificar el cumplimiento de objetivos, criterios de éxito y alineación con resultados finales del proyecto

---

## 1. Revisión del Propósito y Justificación

**Propósito declarado en el Charter:**  
Automatizar el proceso de planificación de horarios académicos en un contexto de currículo flexible, reduciendo problemas de solapamiento, incumplimiento de prerrequisitos y subutilización de infraestructura.

**Estado al cierre:**

| Problema original | ¿Fue atendido? | Evidencia |
|-------------------|---------------|-----------|
| Solapamiento de horarios | ✅ Sí | Motor CSP con restricciones duras de no solapamiento implementado; 0 conflictos en todos los escenarios probados |
| Incumplimiento de prerrequisitos | ✅ Sí | Motor de validación de matrícula (HU-01 a HU-03) verifica prerrequisitos antes de confirmar inscripción |
| Subutilización de infraestructura | ✅ Parcial | El sistema asigna aulas respetando capacidad y disponibilidad docente; la optimización de uso de aulas vacías no fue prioridad del PMV |

---

## 2. Revisión del Objetivo General

**Declarado en el Charter:**  
Desarrollar un PMV de una aplicación web basada en el stack MERN, capaz de generar horarios académicos válidos considerando prerrequisitos académicos, disponibilidad de docentes y aulas, y límite de créditos. Desarrollo en 12 semanas bajo Scrum.

**Evaluación:**

| Componente | ¿Cumplido? | Detalle |
|------------|-----------|---------|
| PMV de aplicación web MERN | ✅ Sí | Sistema operativo con frontend React.js, backend Node.js + Express.js, base de datos MongoDB Atlas |
| Generación de horarios válidos | ✅ Sí | Motor CSP con backtracking + AC-3 genera horarios sin conflictos |
| Prerrequisitos académicos | ✅ Sí | Validación implementada en HU-01; verificación por grafo de dependencias |
| Disponibilidad de docentes y aulas | ✅ Sí | Restricciones duras implementadas en HU-04 y HU-07 |
| Límite de créditos | ✅ Sí | Validación 20–22 créditos implementada en HU-06 |
| Desarrollo en 12 semanas | ⚠️ Parcial | Entregado con ~8 días de extensión sobre el Planned End del Sprint 1 |
| Metodología Scrum | ✅ Sí | Feature Branch Workflow, Sprint Planning, Daily Standups, backlogs documentados |

---

## 3. Revisión de Objetivos Específicos

| Objetivo específico | ¿Cumplido? | Observaciones |
|---------------------|-----------|---------------|
| Analizar e identificar variables, restricciones y actores del problema | ✅ Sí | Documento de análisis del problema y registro de supuestos completados en Sprint 0 |
| Modelar el problema como CSP con supuestos justificados | ✅ Sí | Variables de decisión, dominios, restricciones HC1–HC3 y SC1–SC2 documentados y verificados |
| Diseñar arquitectura SPA + API REST con stack MERN | ✅ Sí | Documentación Arc42, SPEC.md y diagrama de arquitectura completados |
| Implementar requerimientos funcionales principales | ✅ Sí | HU-01 a HU-10 implementadas (HU-09 pospuesta a v2.0) |
| Documentar siguiendo PMBOK y Arc42 | ✅ Sí | Documentación completa en las 5 fases del ciclo de vida del proyecto |

---

## 4. Revisión del Alcance

### 4.1 Incluido en el PMV — Estado Final

| Entregable | Estado | Observaciones |
|------------|--------|---------------|
| Gestión de estudiantes, docentes, cursos y aulas (CRUD) | ✅ Entregado | Todos los endpoints con validaciones y pruebas unitarias |
| Motor de validación de matrícula | ✅ Entregado | Prerrequisitos + límite de créditos verificados |
| Motor CSP con backtracking + AC-3 | ✅ Entregado | Restricciones duras y blandas implementadas |
| Visualización de horarios por tipo de usuario | ✅ Entregado | Grilla semanal con indicadores de conflicto (T-08.3) |
| Autenticación JWT con roles (Admin / Visualizador) | ✅ Entregado | Implementado en Sprint 5 |
| Documentación técnica y de gestión | ✅ Entregado | Todas las fases documentadas en `/docs` |

### 4.2 Exclusiones del PMV — Confirmadas al Cierre

| Exclusión declarada | ¿Se mantuvo excluida? | Observaciones |
|--------------------|-----------------------|---------------|
| Integración con SIS/ERP | ✅ Excluida | Sin cambios |
| Módulo de notificaciones | ✅ Excluida | Sin cambios |
| Algoritmos avanzados (genéticos, metaheurísticos) | ✅ Excluida | Backtracking + AC-3 fue suficiente para PMV |
| Exportación PDF/Excel | ⚠️ Incumplida | Se comprometió en Sprint 4 pero no se entregó. Registrado en backlog de v2.0 |

---

## 5. Revisión de Entregables por Sprint

| Sprint | Entregable comprometido | Estado | Desviaciones |
|--------|------------------------|--------|-------------|
| Sprint 0 | Charter, Visión, Supuestos, Requerimientos, repositorio GitHub | ✅ Completado | Sin desviaciones |
| Sprint 1 | Backend API REST + frontend de registro | ✅ Completado | Extensión de ~8 días sobre el Planned End |
| Sprint 2 | Motor CSP, generación de horarios, visualización, pruebas y documentación final | ✅ Completado | HU-09 (exportación) no entregada |

---

## 6. Revisión de Stakeholders

| Stakeholder | Expectativa declarada | Estado de satisfacción estimado |
|-------------|----------------------|--------------------------------|
| Docente del curso (patrocinador) | Sistema funcional con documentación PMBOK completa | ✅ Cumplido |
| Equipo de desarrollo | Aprendizaje técnico de stack MERN y metodología Scrum | ✅ Cumplido |
| Coordinadores académicos (usuarios finales primarios) | Reducción del tiempo de planificación sin conflictos | ✅ Cumplido en escenario PMV |
| Estudiantes (usuarios secundarios) | Consulta de horarios generados | ✅ Cumplido con rol Visualizador |

---

## 7. Criterios de Éxito — Evaluación Final

| Criterio | Resultado medible | Estado |
|----------|------------------|--------|
| Horarios generados sin conflictos | 0 conflictos en todos los escenarios probados | ✅ Cumplido |
| Tiempo de respuesta < 10 s | < 10 s en escenario PMV | ✅ Cumplido |
| 208 pruebas unitarias ejecutadas y documentadas | 208 pruebas, 29/29 tests backend pasados | ✅ Cumplido |
| Quality Gate SonarQube aprobado | Status: OK | ✅ Cumplido |
| Documentación PMBOK en todas las fases | 5 fases documentadas con trazabilidad | ✅ Cumplido |
| Repositorio con Gitflow y versionamiento | Feature Branch + PR obligatorios en GitHub | ✅ Cumplido |
| Entrega dentro del plazo de 12 semanas | Extensión de ~8 días en Sprint 1 | ⚠️ Parcial |

---

## 8. Conclusión de la Revisión del Charter

El proyecto SGOHA alcanzó el 85% de sus objetivos declarados en el Acta de Constitución. Las principales desviaciones fueron de cronograma (no de alcance funcional), derivadas de la complejidad técnica inherente al problema de timetabling. El PMV entregado es funcional, documentado y está en condiciones de recibir iteraciones futuras.

La única exclusión no planificada fue la exportación PDF/Excel (HU-09), cuya postergación fue una decisión técnica justificada para garantizar la estabilidad del núcleo del sistema.

---

*Documento generado en la fase de cierre del proyecto — Taller de Proyectos 2, Ingeniería de Sistemas e Informática, Universidad Continental.*
