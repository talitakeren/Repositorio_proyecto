# Registro de Riesgos

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## Umbrales de Prioridad

| Tipo | Nivel | Umbral |
|------|-------|--------|
| Amenazas | Alto | ≥ 4.5 |
| Amenazas | Medio | ≥ 2.0 |
| Oportunidades | Alto | ≥ 5.0 |
| Oportunidades | Medio | ≥ 3.0 |

---

## Definiciones

| Campo | Descripción |
|-------|-------------|
| **ID Riesgo** | Formato YYMMDDx (ej. 240409a = primer riesgo registrado el 9 abr 2024) |
| **Área de Impacto** | Costo, Cronograma, Alcance, Calidad |
| **Impacto (Riesgo)** | 1=Menor · 3=Moderado · 5=Serio · 7=Muy Serio · 9=Crítico |
| **Impacto (Oportunidad)** | 1=Muy Bajo · 3=Bajo · 5=Medio · 7=Alto · 9=Muy Alto |
| **Probabilidad** | 0.1 (muy baja) → 0.9 (muy alta) |
| **Puntuación** | Impacto × Probabilidad |
| **Detectabilidad** | Alto=puede verse con anticipación · Medio=justo antes · Bajo=cuando ocurre |
| **Estado** | Activo · Observado · Cerrado |

---

## Categorías de Riesgos

### 1. Técnicos

| ID | Descripción | Sub-Categoría |
|----|-------------|---------------|
| 1.1 | Validación incorrecta en modelos de datos de Cursos, Docentes o Aulas genera horarios con información errónea | Requerimientos |
| 1.2 | Falta de entorno de despliegue estable; ausencia de HTTPS hasta Sprint 5 expone el sistema en fases tempranas | Infraestructura |
| 1.3 | Datos académicos sin cifrado durante Sprints 1–4; autenticación JWT no implementada hasta Sprint 5 | Seguridad |
| 1.4 | Complejidad exponencial del backtracking sin heurísticas MRV/LCV puede hacer inviable la generación en tiempo aceptable | Complejidad |
| 1.5 | Generación de horarios supera 10 segundos en escenarios con 20+ cursos y 15+ aulas — criterio de rendimiento HU-05 | Desempeño y Confiabilidad |
| 1.6 | Información incorrecta en CRUD de Cursos/Docentes/Aulas afecta la calidad y validez del horario generado | Calidad |
| 1.7 | Falta de documentación técnica entre módulos CSP, UI y exportación dificulta integración entre responsables | Comunicaciones |

### 2. Externos

| ID | Descripción | Sub-Categoría |
|----|-------------|---------------|
| 2.1 | Dependencia de librerías externas para exportación PDF y Excel puede generar incompatibilidades o indisponibilidad | Proveedores y Contratistas |
| 2.2 | Cambios en normativas académicas durante el desarrollo pueden invalidar restricciones ya implementadas | Políticos |
| 2.3 | Regulaciones de protección de datos exigen cifrado y control de acceso | Regulaciones |
| 2.4 | Falta de adopción por parte de otras instituciones limita el alcance e impacto del proyecto | Mercado |
| 2.5 | Cambios en requerimientos solicitados fuera del alcance planificado afectan el backlog y los sprints | Cliente |
| 2.6 | Cortes eléctricos o fallos de red que interrumpan sesiones activas sin mecanismo de recuperación | Clima / Desastres naturales |
| 2.7 | Sistemas similares en el mercado institucional reducen la ventaja competitiva del sistema | Competencia |

### 3. Organizacional

| ID | Descripción | Sub-Categoría |
|----|-------------|---------------|
| 3.1 | Dependencia entre sprints: Sprint 3 y 4 no pueden iniciar sin completar T-04.2 del Sprint 2 | Dependencias en otros proyectos |
| 3.2 | Equipo de 5 integrantes con carga desigual: Sprint 2 concentra esfuerzo en Juan Carlos y Yenifer | Recursos y Priorización |
| 3.3 | Proyecto académico sin presupuesto formal; recursos limitados a horas-persona del equipo | Financiación |
| 3.4 | Resistencia del personal académico a adoptar el sistema automatizado por preferencia al proceso manual | Cultura Organizacional |
| 3.5 | El proyecto no está alineado con el calendario académico, reduciendo la ventana de uso real | Estrategia Empresarial |
| 3.6 | Ningún miembro del equipo tiene experiencia previa en algoritmos CSP y backtracking — curva de aprendizaje alta | Capacitación |

### 4. Gestión de Proyectos

| ID | Descripción | Sub-Categoría |
|----|-------------|---------------|
| 4.1 | Subestimación de tareas complejas: T-04.2, T-05.1, T-04.1 concentran riesgo de no entrega en Sprint 2 | Estimación |
| 4.2 | Burndown chart de Sprint 2 muestra 76 puntos; riesgo alto de no completar todas las tareas en 10 días | Planeación |
| 4.3 | Falta de seguimiento de dependencias entre tareas puede generar bloqueos en cadena | Control |
| 4.4 | Comunicación insuficiente entre responsable de módulo CSP y módulos UI sobre interfaces de integración | Comunicación |

---

## Registro de Amenazas

| ID Riesgo | Descripción | Área de Impacto | Causa | Impacto | Probabilidad | Puntuación | Detectabilidad | Estado | Asignado a | Evento Disparador | Estrategia de Respuesta | Fecha Aprobación | Comentarios |
|-----------|-------------|-----------------|-------|---------|-------------|------------|----------------|--------|------------|-------------------|------------------------|-----------------|-------------|
| 240409a | Información incorrecta de cursos, docentes o aulas afecta calidad del horario generado | Calidad | Validaciones insuficientes en API REST permiten registros duplicados o con campos inválidos | Crítico | Muy Alto | **8.1** | Bajo | 🟢 Activo | Juan Carlos | Usuario registra datos sin verificación; sistema acepta duplicados o campos inválidos | Implementar validaciones en API REST (T-01.2, T-02.2, T-03.2); criterio: endpoints devuelven respuestas correctas con códigos HTTP | 13/04/2026 | Sprint 1 — HU-01 (Juan Carlos), HU-02 (Tatiana), HU-03 (Yenifer) |
| 240409b | Conflictos de horarios entre docentes o aulas por solapamiento de asignaciones | Alcance | Asignación de cursos o docentes sin verificar disponibilidad simultánea de aulas y franjas | Muy Serio | Muy Alto | **6.3** | Alto | 👁️ Observado | Juan Carlos | Se ejecuta el algoritmo CSP sin restricción de solapamiento; dos clases ocupan el mismo docente/aula/franja | Implementar T-04.2: restricciones duras de no solapamiento de docentes, franjas y aulas como variables del modelo CSP | 23/04/2026 | Sprint 2 — HU-04 (Juan Carlos). T-04.2 Estimación |
| 240409c | Retrasos en el desarrollo por alta complejidad del algoritmo CSP y backtracking | Cronograma | Complejidad exponencial del backtracking sin heurísticas; curva de aprendizaje del equipo | Serio | Muy Alto | **4.5** | Bajo | ✅ Cerrado | Yenifer | T-05.1 (backtracking básico) no se completa en el Sprint 2 por alta complejidad técnica | Implementar primero T-05.1 (backtracking básico con AC-3), luego T-05.2 (heurísticas MRV/LCV) en iteración separada | 23/04/2026 | Sprint 2 — HU-05 (Yenifer). T-05.1 Est 16 pts. Criterio: <10 s en pruebas |
| 240409d | Cambios en los requerimientos por nuevas reglas académicas no contempladas | Alcance | Nuevas reglas académicas o preferencias de docentes no contempladas en el modelo inicial | Moderado | Muy Alto | **2.7** | Alto | 🟢 Activo | Alexandra | Cliente solicita nuevas preferencias académicas no contempladas en T-04.3 durante el Sprint 3 | Usar T-04.3 (restricciones blandas: preferencias docentes) como mecanismo configurable; gestión formal de cambios en backlog | 23/04/2026 | Sprint 2-3 — HU-04 (Alexandra) T-04.3 Est 10 pts, HU-06 (Juan Carlos) |
| 240409e | Fallas en la generación automática de horarios en escenarios complejos | Calidad | Algoritmo backtracking no converge o genera soluciones inválidas en casos extremos con 20+ cursos | Menor | Muy Alto | **0.9** | Bajo | 🟢 Activo | Talita | Prueba de rendimiento T-05.3 devuelve error o tiempo de respuesta mayor a 10 segundos | Implementar T-05.3: pruebas de rendimiento con escenarios complejos; ajustar heurísticas MRV/LCV si falla (T-05.2) | 23/04/2026 | Sprint 2 — HU-05 (Talita). T-05.3 Estimación |
| 240409f | Falta de experiencia del equipo en algoritmos CSP y backtracking | Calidad | Ningún miembro del equipo tiene experiencia previa en algoritmos CSP y backtracking | Moderado | Alto | **2.1** | Alto | 🟢 Activo | Juan Carlos | Las tareas T-04.1 a T-04.3 se extienden fuera del Sprint 2 por curva de aprendizaje técnica | Distribuir tareas según especialidad: T-04.1 (variables CSP) a Juan Carlos, T-04.2 (restricciones) a Tatiana | 23/04/2026 | Sprint 2 — HU-04. T-04.1 Est 13 pts (Juan Carlos), T-04.2 |
| 240409g | Baja disponibilidad del sistema por dependencias entre módulos CSP y UI | Cronograma | Dependencias entre módulos impiden despliegue si un componente crítico falla | Moderado | Bajo | **0.9** | Bajo | 🟢 Activo | Yenifer | T-07.1 (disponibilidad docentes como restricción) falla y bloquea la generación de horarios en Sprint 3 | Integrar T-07.1 con el motor CSP desde el Sprint 3; incluir T-07.2 (pruebas de validación de disponibilidad) | 03/05/2026 | Sprint 3 — HU-07 (Yenifer). T-07.1 Est 16 pts, T-07.2 |
| 240409h | Falta de pruebas suficientes para validar criterios de aceptación en todos los sprints | Calidad | Plan de pruebas insuficiente para validar todos los escenarios del sistema | Muy Serio | Alto | **4.9** | Alto | 🟢 Activo | Alexandra | Al cierre del sprint se detectan criterios de aceptación no cubiertos en las pruebas de validación | Cada HU debe incluir tarea de prueba explícita en el backlog: T-06.3 (control créditos), T-07.2 (validación disponibilidad) | 03/05/2026 | Sprint 3 — HU-06 (Alexandra) T-06.3 Est 10 pts, HU-07 (Talita) T-07.2 |
| 240409i | Dependencia entre módulos del sistema genera bloqueos entre sprints | Alcance | Módulos de restricciones, disponibilidad y generación tienen dependencias cruzadas no gestionadas | Muy Serio | Bajo | **2.1** | Bajo | 🟢 Activo | Juan Carlos | T-07.1 no está listo cuando se ejecuta T-04.1; el motor CSP no puede integrar la disponibilidad | Definir interfaces entre modelos de datos desde Sprint 1 (T-01.1, T-02.1, T-03.1) para evitar dependencias no resueltas | 13/04/2026 | Sprint 1-3 — Dependencia HU-04 → HU-07. Definir contratos de integración desde Sprint 1 |
| 240409j | Pérdida de datos académicos por falta de mecanismo de exportación y respaldo | Calidad | Falta de respaldo o mecanismo de recuperación ante errores en base de datos | Serio | Medio | **2.5** | Medio | 🟢 Activo | Talita | Error en base de datos antes de exportar; el usuario pierde el horario generado sin posibilidad de recuperarlo | Implementar T-09.1 (exportación PDF con grilla legible en A4) y T-09.2 (exportación Excel con datos estructurados) en Sprint 4 | 13/05/2026 | Sprint 4 — HU-09 (Yenifer/Talita). T-09.1, T-09.2 |

---

## Registro de Oportunidades

| ID | Descripción | Área de Impacto | Causa | Impacto | Probabilidad | Puntuación | Detectabilidad | Estado | Asignado a | Evento Disparador | Estrategia de Respuesta | Fecha Aprobación | Comentarios |
|----|-------------|-----------------|-------|---------|-------------|------------|----------------|--------|------------|-------------------|------------------------|-----------------|-------------|
| 260409a | Reducción del tiempo de generación de horarios a menos de 10 segundos | Cronograma | Implementación de heurísticas MRV y LCV que optimizan el backtracking (T-05.2) | Muy Alto | Medio | **4.5** | Alto | 🟢 Activo | Yenifer | Las pruebas T-05.3 demuestran tiempo de respuesta menor a 10 segundos | Implementar T-05.1 (backtracking+AC-3), T-05.2 (MRV/LCV) y T-05.3 (pruebas rendimiento) | 23/04/2026 | Sprint 2 — HU-05. Criterio: <10 s en pruebas. Resp: Yenifer/Talita |
| 260409b | Reutilización del motor CSP en otras carreras o facultades de la institución | Alcance | El modelo CSP con variables configurables (T-04.1) es genérico y parametrizable | Muy Alto | Muy Bajo | **0.9** | Medio | 🟢 Activo | Juan Carlos | Cliente solicita adaptar el sistema para otras facultades tras ver resultados del Sprint 2 | Diseñar T-04.1 con parámetros configurables: cursos, docentes, aulas y franjas horarias | 23/04/2026 | Sprint 2 — HU-04 (Juan Carlos). T-04.1 Estimación 13 pts |
| 260409c | Eliminación total de conflictos de horario mediante combinación de restricciones duras y blandas | Calidad | T-04.2 (restricciones duras) y T-04.3 (preferencias blandas) cubren todos los casos de conflicto | Muy Alto | Bajo | **2.7** | Bajo | 🟢 Activo | Alexandra | Pruebas HU-04 confirman 0 conflictos en todos los escenarios probados | Implementar T-04.2 (no solapamiento) y T-04.3 (preferencias) como base del motor CSP | 23/04/2026 | Sprint 2 — HU-04 (Alexandra). T-04.2 + T-04.3 |
| 260409d | Mejora de la satisfacción docente al respetar su disponibilidad horaria declarada | Calidad | Integración de disponibilidad docente como restricción en el motor CSP (T-07.1) | Alto | Muy Alto | **6.3** | Alto | 🟢 Activo | Yenifer | Docentes completan disponibilidad en HU-07 y el sistema no los asigna fuera de ese rango | Implementar T-07.1 (integrar disponibilidad como restricción CSP) y T-07.2 (validación con casos límite) | 03/05/2026 | Sprint 3 — HU-07 (Yenifer/Talita). T-07.1, T-07.2 |
| 260409e | Distribución inmediata de horarios en PDF y Excel facilita comunicación institucional | Alcance | Formatos estándar PDF y Excel permiten distribución sin herramientas adicionales (HU-09) | Alto | Alto | **4.9** | Alto | 🟢 Activo | Yenifer | Área académica solicita reportes de horarios para distribución masiva al inicio del semestre | Implementar T-09.1 (PDF con formato de grilla legible) y T-09.2 (Excel con datos estructurados por hoja) | 13/05/2026 | Sprint 4 — HU-09 (Yenifer/Talita). T-09.1, T-09.2 |
| 260409f | Acceso seguro con roles diferenciados (Administrador y Visualizador) usando JWT | Costo | Implementación de autenticación JWT y roles reduce riesgo de acceso no autorizado | Alto | Medio | **3.5** | Alto | 🟢 Activo | Juan Carlos | Sistema distingue permisos por rol (Admin vs Visualizador) desde Sprint 5 | Implementar T-10.1 (JWT login/logout/refresh) y T-10.2 (Admin/Visualizador con permisos diferenciados) | 23/05/2026 | Sprint 5 — HU-10 (Juan Carlos/Alexandra). T-10.1, T-10.2 |
| 260409g | Protección de datos académicos sensibles mediante HTTPS y cifrado en tránsito y reposo | Calidad | Configuración HTTPS y cifrado protege datos de docentes, cursos y horarios almacenados | Alto | Bajo | **2.1** | Medio | 🟢 Activo | Alexandra | Auditoría confirma que datos sensibles están cifrados en tránsito y en reposo | Implementar T-10.3 (configurar HTTPS y protección de datos almacenados con cifrado) en Sprint 5 | 23/05/2026 | Sprint 5 — HU-10 (Alexandra). T-10.3 |
| 260409h | Visualización en tiempo real de conflictos reduce errores antes de publicar el horario final | Calidad | Indicadores visuales de conflicto en la grilla semanal (T-08.3) permiten corrección inmediata | Alto | Muy Bajo | **0.7** | Bajo | 🟢 Activo | Alexandra | Conflictos aparecen en rojo con descripción al cargar la grilla | Implementar T-08.3 (mostrar indicadores de conflicto cuando no hay solución completa) en Sprint 4 | 13/05/2026 | Sprint 4 — HU-08 (Alexandra). T-08.3 |

---

## Análisis de Riesgos y Oportunidades

### 5.1 Relación de Riesgos con las Restricciones del Problema (CSP)

El sistema SGOHA se basa en un problema de satisfacción de restricciones (CSP), lo cual introduce riesgos directamente asociados a su naturaleza combinatoria. Las cinco restricciones duras (HC1–HC5) definidas en el AGENTS.md son el núcleo del sistema.

| Riesgo | Restricción CSP afectada | Justificación |
|--------|--------------------------|---------------|
| 240409a — Validación incorrecta de datos | HC1, HC2, HC3 | Si los datos de cursos, docentes o aulas son erróneos, el motor CSP puede violar la restricción de no solapamiento de docentes (HC1), no solapamiento de aulas (HC2) o capacidad mínima del aula (HC3) sin que el sistema lo detecte. |
| 240409b — Conflictos de horario por solapamiento | HC1, HC2 | Este riesgo representa la materialización directa de fallar HC1 (un docente asignado a dos cursos simultáneos) o HC2 (un aula con dos cursos en el mismo bloque). Es el riesgo de mayor impacto sobre la calidad del producto final. |
| 240409c — Retrasos por complejidad del backtracking | HC1, HC2, HC3, HC4, HC5 | El algoritmo de backtracking debe satisfacer las cinco restricciones duras de forma simultánea. La complejidad computacional crece exponencialmente con cada variable y restricción adicional. |
| 240409d — Cambios en normativas académicas | HC4, HC5 | Las restricciones de bloques horarios (HC4) y disponibilidad docente (HC5) son las más susceptibles a cambios normativos externos. Una modificación institucional podría invalidar los dominios ya configurados en el motor CSP. |
| 240409e — Fallas en escenarios complejos 20+ cursos | HC4, HC5 | Con mayor cantidad de cursos, la búsqueda de asignaciones válidas dentro de los bloques permitidos (HC4) respetando la disponibilidad de cada docente (HC5) puede no converger en tiempo aceptable, incumpliendo el criterio de HU-05 (<10 segundos). |
| 240409i — Bloqueos entre módulos por dependencias | HC5 | La integración del módulo de disponibilidad docente (HU-07) es condición necesaria para implementar HC5. Si T-07.1 no está listo, el sistema opera sin esta restricción, generando horarios que ignoran la disponibilidad declarada por los docentes. |

👉 **Conclusión:** El CSP es el núcleo del sistema, por lo que cualquier ambigüedad, error de datos o ineficiencia en el algoritmo impacta directamente en la calidad del horario generado. Los riesgos de mayor puntuación (240409a con 8.1 y 240409b con 6.3) están vinculados a HC1 y HC2, las restricciones más fundamentales del modelo.

---

### 5.2 Relación de Riesgos con Limitaciones Técnicas

El proyecto presenta restricciones tecnológicas propias del stack y del equipo utilizados:

- **Curva de aprendizaje en CSP (Riesgos 240409f y categoría 3.6):** Ningún integrante del equipo tenía experiencia previa con algoritmos CSP y backtracking al inicio del proyecto. Esta limitación incrementó la probabilidad de subestimación de tareas (Riesgo 4.1) y se reflejó en la concentración de puntos de historia en el Sprint 2, donde T-04.1 (13 pts) y T-05.1 (16 pts) representan el mayor riesgo de no entrega. La mitigación adoptada fue distribuir las tareas según afinidad técnica y descomponer T-05.1 en subtareas incrementales.

- **Rendimiento del backtracking sin heurísticas (Riesgos 1.4 y 1.5):** El backtracking puro tiene complejidad O(n!) en el peor caso. Sin las heurísticas MRV (Minimum Remaining Values) y LCV (Least Constraining Value) de T-05.2, el sistema no puede garantizar el criterio de rendimiento de menos de 10 segundos de HU-05. Esta es la limitación técnica más crítica del proyecto.

- **Ausencia de infraestructura de seguridad en fases tempranas (Riesgos 1.2 y 1.3):** La falta de HTTPS y cifrado hasta el Sprint 5 es una limitación aceptada conscientemente dado el contexto académico. Sin embargo, implica que pruebas con datos académicos reales durante los Sprints 1–4 exponen información sensible de docentes y cursos.

- **Dependencias entre módulos (Riesgo 240409i):** Los módulos de restricciones, disponibilidad y generación tienen dependencias cruzadas. Sin contratos de integración definidos desde el Sprint 1, un fallo en un módulo bloquea el desarrollo de los demás.

👉 **Conclusión:** Las decisiones técnicas y la curva de aprendizaje del equipo impactan directamente en el rendimiento, estabilidad y tiempos del proyecto. La implementación de heurísticas MRV/LCV es la acción técnica más crítica para garantizar la viabilidad del producto.

---

### 5.3 Relación de Riesgos con Dependencias Externas

El proyecto depende de factores externos que pueden afectar su desarrollo:

- **Librerías de exportación PDF y Excel (Riesgo 2.1):** El sistema depende de librerías de terceros para las funcionalidades de exportación de HU-09 (Sprint 4). Un cambio de versión, incompatibilidad con Node.js, o discontinuación podría bloquear la entrega de T-09.1 y T-09.2. La estrategia es evaluar la estabilidad de las librerías antes de su integración.

- **Normativas académicas cambiantes (Riesgo 2.2):** Las restricciones del modelo CSP están basadas en las reglas académicas vigentes. Un cambio institucional en los formatos de bloque horario o políticas de asignación docente requeriría modificar los dominios del modelo desde su base, afectando el trabajo de los Sprints 1 y 2.

- **Dependencia bloqueante entre sprints (Riesgo 3.1):** El Sprint 3 no puede iniciar si T-04.2 del Sprint 2 no está completado. El motor de restricciones duras es prerrequisito para HU-07, HU-06 y HU-08. Esta fue identificada como la ruta crítica del proyecto y se gestiona mediante contratos de integración desde el Sprint 1.

- **Adopción institucional (Riesgo 2.4):** El sistema fue desarrollado para un contexto académico específico. La falta de adopción por otras instituciones limita el impacto real del proyecto, aunque no afecta los entregables del backlog.

👉 **Conclusión:** Las dependencias externas representan riesgos no controlables totalmente por el equipo. Las estrategias de mitigación anticipadas, especialmente la definición de contratos de integración y la evaluación temprana de librerías, son fundamentales para reducir su impacto.

---

### 5.4 Evaluación Global del Riesgo del Proyecto

La mayoría de riesgos se concentran en:
- Complejidad algorítmica del motor CSP
- Curva de aprendizaje técnica del equipo
- Dependencias entre módulos y sprints

Se observa que:
- Los riesgos de mayor puntuación (≥6) corresponden a amenazas técnicas directamente relacionadas con el núcleo del sistema: 240409a = 8.1, 240409b = 6.3, 240409h = 4.9
- Las estrategias se enfocan principalmente en mitigación mediante implementación incremental
- El único riesgo cerrado (240409c) demuestra capacidad de respuesta del equipo ante amenazas materializadas

👉 **Conclusión general:** El proyecto presenta un nivel de riesgo medio-alto, principalmente debido a la complejidad del problema CSP y la curva de aprendizaje del equipo. Sin embargo, es manejable mediante las estrategias técnicas y de gestión documentadas, con especial atención a la implementación del motor de restricciones duras y las heurísticas de optimización en los Sprints 2 y 3.
