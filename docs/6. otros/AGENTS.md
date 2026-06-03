# AGENTS.md — Principios y Restricciones del Sistema

**Sistema:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)
**Versión:** v1.0.0 — PoC

---

## 1. Propósito del sistema

El sistema tiene como objetivo automatizar la planificación de horarios universitarios mediante técnicas de optimización y restricciones académicas.

El sistema prioriza la **correctitud sobre la velocidad**. Un horario libre de conflictos tiene mayor valor que un horario generado rápidamente con errores o solapamientos.

**Problemas que resuelve:**

- Conflictos de horarios entre docentes
- Superposición de aulas
- Asignaciones fuera de disponibilidad docente
- Mala distribución de bloques horarios durante la semana
- Cursos sin asignación por falta de recursos

**Objetivos del sistema:**

- Evitar conflictos académicos (HC1, HC2)
- Respetar la disponibilidad de los docentes (HC5)
- Optimizar el uso de aulas (HC3)
- Minimizar cursos sin asignación (KPI-01, KPI-02)
- Mejorar la calidad de la solución mediante preferencias (SC1, KPI-03)

---

## 2. Reglas globales

- Toda asignación debe contener exactamente: `curso`, `docente`, `aula`, `día` y `bloque horario`.
- El sistema nunca asignará un docente fuera de su `availability[]` registrado.
- Un aula no puede contener más de un curso en el mismo bloque horario.
- Un docente no puede impartir dos cursos simultáneamente.
- Todo curso debe tener un único horario asignado.
- Toda asignación debe respetar la capacidad máxima del aula.
- El sistema debe registrar en `unassigned[]` los cursos que no puedan ser asignados por falta de recursos.
- Las historias de usuario deben registrarse en Jira conforme se culmina cada implementación, favoreciendo la gestión incremental y la visibilidad del trabajo del equipo.
- Toda documentación técnica y funcional debe elaborarse en formato Markdown.

---

## 3. Restricciones duras

Las restricciones duras deben cumplirse obligatoriamente. Una solución que las viole no es válida.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| HC1 | Sin solapamiento de docente | Un docente no puede estar asignado a dos cursos en el mismo bloque horario |
| HC2 | Sin solapamiento de aula | Un aula no puede asignarse a más de un curso simultáneamente |
| HC3 | Capacidad del aula | La capacidad del aula debe ser mayor o igual al número de estudiantes del curso |
| HC4 | Bloques horarios válidos | Todo curso debe asignarse dentro de los bloques definidos por el sistema |
| HC5 | Disponibilidad del docente | El sistema debe respetar el campo `availability[]` al asignar cursos |

---

## 4. Restricciones blandas

Las restricciones blandas no invalidan la solución, pero mejoran su calidad y se reflejan en el `objectiveScore`.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| SC1 | Preferencias del docente | Priorizar bloques incluidos en `preferences[]`, subconjunto de `availability[]` |
| SC2 | Distribución uniforme | Evitar bloques consecutivos excesivos; distribuir la carga equitativamente durante la semana |
| SC3 | Uso eficiente de aulas | Priorizar aulas con capacidad cercana a la cantidad de estudiantes del curso |

---

## 5. Función objetivo

La calidad de la solución se evalúa mediante el `objectiveScore`, valor normalizado en el rango `[0, 1]`:

```
objectiveScore = 0.7 × (cursosAsignados / totalCursos)
               + 0.3 × (preferencesMet / cursosAsignados)
```

| Componente | Peso | Significado |
|-----------|------|-------------|
| Tasa de asignación | 70% | Minimizar cursos sin horario — prioridad principal |
| Tasa de preferencias | 30% | Maximizar satisfacción de preferencias docentes (SC1) |

| Rango | Calidad de la solución |
|-------|------------------------|
| 1.00 | Óptima |
| 0.80 – 0.99 | Muy buena |
| 0.60 – 0.79 | Aceptable |
| < 0.60 | Mejorable |

> **Nota:** Las restricciones blandas (SC1, SC2, SC3) no penalizan la solución con valores negativos ni la invalidan. Únicamente afectan positivamente el `objectiveScore` cuando se cumplen.

---

## 6. Riesgos y oportunidades

Los riesgos y oportunidades corresponden a **eventos externos**, ajenos al equipo, que pueden afectar o favorecer el desarrollo, el cronograma o la calidad del producto.

### Riesgos

| ID | Riesgo | Probabilidad | Impacto | Respuesta |
|----|--------|-------------|---------|-----------|
| R-01 | Cambios en los requisitos académicos por parte de la institución | Media | Alto | Diseño modular que permita actualizar restricciones sin reescribir el algoritmo |
| R-02 | Indisponibilidad de MongoDB Atlas durante pruebas o demo | Baja | Alto | Configurar instancia local como respaldo |
| R-03 | Datos de disponibilidad docente incompletos o mal ingresados | Alta | Medio | Validación en backend antes de persistir; documentar formato obligatorio |
| R-04 | Incompatibilidad del entorno Node.js entre integrantes del equipo | Media | Medio | Documentar versión mínima requerida (v18) en README e instrucciones de instalación |

### Oportunidades

| ID | Oportunidad | Probabilidad | Beneficio potencial |
|----|-------------|-------------|---------------------|
| O-01 | Retroalimentación temprana del docente permite ajustar restricciones antes de la entrega final | Alta | Mejora la calidad del `objectiveScore` con datos reales |
| O-02 | Escalabilidad del algoritmo hacia algoritmos genéticos en versiones futuras | Media | Permite procesar escenarios de más de 30 cursos |
| O-03 | Integración con Jira ya establecida permite visibilidad del avance en tiempo real | Alta | Facilita el seguimiento y control del proyecto |
