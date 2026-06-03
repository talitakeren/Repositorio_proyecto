# SPEC.md — Especificación Formal del Sistema

**Sistema:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)
**Versión:** v1.0.0 — PoC
**Enfoque:** Software Design Document (SDD) con integración TDD

---

## 1. Entradas del sistema

### Cursos

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `codigo` | string | Sí |
| `nombre` | string | Sí |
| `cantidadEstudiantes` | entero | Sí |
| `ciclo` | entero | Sí |
| `horasSemanales` | entero | Sí |
| `classroomType` | enum: `estándar` / `laboratorio` | Sí |
| `prerequisites` | string[] | No |

### Docentes

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `nombre` | string | Sí |
| `email` | string (único) | Sí |
| `availability[]` | string[] formato `"Día-HH-HH"` | Sí |
| `preferences[]` | string[] subconjunto de `availability[]` | No |

### Aulas

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `codigo` | string (único) | Sí |
| `capacidad` | entero > 0 | Sí |
| `tipo` | enum: `estándar` / `laboratorio` | Sí |

### Bloques horarios disponibles

| Día | Bloques |
|-----|---------|
| Lunes – Viernes | `8-10`, `10-12`, `14-16`, `16-18` |

---

## 2. Salidas del sistema

### `schedule[]`

Cada asignación contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `course` | string | Nombre del curso |
| `courseCode` | string | Código del curso |
| `teacher` | string | Nombre del docente asignado |
| `classroom` | string | Código del aula asignada |
| `day` | string | Día de la semana |
| `block` | string | Bloque horario |
| `meetsPreference` | boolean | Si la asignación cumple SC1 |

### `metrics`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `totalAssigned` | number | Cursos con horario asignado |
| `conflicts` | number | Cursos sin asignar por violación HC |
| `unassigned[]` | string[] | Nombres de cursos no asignados |
| `preferencesMet` | number | Asignaciones que cumplieron SC1 |
| `objectiveScore` | number `[0,1]` | Calidad de la solución |

---

## 3. Reglas de negocio por endpoint

### `GET /schedule/generate`

Genera automáticamente un horario académico óptimo respetando restricciones duras y blandas.

**Validaciones aplicadas:**

- Disponibilidad del docente (HC5)
- Conflictos de aula (HC2)
- Conflictos de docente (HC1)
- Capacidad de aula (HC3)
- Bloques horarios válidos (HC4)

| Resultado | Respuesta |
|-----------|-----------|
| Éxito | `schedule[]` con asignaciones y `metrics` completas |
| Sin recursos | `"No es posible generar un horario sin conflictos con las restricciones actuales"` |

---

### `POST /course`

Gestiona el registro de cursos académicos.

**Validaciones:** código único, créditos entre 1–6, prerrequisitos existentes, tipo de aula válido.

| Resultado | Respuesta |
|-----------|-----------|
| Éxito | Curso registrado correctamente |
| Error | Código duplicado, campos incompletos, prerrequisito inexistente |

---

### `POST /teacher`

Gestiona el registro de docentes y disponibilidad.

**Validaciones:** `availability[]` con formato válido, nombre obligatorio, correo único.

| Resultado | Respuesta |
|-----------|-----------|
| Éxito | Docente registrado correctamente |
| Error | Disponibilidad inválida, correo duplicado |

---

### `POST /classroom`

Gestiona el registro de aulas académicas.

**Validaciones:** capacidad > 0, código único, tipo válido.

| Resultado | Respuesta |
|-----------|-----------|
| Éxito | Aula registrada correctamente |
| Error | Capacidad inválida, código duplicado |

---

## 4. Casos límite

| # | Escenario | Comportamiento esperado |
|---|-----------|------------------------|
| 1 | 0 docentes disponibles | `schedule[]` vacío, `conflicts > 0` |
| 2 | Docente con `availability=[]` | El docente nunca será asignado |
| 3 | Más cursos que bloques disponibles | Cursos excedentes aparecen en `unassigned[]` |
| 4 | Aula con capacidad insuficiente | La asignación es rechazada |
| 5 | Conflicto de horarios | El sistema evita la asignación inválida |
| 6 | Sin aulas registradas | `schedule[]` vacío, `conflicts` incrementa |

---

## 5. KPI y trazabilidad de objetivos

Esta sección establece los indicadores clave de desempeño (KPI) del sistema, garantizando trazabilidad entre los objetivos del proyecto, las métricas definidas y los resultados obtenidos durante la implementación.

| KPI | Objetivo asociado | Métrica | Umbral | Resultado PoC |
|-----|-------------------|---------|--------|---------------|
| KPI-01 | Minimizar cursos sin horario | `conflicts` | 0 conflictos | ✅ 0 |
| KPI-02 | Cobertura total de asignación | `totalAssigned / totalCursos` | ≥ 100% | ✅ 30/30 |
| KPI-03 | Calidad de la solución | `objectiveScore` | ≥ 0.70 | ✅ 0.72 |
| KPI-04 | Satisfacción de preferencias | `preferencesMet / totalAssigned` | maximizar | ✅ medido |
| KPI-05 | Tiempo de generación | ms para escenario máximo | ≤ 10 000 ms | ✅ 0.67 ms |
| KPI-06 | Tiempo de respuesta API | ms por endpoint REST | ≤ 2 000 ms | ✅ < 50 ms |
| KPI-07 | Cobertura de pruebas | % líneas cubiertas (Jest) | ≥ 70% | ✅ 100% |
| KPI-08 | Escalabilidad | Cursos procesados sin error | ≥ 20 cursos | ✅ 30 cursos |

### Fórmula de la función objetivo

```
objectiveScore = 0.7 × (cursosAsignados / totalCursos)
               + 0.3 × (preferencesMet / cursosAsignados)
```

> El `objectiveScore` es el KPI integrador del sistema. Un valor de `1.0` representa la solución óptima perfecta.

---

## 6. Integración con TDD

El desarrollo del sistema siguió el ciclo **Red → Green → Refactor**, asegurando que cada regla de negocio definida en esta especificación tenga al menos un test que la valide antes de su implementación.

### Criterios de aceptación por componente

#### Algoritmo scheduler (`schedule.test.js`)

| Criterio | Test asociado | Estado |
|----------|--------------|--------|
| HC1: sin solapamiento de docente | `TC-33` | ✅ |
| HC2: sin solapamiento de aula | `TC-34` | ✅ |
| HC3: disponibilidad del docente | test unitario | ✅ |
| SC1: preferencias del docente | test unitario | ✅ |
| SC2: distribución uniforme | test unitario | ✅ |
| Función objetivo `[0,1]` | test unitario | ✅ |
| Escenario máximo ≤ 10 000 ms | `TC-36` | ✅ |

#### Gestión de cursos (`course.test.js`)

| Criterio | Test asociado | Estado |
|----------|--------------|--------|
| Registro válido | `TC-01` | ✅ |
| Código duplicado rechazado | `TC-02` | ✅ |
| Campo vacío rechazado | `TC-03` | ✅ |
| Prerrequisito inexistente rechazado | `TC-04` | ✅ |

#### Gestión de docentes (`teacher.test.js`)

| Criterio | Test asociado | Estado |
|----------|--------------|--------|
| Registro válido | `TC-05` | ✅ |
| Correo duplicado rechazado | `TC-06` | ✅ |
| Correo inválido rechazado | `TC-07` | ✅ |
| Disponibilidad inválida rechazada | `TC-08` | ✅ |

### Resumen de cobertura

```
Tests:    29 passed / 29 total
Lines:    100%
Suites:   schedule.test.js · course.test.js · teacher.test.js
```

---

## 7. Coherencia regla — código — test

| Regla | Archivo de implementación | Archivo de test |
|-------|--------------------------|-----------------|
| HC1: docente no duplicado | `services/scheduler.js` | `tests/schedule.test.js` |
| HC2: aula no duplicada | `services/scheduler.js` | `tests/schedule.test.js` |
| HC3: capacidad de aula | `services/scheduler.js` | `tests/schedule.test.js` |
| HC5: disponibilidad docente | `services/scheduler.js` | `tests/teacher.test.js` |
| SC1: preferencias docentes | `services/scheduler.js` | `tests/schedule.test.js` |
| Función objetivo | `services/scheduler.js` | `tests/schedule.test.js` |
| Validación de cursos | `routes/course.js` | `tests/course.test.js` |
| Validación de docentes | `routes/teacher.js` | `tests/teacher.test.js` |

---

## 8. Reducción de ambigüedad

Esta especificación permitió definir claramente que las restricciones blandas (SC) no invalidan el horario generado — únicamente afectan el `objectiveScore`. Esto evitó implementar un algoritmo que rechazara soluciones válidas cuando no existían preferencias docentes registradas.

También permitió definir previamente la estructura exacta de `schedule[]` y `metrics`, reduciendo inconsistencias entre frontend y backend durante el desarrollo.

La distinción entre restricciones del **modelo de optimización** (HC, SC) y restricciones del **proyecto** (tiempo, recursos, alcance) evitó confusiones durante la planificación de sprints.

---

## 9. Anticipación de conflictos

Antes de implementar el sistema se identificaron los siguientes conflictos potenciales y se especificaron sus soluciones:

| Conflicto anticipado | Solución definida | Implementación |
|----------------------|-------------------|----------------|
| Solapamiento de docentes en mismo bloque | Definición de HC1, test `TC-33` previo al desarrollo | `busyTeacher[key]` |
| Más cursos que bloques disponibles | Manejo de `unassigned[]` en respuesta | `unassigned.push(course)` |
| Aula con capacidad insuficiente | Definición de HC3 y validación previa | verificación de capacidad |
| Docente sin disponibilidad registrada | HC5: docente nunca asignado si `availability=[]` | `availability.includes()` |
