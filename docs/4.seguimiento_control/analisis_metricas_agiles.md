# Análisis de Métricas Ágiles 

---

## 1. Evolución del Proyecto

Los gráficos reflejan un sprint con ejecución concentrada en su tramo final. El scope se fijó en ~90 puntos desde el 10 de abril, pero el progreso efectivo no inició hasta el 27 de abril.

- El Burnup confirma que el equipo alcanzó ~72 puntos completados (~80% del scope total).
- La actividad se extendió hasta el 7 de mayo, ocho días después del Planned End (29 abr).
- Dado que el proyecto aborda un problema **NP-hard** (timetabling con múltiples restricciones), la carga cognitiva de diseño e implementación del algoritmo justifica parcialmente esta distribución tardía del trabajo.

---

## 2. Cuellos de Botella

| # | Observación | Posible causa |
|---|---|---|
| 1 | Tareas ingresadas al tablero un día después del inicio | Sprint Planning incompleto al arranque |
| 2 | ~17 días sin avance registrado (10–27 abr) | Historias de gran granularidad; dificultad para cerrar tareas parciales en un sistema de optimización |
| 3 | Cierre fuera del Planned End | Subestimación de la complejidad del algoritmo backtracking + integración MERN |

> La naturaleza del problema (scheduler con HC/SC, función objetivo, cobertura de tests al 100%) demanda iteraciones de diseño previas a producir entregables visibles, lo que puede explicar la curva plana prolongada.

---

## 3. Estabilidad del Equipo

- **Velocidad Sprint 1:** 72 puntos de historia (único dato disponible).
- No es posible calcular variabilidad estadística con un solo sprint; este valor es la **línea base de referencia**.
- La distribución interna del trabajo fue irregular, aunque los resultados técnicos finales son sólidos: 29/29 tests pasados, 100% de cobertura, 0 conflictos en generación de horario.
- Se recomienda registrar al menos 2–3 sprints más para establecer un rango de velocidad confiable.

---

## 4. Coherencia entre Planificación y Complejidad

- El scope comprometido (~90 pts) superó en ~25% la velocidad real alcanzada (72 pts).
- Considerando que el equipo implementó un **modelo formal de timetabling** (variables de decisión, restricciones duras HC1–HC3, restricciones blandas SC1–SC2 y función objetivo ponderada), el nivel de complejidad técnica es alto para un PMV de primer sprint.
- Los resultados de validación experimental confirman que el núcleo del sistema funciona correctamente dentro del alcance PoC definido (≤30 cursos, 15 docentes, 10 aulas).
- Para sprints futuros, se sugiere ajustar el scope a ~70 puntos y descomponer historias relacionadas al algoritmo en tareas más pequeñas que permitan cierres incrementales visibles.

---

**Nota:** Los patrones observados son consistentes con un equipo en etapa inicial de adopción de Scrum que, simultáneamente, trabaja sobre un problema de optimización combinatoria de complejidad inherentemente alta. Los indicadores técnicos del entregable son positivos y representan una base sólida para las siguientes iteraciones.
