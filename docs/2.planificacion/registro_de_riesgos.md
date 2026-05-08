---

## Análisis de Riesgos y Oportunidades

### 1. Relación de Riesgos con las Restricciones del Problema (CSP)

El núcleo del SGOHA es el modelo de Satisfacción de Restricciones (CSP), compuesto por cinco restricciones duras (HC1–HC5) definidas en el AGENTS.md. Los riesgos más críticos del proyecto tienen origen directo en la complejidad de implementar y validar estas restricciones:

| Riesgo | Restricción CSP afectada | Justificación |
|--------|--------------------------|---------------|
| 240409a — Validación incorrecta de datos | HC1, HC2, HC3 | Si los datos de cursos, docentes o aulas son erróneos, el motor CSP puede violar la restricción de no solapamiento de docentes (HC1), no solapamiento de aulas (HC2) o capacidad mínima del aula (HC3) sin que el sistema lo detecte. |
| 240409b — Conflictos de horario por solapamiento | HC1, HC2 | Este riesgo representa la materialización directa de fallar HC1 (un docente asignado a dos cursos simultáneos) o HC2 (un aula con dos cursos en el mismo bloque). Es el riesgo de mayor impacto sobre la calidad del producto final. |
| 240409c — Retrasos por complejidad del backtracking | HC1, HC2, HC3, HC4, HC5 | El algoritmo de backtracking debe satisfacer las cinco restricciones duras de forma simultánea en cada asignación. La complejidad computacional crece exponencialmente con cada variable y restricción adicional. |
| 240409d — Cambios en normativas académicas | HC4, HC5 | Las restricciones de bloques horarios definidos (HC4) y disponibilidad docente (HC5) son las más susceptibles a cambios normativos externos. Una modificación en el calendario académico institucional podría invalidar los dominios ya configurados en el motor CSP. |
| 240409e — Fallas en escenarios complejos 20+ cursos | HC4, HC5 | Con mayor cantidad de cursos, la búsqueda de asignaciones válidas dentro de los bloques permitidos (HC4) respetando la disponibilidad individual de cada docente (HC5) puede no converger en tiempo aceptable, incumpliendo el criterio de HU-05 (<10 segundos). |
| 240409i — Bloqueos entre módulos por dependencias | HC5 | La integración del módulo de disponibilidad docente (HU-07) es condición necesaria para implementar HC5. Si T-07.1 no está listo, el sistema opera sin esta restricción, generando horarios que ignoran la disponibilidad declarada por los docentes. |

**Conclusión:** Los riesgos de mayor puntuación (240409a con 8.1 y 240409b con 6.3) están directamente vinculados a las restricciones duras HC1 y HC2, que son las más fundamentales del modelo CSP. Esto indica que la validación de datos de entrada y la correcta implementación del motor de restricciones son las actividades de mayor riesgo del proyecto.

---

### 2. Relación de Riesgos con Limitaciones Técnicas

**Curva de aprendizaje en CSP (Riesgos 240409f y categoría 3.6):**
Ningún integrante del equipo tenía experiencia previa con algoritmos CSP y backtracking al inicio del proyecto. Esta limitación incrementó la probabilidad de subestimación de tareas (Riesgo 4.1) y se reflejó directamente en la concentración de puntos de historia en el Sprint 2, donde T-04.1 (13 pts), T-04.2 y T-05.1 (16 pts) representan el mayor riesgo de no entrega. La mitigación adoptada fue distribuir las tareas según afinidad técnica de cada integrante y descomponer T-05.1 en subtareas incrementales.

**Rendimiento del backtracking sin heurísticas (Riesgos 1.4 y 1.5):**
El backtracking puro tiene complejidad O(n!) en el peor caso. Sin la implementación de las heurísticas MRV (Minimum Remaining Values) y LCV (Least Constraining Value) de T-05.2, el sistema no puede garantizar el criterio de rendimiento de menos de 10 segundos establecido en HU-05. Esta es la limitación técnica más crítica del proyecto, ya que afecta directamente la viabilidad del producto.

**Ausencia de infraestructura de seguridad en fases tempranas (Riesgos 1.2 y 1.3):**
La falta de HTTPS y cifrado hasta el Sprint 5 es una limitación técnica aceptada conscientemente por el equipo dado el contexto académico del proyecto. Sin embargo, implica que cualquier prueba con datos académicos reales durante los Sprints 1–4 expone información sensible de docentes y cursos.

---

### 3. Relación de Riesgos con Dependencias Externas

**Librerías de exportación PDF y Excel (Riesgo 2.1):**
El sistema depende de librerías de terceros para las funcionalidades de exportación de HU-09 (Sprint 4). Un cambio de versión, incompatibilidad con el entorno de Node.js utilizado, o discontinuación de alguna de estas librerías podría bloquear la entrega de T-09.1 y T-09.2. La estrategia de mitigación es evaluar la estabilidad y madurez de las librerías seleccionadas antes de su integración.

**Normativas académicas cambiantes (Riesgo 2.2):**
Las restricciones del modelo CSP están basadas en las reglas académicas vigentes al momento del desarrollo. Un cambio institucional en los formatos de bloque horario, la duración de las sesiones o las políticas de asignación docente requeriría modificar los dominios y variables del modelo CSP desde su base, afectando el trabajo ya completado en los Sprints 1 y 2.

**Dependencia bloqueante entre sprints (Riesgo 3.1):**
La dependencia más crítica del proyecto es interna pero se comporta como una dependencia externa entre equipos: el Sprint 3 no puede iniciar correctamente si T-04.2 del Sprint 2 no está completado. El motor de restricciones duras es un prerrequisito para todas las funcionalidades de disponibilidad (HU-07), control de créditos (HU-06) y visualización (HU-08). Esta dependencia en cadena fue identificada como la ruta crítica del proyecto y se gestiona mediante la definición de contratos de integración desde el Sprint 1.

**Adopción institucional (Riesgo 2.4):**
El sistema fue desarrollado para un contexto académico específico. La falta de adopción por parte de otras instituciones limita el impacto real del proyecto más allá del alcance académico, aunque esto no afecta la entrega de los entregables definidos en el backlog.
