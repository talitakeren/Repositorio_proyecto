# Documentación Técnica — SGOHA

**Sistema:** Sistema de Generación Óptima de Horarios Académicos  
**Stack:** MERN (MongoDB · Express.js · React.js · Node.js)  
**Versión:** 1.0.0 — PoC (Proof of Concept)  
**Puerto backend:** 5050 · **Puerto frontend:** 5173  

---

## 1. Arquitectura general

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
                       │ MongoDB Driver
┌──────────────────────▼──────────────────────────────────┐
│                  MongoDB (Atlas / Local)                │
│  courses · teachers · classrooms · students             │
│  enrollments · schedules                                │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Referencia completa de la API REST

Base URL: `http://localhost:5050`

---

### 2.1 Cursos — `/course`

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

### 2.2 Docentes — `/teacher`

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

> **Nota sobre `availability` y `preferences`:**  
> Los valores deben seguir el formato `"Día-HH-HH"` donde `Día` es uno de:
> `Lunes | Martes | Miércoles | Jueves | Viernes`  
> y `HH-HH` es uno de: `8-10 | 10-12 | 14-16 | 16-18`  
> `preferences` debe ser subconjunto de `availability` (restricción blanda SC1).

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

### 2.3 Aulas — `/classroom`

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

### 2.4 Estudiantes — `/student`

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

### 2.5 Matrícula — `/enrollment`

#### `POST /enrollment` — Registrar matrícula
El sistema valida automáticamente:
- Prerrequisitos cumplidos (RF-05)
- Créditos en rango 20–22 (RF-06)

```bash
curl -X POST http://localhost:5050/enrollment \
  -H "Content-Type: application/json" \
  -d '{
    "studentCode":     "2021001",
    "selectedCourses": ["MAT02", "FIS01", "QUI01", "PRG01", "HUM01"]
  }'
```

**Respuesta 200:** `"Matrícula registrada"`

**Respuesta 400 (prerrequisito faltante):**
```
"Falta prerrequisito MAT01 para MAT02"
```

**Respuesta 400 (créditos fuera de rango):**
```
"Créditos fuera de rango (20-22)"
```

---

### 2.6 Horario — `/schedule`

#### `GET /schedule/generate` — ⚡ Generar horario optimizado

Este es el endpoint principal. Ejecuta el algoritmo de backtracking con restricciones
(HC1, HC2, HC3) y restricciones blandas (SC1, SC2), calcula la función objetivo
y persiste el resultado en MongoDB.

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
    },
    {
      "course":          "Física I",
      "courseCode":      "FIS01",
      "teacher":         "Ana Torres",
      "classroom":       "A102",
      "day":             "Martes",
      "block":           "10-12",
      "meetsPreference": false
    }
  ],
  "totalAssigned":  2,
  "conflicts":      0,
  "unassigned":     [],
  "preferencesMet": 1,
  "objectiveScore": 0.85
}
```

**Log generado en consola del servidor:**
```
[SCHEDULE] Generado: 2 asignaciones | Conflictos: 0 | Preferencias cumplidas: 1 | objectiveScore: 0.85
```

**Campos de respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `schedule` | Array | Asignaciones exitosas |
| `totalAssigned` | number | Cursos con horario asignado |
| `conflicts` | number | Cursos sin asignar (incumplimiento HC) |
| `unassigned` | string[] | Nombres de cursos no asignados |
| `preferencesMet` | number | Bloques que coincidieron con SC1 |
| `objectiveScore` | number | Calidad [0,1] — 1.0 = solución óptima |
| `meetsPreference` | boolean | Si esa asignación cumplió SC1 |

#### `GET /schedule` — Ver último horario generado
```bash
curl http://localhost:5050/schedule
```
Retorna el array de asignaciones persistido en MongoDB desde la última ejecución.

---

## 3. Algoritmo de optimización (scheduler.js)

### Tipo de algoritmo
**Backtracking con heurística greedy** — variante del algoritmo CSP (Constraint Satisfaction Problem).

### Flujo de ejecución

```
Para cada curso (en orden de entrada):
  1. Ordenar días por menor carga acumulada (SC2 — distribución uniforme)
  2. Para cada día (ordenado):
     Para cada bloque horario [8-10, 10-12, 14-16, 16-18]:
       Para cada docente:
         ¿El bloque está en availability[]? → (HC3)
         ¿El docente ya está asignado en ese día+bloque? → (HC1)
         Para cada aula:
           ¿El aula ya está ocupada en ese día+bloque? → (HC2)
           → ASIGNAR y registrar en busyTeacher / busyClassroom
           → Verificar si cumple preference[] → incrementar preferencesMet (SC1)
           → break (pasar al siguiente curso)
  3. Si ninguna combinación es válida → agregar a unassigned[]

Calcular función objetivo:
  objectiveScore = 0.7 × (asignados/total) + 0.3 × (preferencias/asignados)
```

### Complejidad
- **Caso típico:** O(C × D × B × T × A) donde C=cursos, D=días, B=bloques, T=docentes, A=aulas
- **Escenario máximo validado:** 30C × 5D × 4B × 15T × 10A → **0.67 ms**

### Restricciones implementadas

| ID | Tipo | Implementación |
|----|------|----------------|
| HC1 | Dura | `busyTeacher["nombre\|día\|bloque"] = true` |
| HC2 | Dura | `busyClassroom["código\|día\|bloque"] = true` |
| HC3 | Dura | `teacher.availability.includes(slotKey)` |
| SC1 | Blanda | `teacher.preferences.includes(slotKey)` → `preferencesMet++` |
| SC2 | Blanda | `[...DAYS].sort((a,b) => coursesPerDay[a] - coursesPerDay[b])` |

---

## 4. Estructura del repositorio

```
Repositorio_proyecto/
├── backend/
│   ├── routes/
│   │   ├── course.js        # RF-01: CRUD cursos
│   │   ├── teacher.js       # RF-02: CRUD docentes + preferences
│   │   ├── classroom.js     # RF-03: CRUD aulas
│   │   ├── student.js       # RF-04: CRUD estudiantes
│   │   ├── enrollment.js    # RF-05/06: matrícula con validaciones
│   │   └── schedule.js      # RF-07: generación de horario
│   ├── services/
│   │   └── scheduler.js     # Algoritmo backtracking + FO
│   ├── db/
│   │   └── connection.js    # Conexión MongoDB
│   ├── tests/
│   │   ├── schedule.test.js # 18 tests: HC1-HC3, SC1-SC2, FO, rendimiento
│   │   ├── course.test.js   # 7 tests: validación RF-01
│   │   └── teacher.test.js  # 7 tests: validación RF-02
│   ├── server.js            # Entry point Express
│   ├── config.env           # Variables de entorno (no en Git)
│   └── package.json
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── ScheduleGenerator.jsx  # Panel métricas + tabla horario
│       │   ├── StudentSchedule.jsx    # Vista horario por día
│       │   ├── CourseForm.jsx         # Formulario cursos
│       │   ├── CourseList.jsx         # Listado cursos
│       │   ├── TeacherForm.jsx        # Formulario docentes
│       │   ├── TeacherList.jsx        # Listado docentes
│       │   ├── ClassroomList.jsx      # Listado aulas
│       │   └── StudentList.jsx        # Listado estudiantes
│       ├── components/
│       │   └── Navbar.jsx
│       ├── App.jsx
│       └── main.jsx
└── docs/
    ├── inicio/              # Project Charter, visión, supuestos
    ├── planeación/          # Backlog, cronograma, spec técnica
    ├── seguimiento/         # RNF-Metricas-Validacion.md
    ├── specs/               # schedule-generation.spec.md (SDD)
    ├── evidencias/          # Capturas del sistema funcionando
    └── documentacion-tecnica.md  ← este archivo
```

---

## 5. Instrucciones de ejecución

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

### Flujo de demo completo (para inspección)

```bash
# 1. Registrar aula
curl -X POST http://localhost:5050/classroom \
  -H "Content-Type: application/json" \
  -d '{"code":"A101","capacity":30,"type":"estándar"}'

# 2. Registrar docente con disponibilidad y preferencias
curl -X POST http://localhost:5050/teacher \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@uni.edu",
       "availability":["Lunes-8-10","Martes-10-12","Miércoles-14-16"],
       "preferences":["Lunes-8-10"]}'

# 3. Registrar curso
curl -X POST http://localhost:5050/course \
  -H "Content-Type: application/json" \
  -d '{"code":"MAT01","name":"Cálculo I","credits":4,
       "prerequisites":[],"classroomType":"estándar"}'

# 4. Generar horario optimizado
curl http://localhost:5050/schedule/generate

# Respuesta esperada:
# {
#   "schedule": [{"course":"Cálculo I","teacher":"Juan Pérez",
#                 "classroom":"A101","day":"Lunes","block":"8-10",
#                 "meetsPreference":true}],
#   "totalAssigned": 1,
#   "conflicts": 0,
#   "preferencesMet": 1,
#   "objectiveScore": 1.0
# }
```

---

## 6. Limitaciones reconocidas de la PoC

| Limitación | Descripción | Impacto en resultados |
|-----------|-------------|----------------------|
| Dataset exploratorio | Los datos son de prueba; no representan la escala real de la institución | El `objectiveScore` puede variar con datos reales |
| Disponibilidad de datos | La calidad depende del campo `availability[]` registrado manualmente por docente | Docentes sin disponibilidad generan conflictos automáticamente |
| Escala del algoritmo | Backtracking greedy es adecuado para ≤ 30 cursos; escala mayor requeriría algoritmo genético o ILP | No aplica en el alcance de esta PoC |
| Sin autenticación | RNF-04 (bcrypt, tokens) no implementado en esta PoC | Aceptable en entorno de demostración controlado |
| Preferencias no validadas con usuarios | `preferences[]` modela SC1 pero aún no se recolectaron preferencias reales de docentes | El componente `0.3 × preferenceRate` puede subestimarse |