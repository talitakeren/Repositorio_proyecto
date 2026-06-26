# Registro de Riesgos — Cierre
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Escala de Evaluación

| Campo | Valores |
|-------|---------|
| Impacto | 1=Menor · 3=Moderado · 5=Serio · 7=Muy Serio · 9=Crítico |
| Probabilidad | 0.1 (muy baja) → 0.9 (muy alta) |
| Puntuación | Impacto × Probabilidad |
| Estado final | ✅ Mitigado · ⚠️ Parcialmente mitigado · 🔴 Materializado · ❌ No ocurrió |

---

## 2. Registro de Amenazas — Estado Final

| ID | Descripción | Área | Impacto | Prob. | Puntuación | Estrategia aplicada | Estado final | Responsable | Observaciones de cierre |
|----|-------------|------|---------|-------|-----------|---------------------|-------------|-------------|------------------------|
| 240409a | Datos inválidos en CRUD de Cursos/Docentes/Aulas afectan calidad del horario | Calidad | Crítico (9) | Muy Alto (0.9) | 8.1 | Validaciones implementadas en API REST (T-01.2, T-02.2, T-03.2); endpoints con códigos HTTP correctos | ✅ Mitigado | Juan Carlos | Las validaciones funcionaron correctamente en todos los endpoints verificados |
| 240409b | Conflictos de solapamiento en asignación de docentes o aulas | Alcance | Muy Serio (7) | Muy Alto (0.9) | 6.3 | T-04.2 implementado: restricciones duras de no solapamiento en motor CSP | ✅ Mitigado | Juan Carlos | 0 conflictos detectados en todos los escenarios de prueba |
| 240409c | Retrasos por alta complejidad del algoritmo CSP y backtracking | Cronograma | Serio (5) | Muy Alto (0.9) | 4.5 | Backtracking básico + AC-3 implementado primero; heurísticas MRV/LCV pospuestas | ✅ Cerrado | Yenifer | Se materializó parcialmente: extensión de ~8 días sobre el Planned End. Respuesta fue efectiva |
| 240409d | Cambios de requerimientos por nuevas reglas académicas | Alcance | Moderado (3) | Muy Alto (0.9) | 2.7 | Gestión formal de cambios en backlog Scrum; restricciones blandas como módulo configurable | ✅ Mitigado | Alexandra | No se presentaron cambios de requerimientos críticos durante la ejecución |
| 240409e | Fallas en generación de horarios en escenarios complejos | Calidad | Menor (1) | Muy Alto (0.9) | 0.9 | T-05.3: pruebas de rendimiento con escenarios complejos; ajuste de heurísticas | ✅ Mitigado | Talita | Tiempo de generación < 10 s en escenario PMV (≤ 30 cursos, 15 docentes, 10 aulas) |
| 240409f | Falta de experiencia del equipo en CSP y backtracking | Calidad | Moderado (3) | Alto (0.7) | 2.1 | Distribución de tareas por especialidad; capacitación interna durante Sprint 0 | ⚠️ Parcial | Juan Carlos | Se materializó como curva de aprendizaje que impactó el cronograma del Sprint 1 |
| 240409g | Baja disponibilidad del sistema por dependencias entre módulos CSP y UI | Cronograma | Moderado (3) | Bajo (0.3) | 0.9 | T-07.1 integrado con motor CSP desde Sprint 3; T-07.2 pruebas de validación | ✅ Mitigado | Yenifer | No se registraron fallos de disponibilidad en integración |
| 240409h | Pruebas insuficientes para validar criterios de aceptación | Calidad | Muy Serio (7) | Alto (0.7) | 4.9 | Tarea de prueba incluida explícitamente en cada HU del backlog | ⚠️ Parcial | Alexandra | Cobertura final 30,3%: menor al umbral deseable. Módulos CSP con cobertura incompleta |
| 240409i | Dependencias entre módulos generan bloqueos entre sprints | Alcance | Muy Serio (7) | Bajo (0.3) | 2.1 | Interfaces entre modelos de datos definidas desde Sprint 1 | ⚠️ Parcial | Juan Carlos | Se produjeron bloqueos puntuales en la integración CSP ↔ UI que se resolvieron con comunicación directa |
| 240409j | Pérdida de datos por falta de mecanismo de exportación | Calidad | Serio (5) | Medio (0.5) | 2.5 | T-09.1 y T-09.2 programadas para Sprint 4 | 🔴 Materializado | Talita | Exportación PDF/Excel no entregada en el PMV; funcionalidad pospuesta a versión 2.0 |

---

## 3. Registro de Oportunidades — Estado Final

| ID | Descripción | Área | Impacto | Prob. | Puntuación | Resultado obtenido | Estado |
|----|-------------|------|---------|-------|-----------|-------------------|--------|
| 260409a | Reducción del tiempo de generación a < 10 s | Cronograma | Muy Alto (9) | Medio (0.5) | 4.5 | Tiempo de generación < 10 s confirmado en pruebas | ✅ Aprovechada |
| 260409b | Reutilización del motor CSP en otras carreras | Alcance | Muy Alto (9) | Muy Bajo (0.1) | 0.9 | T-04.1 diseñado con parámetros configurables | ⚠️ Potencial |
| 260409c | Eliminación total de conflictos de horario | Calidad | Muy Alto (9) | Bajo (0.3) | 2.7 | 0 conflictos confirmados en HU-04 | ✅ Aprovechada |
| 260409d | Mejora de satisfacción docente respetando disponibilidad | Calidad | Alto (7) | Muy Alto (0.9) | 6.3 | T-07.1 implementado; disponibilidad docente como restricción CSP | ✅ Aprovechada |
| 260409e | Distribución inmediata de horarios en PDF/Excel | Alcance | Alto (7) | Alto (0.7) | 4.9 | No implementada en PMV; postergada a v2.0 | ❌ No aprovechada |
| 260409f | Acceso seguro con roles JWT diferenciados | Costo | Alto (7) | Medio (0.5) | 3.5 | JWT implementado con roles Admin/Visualizador en Sprint 5 | ✅ Aprovechada |
| 260409g | Protección de datos con HTTPS y cifrado | Calidad | Alto (7) | Bajo (0.3) | 2.1 | HTTPS configurado; cifrado en tránsito implementado | ✅ Aprovechada |
| 260409h | Visualización en tiempo real de conflictos | Calidad | Alto (7) | Muy Bajo (0.1) | 0.7 | T-08.3 implementado: indicadores visuales de conflicto en grilla | ✅ Aprovechada |

---

## 4. Análisis de Riesgos al Cierre

- **Riesgos mitigados exitosamente:** 5 de 10 amenazas (50%).
- **Riesgos parcialmente mitigados:** 3 de 10 (30%) — impactaron calidad o cronograma de forma controlada.
- **Riesgos materializados sin mitigación completa:** 1 (exportación PDF/Excel).
- **Riesgos que no ocurrieron:** 1 (cambios críticos de requerimientos).
- **Oportunidades aprovechadas:** 6 de 8 (75%).
