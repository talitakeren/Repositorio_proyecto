# Documentación Técnica — SGOHA

**Sistema:** Sistema de Generación Óptima de Horarios Académicos
**Stack:** MERN (MongoDB · Express.js · React.js · Node.js)
**Versión:** v1.0.0 — PoC (Proof of Concept)
**Puerto backend:** 5050 · **Puerto frontend:** 5173

---

## 1. Descripción general

El Sistema de Generación Óptima de Horarios Académicos (SGOHA) es una Prueba de Concepto (PoC) desarrollada para automatizar la asignación de horarios universitarios mediante técnicas de optimización basadas en Constraint Satisfaction Problem (CSP).

El sistema busca minimizar conflictos académicos y maximizar el aprovechamiento de recursos institucionales como docentes, aulas y bloques horarios disponibles.

Los principales problemas abordados son:

- Solapamiento de docentes.
- Solapamiento de aulas.
- Asignaciones fuera de disponibilidad.
- Mala distribución de la carga académica.
- Cursos sin horario asignado.

---

## 2. Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (React SPA)                  │
│           http://localhost:5173                         │
│                                                         │
│  ScheduleGenerator.jsx  ←→  StudentSchedule.jsx         │
│  CourseForm / CourseList   TeacherForm / TeacherList    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (fetch / REST)
┌──────────────────────▼──────────────────────────────────┐
│                  API REST (Express.js)                  │
│              http://localhost:5050                      │
│                                                         │
│  /course      /teacher     /classroom                   │
│  /student     /enrollment  /schedule                    │
│                      │                                  │
│            scheduler.js (algoritmo CSP)                 │
└──────────────────────┬──────────────────────────────────┘
                       │ MongoDB Driver / Mongoose
┌──────────────────────▼──────────────────────────────────┐
│                  MongoDB (Atlas / Local)                │
│  courses · teachers · classrooms · students             │
│  enrollments · schedules                                │
└─────────────────────────────────────────────────────────┘
```

### Colecciones principales

| Colección | Descripción |
|-----------|-------------|
| `courses` | Cursos académicos |
| `teachers` | Docentes con disponibilidad y preferencias |
| `classrooms` | Aulas con capacidad y tipo |
| `students` | Estudiantes con historial académico |
| `enrollments` | Matrículas validadas |
| `schedules` | Horarios generados por el algoritmo |

---

## 3. Modelo de optimización (CSP)

El problema fue modelado como un **Constraint Satisfaction Problem (CSP)**, donde cada asignación debe cumplir restricciones obligatorias y criterios de optimización.

### Variables de decisión

```
X(curso, docente, aula, día, bloque) ∈ {0, 1}
```

Donde `X = 1` indica que el `curso` fue asignado al `docente`, en el `aula`, durante el `día` y `bloque` especificados.

### Dominio

| Elemento | Valores posibles |
|----------|-----------------|
| Días | Lunes, Martes, Miércoles, Jueves, Viernes |
| Bloques horarios | 8-10, 10-12, 14-16, 16-18 |
| Docentes | Registrados en la base de datos con `availability[]` |
| Aulas | Registradas en la base de datos con `code` y `capacity` |

### Restricciones duras (Hard Constraints)

Deben cumplirse obligatoriamente. Una solución que las viole no es válida.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| HC1 | Sin solapamiento de docente | Un docente no puede dictar dos cursos en el mismo día y bloque |
| HC2 | Sin solapamiento de aula | Un aula no puede ser usada por dos cursos simultáneamente |
| HC3 | Disponibilidad del docente | Solo se asigna un docente en bloques incluidos en `availability[]` |

**Implementación:**

```js
// HC1 — control por clave "docente|día|bloque"
const teacherKey = `${teacher.name}|${day}|${block}`;
if (busyTeacher[teacherKey]) continue;

// HC2 — control por clave "aula|día|bloque"
const classroomKey = `${classroom.code}|${day}|${block}`;
if (busyClassroom[classroomKey]) continue;

// HC3 — verificación de availability
const isAvailable = teacher.availability.includes(`${day}-${block}`);
if (!isAvailable) continue;
```

### Restricciones blandas (Soft Constraints)

No invalidan la solución, pero mejoran su calidad.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| SC1 | Preferencias del docente | Prioriza bloques incluidos en `preferences[]` del docente |
| SC2 | Distribución uniforme | Distribuye cursos equitativamente entre los días de la semana |

### Función objetivo

La calidad de la solución se evalúa mediante:

```
objectiveScore = 0.7 × (cursosAsignados / totalCursos)
               + 0.3 × (preferencesMet / cursosAsignados)
```

| Componente | Peso | Significado |
|-----------|------|-------------|
| Tasa de asignación | 70% | Minimizar cursos sin horario |
| Tasa de preferencias | 30% | Maximizar satisfacción de preferencias del docente |
| `objectiveScore` | — | Rango `[0, 1]` — valor `1.0` = solución óptima |

**Interpretación del resultado:**

| Rango | Calidad |
|-------|---------|
| 1.00 | Óptima |
| 0.80 – 0.99 | Muy buena |
| 0.60 – 0.79 | Aceptable |
| < 0.60 | Mejorable |

---

## 4. Algoritmo implementado

**Tipo:** Backtracking con heurística Greedy — variante CSP.

### Flujo de ejecución

```
Para cada curso (en orden de entrada):
  1. Ordenar días por menor carga acumulada  →  SC2
  2. Para cada día (ordenado):
     Para cada bloque [8-10, 10-12, 14-16, 16-18]:
       Para cada docente:
         ¿El bloque está en availability[]?         →  HC3
         ¿El docente ya está asignado en día+bloque? →  HC1
         Para cada aula:
           ¿El aula ya está ocupada en día+bloque?  →  HC2
           → ASIGNAR: registrar en busyTeacher / busyClassroom
           → ¿Cumple preference[]?  →  preferencesMet++  (SC1)
           → break (pasar al siguiente curso)
  3. Si ninguna combinación es válida → agregar a unassigned[]

Calcular función objetivo:
  objectiveScore = 0.7 × (asignados/total) + 0.3 × (preferencias/asignados)
```

### Complejidad

- **Caso típico:** O(C × D × B × T × A) donde C=cursos, D=días, B=bloques, T=docentes, A=aulas
- **Escenario máximo validado:** 30C × 5D × 4B × 15T × 10A → **0.67 ms**

### Restricciones implementadas

| ID | Tipo | Implementación en código |
|----|------|--------------------------|
| HC1 | Dura | `busyTeacher["nombre\|día\|bloque"] = true` |
| HC2 | Dura | `busyClassroom["código\|día\|bloque"] = true` |
| HC3 | Dura | `teacher.availability.includes(slotKey)` |
| SC1 | Blanda | `teacher.preferences.includes(slotKey)` → `preferencesMet++` |
| SC2 | Blanda | `[...DAYS].sort((a,b) => coursesPerDay[a] - coursesPerDay[b])` |

---

## 5. Referencia de la API REST

**Base URL:** `http://localhost:5050`

---

### 5.1 Cursos — `/course`

#### `GET /course` — Listar todos los cursos

```bash
curl http://localhost:5050/course
```

**Respuesta 200:**
```json
[
  {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "code": "MAT01",
    "name": "Cálculo I",
    "credits": 4,
    "prerequisites": [],
    "classroomType": "estándar"
  }
]
```

#### `POST /course` — Registrar curso

```bash
curl -X POST http://localhost:5050/course \
  -H "Content-Type: application/json" \
  -d '{
    "code":          "MAT01",
    "name":          "Cálculo I",
    "credits":       4,
    "prerequisites": [],
    "classroomType": "estándar"
  }'
```

**Respuesta 200:**
```json
{ "acknowledged": true, "insertedId": "664a1b2c3d4e5f6a7b8c9d0e" }
```

#### `PATCH /course/:id` — Actualizar curso

```bash
curl -X PATCH http://localhost:5050/course/664a1b2c3d4e5f6a7b8c9d0e \
  -H "Content-Type: application/json" \
  -d '{ "credits": 3 }'
```

#### `DELETE /course/:id` — Eliminar curso

```bash
curl -X DELETE http://localhost:5050/course/664a1b2c3d4e5f6a7b8c9d0e
```

---

### 5.2 Docentes — `/teacher`

#### `GET /teacher` — Listar todos los docentes

```bash
curl http://localhost:5050/teacher
```

**Respuesta 200:**
```json
[
  {
    "_id": "664b2c3d4e5f6a7b8c9d0e1f",
    "name":         "Juan Pérez",
    "email":        "juan.perez@uni.edu",
    "availability": ["Lunes-8-10", "Martes-10-12", "Miércoles-14-16"],
    "preferences":  ["Lunes-8-10"]
  }
]
```

#### `POST /teacher` — Registrar docente

```bash
curl -X POST http://localhost:5050/teacher \
  -H "Content-Type: application/json" \
  -d '{
    "name":         "Juan Pérez",
    "email":        "juan.perez@uni.edu",
    "availability": ["Lunes-8-10", "Martes-10-12", "Miércoles-14-16"],
    "preferences":  ["Lunes-8-10"]
  }'
```

> **Formato de `availability` y `preferences`:** `"Día-HH-HH"` donde `Día` es uno de `Lunes | Martes | Miércoles | Jueves | Viernes` y `HH-HH` es uno de `8-10 | 10-12 | 14-16 | 16-18`. El campo `preferences` debe ser subconjunto de `availability` (restricción blanda SC1).

#### `PATCH /teacher/:id` — Actualizar docente

```bash
curl -X PATCH http://localhost:5050/teacher/664b2c3d4e5f6a7b8c9d0e1f \
  -H "Content-Type: application/json" \
  -d '{ "preferences": ["Lunes-8-10", "Martes-10-12"] }'
```

#### `DELETE /teacher/:id` — Eliminar docente

```bash
curl -X DELETE http://localhost:5050/teacher/664b2c3d4e5f6a7b8c9d0e1f
```

---

### 5.3 Aulas — `/classroom`

#### `GET /classroom` — Listar aulas

```bash
curl http://localhost:5050/classroom
```

**Respuesta 200:**
```json
[
  {
    "_id": "664c3d4e5f6a7b8c9d0e1f2a",
    "code":     "A101",
    "capacity": 30,
    "type":     "estándar"
  }
]
```

#### `POST /classroom` — Registrar aula

```bash
curl -X POST http://localhost:5050/classroom \
  -H "Content-Type: application/json" \
  -d '{
    "code":     "A101",
    "capacity": 30,
    "type":     "estándar"
  }'
```

---

### 5.4 Estudiantes — `/student`

#### `GET /student` — Listar estudiantes

```bash
curl http://localhost:5050/student
```

**Respuesta 200:**
```json
[
  {
    "_id": "664d4e5f6a7b8c9d0e1f2a3b",
    "code":            "2021001",
    "name":            "María López",
    "email":           "maria.lopez@uni.edu",
    "approvedCourses": ["MAT01"]
  }
]
```

#### `POST /student` — Registrar estudiante

```bash
curl -X POST http://localhost:5050/student \
  -H "Content-Type: application/json" \
  -d '{
    "code":            "2021001",
    "name":            "María López",
    "email":           "maria.lopez@uni.edu",
    "approvedCourses": ["MAT01"]
  }'
```

---

### 5.5 Matrícula — `/enrollment`

#### `POST /enrollment` — Registrar matrícula

El sistema valida automáticamente prerrequisitos (RF-05) y créditos en rango 20–22 (RF-06).

```bash
curl -X POST http://localhost:5050/enrollment \
  -H "Content-Type: application/json" \
  -d '{
    "studentCode":     "2021001",
    "selectedCourses": ["MAT02", "FIS01", "QUI01", "PRG01", "HUM01"]
  }'
```

| Respuesta | Código | Mensaje |
|-----------|--------|---------|
| Éxito | 200 | `"Matrícula registrada"` |
| Prerrequisito faltante | 400 | `"Falta prerrequisito MAT01 para MAT02"` |
| Créditos fuera de rango | 400 | `"Créditos fuera de rango (20-22)"` |

---

### 5.6 Horario — `/schedule`

#### `GET /schedule/generate` — Generar horario optimizado

Ejecuta el algoritmo backtracking con HC1, HC2, HC3, SC1 y SC2, calcula la función objetivo y persiste el resultado en MongoDB.

```bash
curl http://localhost:5050/schedule/generate
```

**Respuesta 200:**
```json
{
  "schedule": [
    {
      "course":          "Cálculo I",
      "courseCode":      "MAT01",
      "teacher":         "Juan Pérez",
      "classroom":       "A101",
      "day":             "Lunes",
      "block":           "8-10",
      "meetsPreference": true
    }
  ],
  "totalAssigned":  1,
  "conflicts":      0,
  "unassigned":     [],
  "preferencesMet": 1,
  "objectiveScore": 1.0
}
```

**Campos de respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `schedule` | Array | Asignaciones exitosas |
| `totalAssigned` | number | Cursos con horario asignado |
| `conflicts` | number | Cursos sin asignar por incumplimiento HC |
| `unassigned` | string[] | Nombres de cursos no asignados |
| `preferencesMet` | number | Bloques que coincidieron con SC1 |
| `objectiveScore` | number | Calidad `[0,1]` — `1.0` = solución óptima |
| `meetsPreference` | boolean | Si esa asignación cumplió SC1 |

#### `GET /schedule` — Ver último horario generado

```bash
curl http://localhost:5050/schedule
```

Retorna el array de asignaciones persistido en MongoDB desde la última ejecución.

---

## 6. Estructura del repositorio

```
Repositorio_proyecto/
├── docs/
│ ├── inicio/
│ ├── planificacion/
│ ├── ejecucion/
│ ├── seguimiento_control/
│ ├── cierre/
│ ├── otros/
│ └── informe_final.pdf
├── backend/
│ ├── tests/
│ └── ...
├── frontend/
│ ├── tests/
│ └── ...
├── .gitignore
└── README.md

```

---

## 7. Instrucciones de ejecución

### Prerequisitos

```bash
node --version   # v18 o superior
npm --version    # v8 o superior
```

### Levantar el sistema completo

```bash
# Terminal 1 — Backend
cd backend
npm install
node --env-file=config.env server.js
# Output esperado: "Servidor corriendo en puerto 5050"

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# Output esperado: "Local: http://localhost:5173"
```

### Ejecutar tests con cobertura

```bash
cd backend
npm test
# Output esperado:
# PASS tests/schedule.test.js
# PASS tests/teacher.test.js
# PASS tests/course.test.js
# Tests: 29 passed, 29 total
# Lines: 100%
```

### Flujo de demo completo

```bash
# 1. Registrar aula
curl -X POST http://localhost:5050/classroom \
  -H "Content-Type: application/json" \
  -d '{"code":"A101","capacity":30,"type":"estándar"}'

# 2. Registrar docente con disponibilidad y preferencias
curl -X POST http://localhost:5050/teacher \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Juan Pérez",
    "email":"juan@uni.edu",
    "availability":["Lunes-8-10","Martes-10-12","Miércoles-14-16"],
    "preferences":["Lunes-8-10"]
  }'

# 3. Registrar curso
curl -X POST http://localhost:5050/course \
  -H "Content-Type: application/json" \
  -d '{
    "code":"MAT01",
    "name":"Cálculo I",
    "credits":4,
    "prerequisites":[],
    "classroomType":"estándar"
  }'

# 4. Generar horario optimizado
curl http://localhost:5050/schedule/generate
# Resultado esperado: { "conflicts": 0, "objectiveScore": 1.0 }
```

---

## 8. Limitaciones reconocidas de la PoC

| Limitación | Descripción | Impacto |
|-----------|-------------|---------|
| Dataset exploratorio | Los datos son de prueba; no representan la escala real de la institución | El `objectiveScore` puede variar con datos reales |
| Disponibilidad de datos | La calidad depende del campo `availability[]` registrado manualmente | Docentes sin disponibilidad generan conflictos automáticamente |
| Escala del algoritmo | Backtracking greedy es adecuado para ≤ 30 cursos | Escala mayor requeriría algoritmo genético o programación lineal entera |
| Sin autenticación | No implementada en esta PoC | Aceptable en entorno de demostración controlado |
| Preferencias no validadas con usuarios | `preferences[]` modela SC1 pero no se recolectaron preferencias reales | El componente `0.3 × preferenceRate` puede subestimarse |