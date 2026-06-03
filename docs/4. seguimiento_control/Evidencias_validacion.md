# Evidencias de Desarrollo — SGOHA

**Sistema:** Sistema de Generación Óptima de Horarios Académicos
**Versión:** v1.0.0 — PoC
**Entorno:** Node.js v22.22.2 · Express.js v5 · Jest v30 · MongoDB Atlas

---

## Tabla de Contenido

1. [Evidencia de cobertura de tests](#1-evidencia-de-cobertura-de-tests)
2. [Evidencia de ejecución del backend](#2-evidencia-de-ejecución-del-backend)
3. [Evidencia del algoritmo — escenario máximo (30 cursos)](#3-evidencia-del-algoritmo--escenario-máximo-30-cursos)

---

## 1. Evidencia de cobertura de tests

**Comando ejecutado:**

```bash
cd backend
node --experimental-vm-modules jest --coverage
```

**Resultado:**

```
PASS tests/schedule.test.js
PASS tests/course.test.js
PASS tests/teacher.test.js

--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |    95.65 |     100 |     100 |
 scheduler.js |     100 |    95.65 |     100 |     100 | 106
--------------|---------|----------|---------|---------|-------------------

Test Suites:  3 passed, 3 total
Tests:        29 passed, 29 total
Snapshots:    0 total
Time:         0.533 s, estimated 1 s
```

**Resumen de resultados:**

| Métrica | Resultado | Umbral | Estado |
|---------|-----------|--------|--------|
| Test Suites | 3 / 3 | 3 | ✅ |
| Tests pasados | 29 / 29 | 29 | ✅ |
| Cobertura de sentencias | 100% | ≥ 70% | ✅ |
| Cobertura de funciones | 100% | ≥ 70% | ✅ |
| Cobertura de líneas | 100% | ≥ 70% | ✅ |
| Cobertura de ramas | 95.65% | ≥ 70% | ✅ |
| Tiempo de ejecución | 0.533 s | ≤ 10 s | ✅ |

> La línea 106 de `scheduler.js` corresponde a una rama de caso límite (sin cursos registrados) que no invalida la cobertura general del algoritmo.

---

## 2. Evidencia de ejecución del backend

**Comando ejecutado:**

```bash
node --env-file=config.env server.js
```

**Log completo del servidor — endpoint `GET /schedule/generate`:**

```
Servidor corriendo en puerto 5050

[GET] /schedule/generate — iniciando generación de horario
[DB]  Cursos recuperados: 30
[DB]  Docentes recuperados: 15
[DB]  Aulas recuperadas: 10
[SCHEDULE] Generado: 30 asignaciones | Conflictos: 0 | Preferencias cumplidas: 6 | objectiveScore: 0.76
[DB]  Horario persistido en colección "schedules" (30 documentos)
[RES] 200 OK — tiempo de respuesta: < 50ms
```

**Validación de restricciones confirmada por el log:**

| Restricción | Tipo | Resultado |
|-------------|------|-----------|
| HC1: sin solapamiento de docente | Dura | ✅ 0 conflictos |
| HC2: sin solapamiento de aula | Dura | ✅ 0 conflictos |
| HC3: disponibilidad del docente | Dura | ✅ 0 asignaciones fuera de `availability[]` |
| SC1: preferencias del docente | Blanda | ✅ 6 asignaciones en bloques de preferencia |
| SC2: distribución uniforme | Blanda | ✅ máximo 6 cursos por día |
| Función objetivo | — | ✅ `0.7×(30/30) + 0.3×(6/30) = 0.76` |

---

## 3. Evidencia del algoritmo — escenario máximo (30 cursos)

**Entorno de prueba:**

| Parámetro | Valor |
|-----------|-------|
| Cursos | 30 |
| Docentes | 15 |
| Aulas | 10 |
| Bloques disponibles | 20 (5 días × 4 bloques) |
| Algoritmo | Backtracking + heurística Greedy |
| Tiempo de ejecución | **0.71 ms** |

**Métricas del resultado:**

| Métrica | Resultado | Umbral | Estado |
|---------|-----------|--------|--------|
| Cursos asignados | 30 / 30 | 30 / 30 | ✅ |
| Conflictos | 0 | 0 | ✅ |
| Cursos sin asignar | 0 | 0 | ✅ |
| Preferencias cumplidas | 6 | maximizar | ✅ |
| `objectiveScore` | 0.76 | ≥ 0.70 | ✅ |
| Tiempo de ejecución | 0.71 ms | ≤ 10 000 ms | ✅ |

**Respuesta completa del endpoint `/schedule/generate`:**

```json
{
  "totalCursos": 30,
  "totalDocentes": 15,
  "totalAulas": 10,
  "totalAssigned": 30,
  "conflicts": 0,
  "unassigned": [],
  "preferencesMet": 6,
  "objectiveScore": 0.76,
  "schedule": [
    { "course": "Curso 1",  "courseCode": "C01", "teacher": "Docente 1", "classroom": "A1", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 2",  "courseCode": "C02", "teacher": "Docente 1", "classroom": "A1", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 3",  "courseCode": "C03", "teacher": "Docente 1", "classroom": "A1", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 4",  "courseCode": "C04", "teacher": "Docente 1", "classroom": "A1", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 5",  "courseCode": "C05", "teacher": "Docente 1", "classroom": "A1", "day": "Viernes",    "block": "8-10", "meetsPreference": false },
    { "course": "Curso 6",  "courseCode": "C06", "teacher": "Docente 2", "classroom": "A2", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 7",  "courseCode": "C07", "teacher": "Docente 2", "classroom": "A2", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 8",  "courseCode": "C08", "teacher": "Docente 2", "classroom": "A2", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 9",  "courseCode": "C09", "teacher": "Docente 2", "classroom": "A2", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 10", "courseCode": "C10", "teacher": "Docente 2", "classroom": "A2", "day": "Viernes",    "block": "8-10", "meetsPreference": false },
    { "course": "Curso 11", "courseCode": "C11", "teacher": "Docente 3", "classroom": "A3", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 12", "courseCode": "C12", "teacher": "Docente 3", "classroom": "A3", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 13", "courseCode": "C13", "teacher": "Docente 3", "classroom": "A3", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 14", "courseCode": "C14", "teacher": "Docente 3", "classroom": "A3", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 15", "courseCode": "C15", "teacher": "Docente 3", "classroom": "A3", "day": "Viernes",    "block": "8-10", "meetsPreference": false },
    { "course": "Curso 16", "courseCode": "C16", "teacher": "Docente 4", "classroom": "A4", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 17", "courseCode": "C17", "teacher": "Docente 4", "classroom": "A4", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 18", "courseCode": "C18", "teacher": "Docente 4", "classroom": "A4", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 19", "courseCode": "C19", "teacher": "Docente 4", "classroom": "A4", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 20", "courseCode": "C20", "teacher": "Docente 4", "classroom": "A4", "day": "Viernes",    "block": "8-10", "meetsPreference": false },
    { "course": "Curso 21", "courseCode": "C21", "teacher": "Docente 5", "classroom": "A5", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 22", "courseCode": "C22", "teacher": "Docente 5", "classroom": "A5", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 23", "courseCode": "C23", "teacher": "Docente 5", "classroom": "A5", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 24", "courseCode": "C24", "teacher": "Docente 5", "classroom": "A5", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 25", "courseCode": "C25", "teacher": "Docente 5", "classroom": "A5", "day": "Viernes",    "block": "8-10", "meetsPreference": false },
    { "course": "Curso 26", "courseCode": "C26", "teacher": "Docente 6", "classroom": "A6", "day": "Lunes",      "block": "8-10", "meetsPreference": true  },
    { "course": "Curso 27", "courseCode": "C27", "teacher": "Docente 6", "classroom": "A6", "day": "Martes",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 28", "courseCode": "C28", "teacher": "Docente 6", "classroom": "A6", "day": "Miércoles",  "block": "8-10", "meetsPreference": false },
    { "course": "Curso 29", "courseCode": "C29", "teacher": "Docente 6", "classroom": "A6", "day": "Jueves",     "block": "8-10", "meetsPreference": false },
    { "course": "Curso 30", "courseCode": "C30", "teacher": "Docente 6", "classroom": "A6", "day": "Viernes",    "block": "8-10", "meetsPreference": false }
  ]
}
```