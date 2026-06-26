# Registro de Incidentes (Issue Log)
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

**Versión:** 1.0.0  
**Fecha:** Junio 2026  
**Proyecto:** SGOHA — Taller de Proyectos 2

---

## Escala de Prioridad y Estado

| Campo | Valores |
|-------|---------|
| Prioridad | 🔴 Alta · 🟡 Media · 🟢 Baja |
| Estado | Abierto · En progreso · Resuelto · Cerrado · Pospuesto |

---

## Registro de Incidentes

| ID | Fecha detección | Sprint | Descripción | Prioridad | Área | Responsable | Acción correctiva | Estado | Fecha cierre | Observaciones |
|----|----------------|--------|-------------|-----------|------|-------------|-------------------|--------|-------------|---------------|
| INC-01 | Abr 2026 | Sprint 1 | Audit frontend reporta vulnerabilidades vigentes en dependencias de desarrollo | 🟡 Media | Seguridad | Talita | Se ejecutó `npm audit fix` en dependencias del backend corrigiendo la vulnerabilidad `qs`. Frontend mantenido en seguimiento sin corrección completa. | Pospuesto | — | Las dependencias vulnerables son de desarrollo (devDependencies); no impactan el bundle de producción directamente. Se documenta para v2.0 |
| INC-02 | Abr 2026 | Sprint 1 | Cobertura de líneas Jest inferior al umbral aspiracional (30,3% vs. 100%) | 🟡 Media | Calidad | Alexandra / Yenifer | Se priorizaron pruebas sobre servicios críticos (authService, cspService, enrollmentService). Cobertura en módulos core superó el 70%. | Pospuesto | — | La cobertura global se vio afectada por módulos UI con cobertura cero. Plan de mejora registrado para siguiente iteración |
| INC-03 | May 2026 | Sprint 2 | Exportación PDF/Excel (HU-09) no completada dentro del PMV | 🔴 Alta | Alcance | Yenifer / Talita | Se documentó como exclusión del PMV v1.0. Funcionalidad registrada en backlog para versión 2.0 con estimación T-09.1 (PDF) y T-09.2 (Excel). | Pospuesto | — | La priorización fue aceptada por el equipo para garantizar la estabilidad del motor CSP |
| INC-04 | Abr 2026 | Sprint 1 | Burndown del Sprint 1 muestra 17 días sin avance visible (10–27 abr) | 🟡 Media | Cronograma | Juan Carlos (SM) | Se identificó que el trabajo cognitivo de diseño del algoritmo CSP no era visible en el tablero. Se añadieron tareas de investigación/spike al backlog. | Resuelto | 27 Abr 2026 | El trabajo técnico se completó exitosamente; la incidencia fue de visibilidad, no de ejecución |
| INC-05 | Abr 2026 | Sprint 1 | Integración entre módulo CSP y modelos de datos de Aula/Docente/Curso generó bloqueos | 🔴 Alta | Técnico | Juan Carlos | Se definieron interfaces de integración explícitas entre módulos. Se estableció contrato de API REST como referencia común. | Resuelto | 30 Abr 2026 | Se resolvió mediante sesión de alineación técnica del equipo. Lección aprendida: contratos desde Sprint 0 |
| INC-06 | May 2026 | Sprint 2 | SonarQube reporta 777 Code Smells y Security Rating E (5.0) | 🟡 Media | Calidad / Seguridad | Alexandra | Se documentaron los hallazgos. Se priorizó la corrección de 3 vulnerabilidades detectadas por Sonar. Quality Gate aprobado (OK). | En progreso | — | La deuda técnica está cuantificada y clasificada. Plan de remediación por severidad para v2.0 |
| INC-07 | May 2026 | Sprint 2 | Tiempo de generación de horarios supera 10 s en escenarios con >30 cursos | 🟡 Media | Desempeño | Yenifer | Se ajustaron los parámetros del algoritmo backtracking. El criterio de aceptación (< 10 s) se cumple dentro del escenario PMV definido (≤ 30 cursos, 15 docentes, 10 aulas). | Resuelto | May 2026 | Para escenarios mayores se requieren heurísticas MRV/LCV (T-05.2), pospuesto a v2.0 |
| INC-08 | Abr 2026 | Sprint 1 | Datos duplicados en colecciones MongoDB por ausencia de índices únicos en sprint inicial | 🔴 Alta | Calidad de datos | Juan Carlos | Se implementaron validaciones en API REST y se añadieron índices únicos en MongoDB. Error 409 (duplicate code 11000) manejado correctamente. | Resuelto | Abr 2026 | Las pruebas unitarias de authService verifican el manejo correcto de duplicados |

---

## Resumen de Estado

| Estado | Cantidad |
|--------|----------|
| Resueltos | 4 |
| Pospuestos a v2.0 | 3 |
| En progreso | 1 |
| **Total** | **8** |

---

*Documento generado en la fase de cierre del proyecto — Taller de Proyectos 2, Ingeniería de Sistemas e Informática, Universidad Continental.*
