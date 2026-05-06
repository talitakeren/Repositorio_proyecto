# Especificación de Casos Verificables — Generación de Horarios (RF-07)

**Sistema:** SGOHA — Sistema de Generación Óptima de Horarios Académicos  
**Enfoque:** Spec-Driven Development  
**Herramienta de trazabilidad:** Cada caso tiene ID trazable al test Jest correspondiente  
**Referencia de restricciones:** Ver `README.md` sección "Modelo de Timetabling"

---

## Formato de casos

Cada caso sigue la estructura **DADO / CUANDO / ENTONCES** (Gherkin-style):

```
DADO    → precondición: estado del sistema antes de la acción
CUANDO  → acción: invocación del sistema o función
ENTONCES → resultado esperado: comportamiento verificable y medible
TRAZA   → archivo y nombre del test Jest que lo implementa
```

---

## Grupo 1 — Restricciones DURAS (Hard Constraints)

### TC-32 — Generación válida sin conflictos

```
DADO    que existen 3 cursos, 2 docentes con availability definida en distintos bloques,
        y 2 aulas disponibles
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - El resultado contiene el campo "schedule" (array)
  - El resultado contiene el campo "metrics"
  - metrics.conflicts === 0
  - metrics.objectiveScore >= 0.7
  - schedule.length === 3  (todos los cursos fueron asignados)
TRAZA   → backend/tests/schedule.test.js › "TC-32: genera horario sin conflictos"
```

---

### TC-33 — HC1: Sin solapamiento de docente

```
DADO    que existen 2 cursos y 1 solo docente con availability en múltiples bloques
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún par de asignaciones en schedule comparte el mismo teacher Y el mismo day Y el mismo block
  - Es decir: no existe (a, b) tal que a.teacher === b.teacher && a.day === b.day && a.block === b.block
TRAZA   → backend/tests/schedule.test.js › "TC-33: HC1 sin solapamiento de docente"
```

---

### TC-34 — HC2: Sin solapamiento de aula

```
DADO    que existen 2 cursos, 2 docentes disponibles, y 1 sola aula
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún par de asignaciones en schedule comparte el mismo classroom Y el mismo day Y el mismo block
  - Es decir: no existe (a, b) tal que a.classroom === b.classroom && a.day === b.day && a.block === b.block
TRAZA   → backend/tests/schedule.test.js › "TC-34: HC2 sin solapamiento de aula"
```

---

### TC-35 — HC3: Respetar disponibilidad del docente

```
DADO    que existe 1 docente con availability = ["Lunes-8-10"] (un solo bloque disponible)
        y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - La asignación resultante tiene day === "Lunes" y block === "8-10"
  - No se genera ninguna asignación fuera de la availability del docente
TRAZA   → backend/tests/schedule.test.js › "TC-35: HC3 respeta availability del docente"
```

---

### TC-36 — HC3: Docente sin availability no se asigna

```
DADO    que existe 1 docente con availability = [] (sin bloques disponibles)
        y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - schedule.length === 0
  - metrics.conflicts === 1
  - metrics.unassigned incluye el nombre del curso
TRAZA   → backend/tests/schedule.test.js › "TC-36: HC3 docente sin availability produce conflicto"
```

---

### TC-37 — Sin solución posible (restricciones imposibles)

```
DADO    que existe 1 docente con availability = ["Lunes-8-10"]
        y 2 cursos a asignar (imposible: solo hay 1 bloque disponible para 1 docente)
        y 1 aula
CUANDO  se llama a generateSchedule(courses, [docente], [aula])
ENTONCES:
  - schedule.length === 1  (solo el primero se asigna)
  - metrics.conflicts === 1
  - metrics.unassigned.length === 1
  - metrics.objectiveScore < 1.0
TRAZA   → backend/tests/schedule.test.js › "TC-37: sin solución completa devuelve conflictos"
```

---

## Grupo 2 — Restricciones BLANDAS (Soft Constraints)

### TC-SC1 — SC1: Preferencias del docente se registran

```
DADO    que existe 1 docente con:
          availability  = ["Lunes-8-10", "Martes-10-12"]
          preferences   = ["Lunes-8-10"]
        y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - La asignación en schedule tiene meetsPreference === true
  - metrics.preferencesMet === 1
TRAZA   → backend/tests/schedule.test.js › "TC-SC1: SC1 registra preferencia cumplida"
```

---

### TC-SC2 — SC2: Distribución uniforme entre días

```
DADO    que existen 10 cursos, 5 docentes cada uno disponible en todos los bloques,
        y 5 aulas
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún día de la semana concentra más del 50% de las asignaciones
    (es decir, ningún día tiene más de 5 asignaciones de 10)
TRAZA   → backend/tests/schedule.test.js › "TC-SC2: SC2 distribuye cursos uniformemente"
```

---

## Grupo 3 — Función Objetivo

### TC-FO1 — objectiveScore está en rango [0, 1]

```
DADO    cualquier conjunto válido de entradas (courses, teachers, classrooms)
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - metrics.objectiveScore >= 0
  - metrics.objectiveScore <= 1
TRAZA   → backend/tests/schedule.test.js › "TC-FO1: objectiveScore en rango válido"
```

---

### TC-FO2 — objectiveScore óptimo cuando no hay conflictos ni preferencias insatisfechas

```
DADO    que existe 1 curso, 1 docente con availability = ["Lunes-8-10"]
        y preferences = ["Lunes-8-10"], y 1 aula
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - metrics.conflicts === 0
  - metrics.preferencesMet === 1
  - metrics.objectiveScore === 1.0
TRAZA   → backend/tests/schedule.test.js › "TC-FO2: objectiveScore es 1.0 en caso óptimo"
```

---

### TC-FO3 — objectiveScore refleja conflictos

```
DADO    que existen 2 cursos y solo 1 bloque disponible para 1 docente y 1 aula
CUANDO  se llama a generateSchedule(courses, [docente], [aula])
ENTONCES:
  - metrics.conflicts === 1
  - metrics.objectiveScore < 1.0
  - metrics.objectiveScore aproximadamente === 0.7 * (1/2) = 0.35
TRAZA   → backend/tests/schedule.test.js › "TC-FO3: objectiveScore baja con conflictos"
```

---

## Grupo 4 — Rendimiento y escala (RF-07 restricción no funcional)

### TC-36-PERF — Escenario máximo ≤ 10 segundos

```
DADO    que existen 30 cursos, 15 docentes con availability en todos los bloques,
        y 10 aulas
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - La función completa en ≤ 10,000 ms
  - schedule.length > 0
TRAZA   → backend/tests/schedule.test.js › "TC-36-PERF: escenario máximo ≤10s"
```

---

## Grupo 5 — Datos vacíos y casos borde

### TC-EDGE1 — Entradas vacías devuelven estructura válida

```
DADO    que se pasan arrays vacíos como entrada
CUANDO  se llama a generateSchedule([], [], [])
ENTONCES:
  - El resultado no lanza excepción
  - schedule === []
  - conflicts === 0
  - objectiveScore === 0
TRAZA   → backend/tests/schedule.test.js › "TC-EDGE1: entradas vacías devuelven estructura válida"
```

---

## Trazabilidad completa

| ID Spec       | RF / HC / SC    | Test Jest                                               | Estado   |
|--------------|-----------------|----------------------------------------------------------|----------|
| TC-32        | RF-07           | "TC-32: genera horario sin conflictos"                   | ✅ impl. |
| TC-33        | HC1             | "TC-33: HC1 sin solapamiento de docente"                 | ✅ impl. |
| TC-34        | HC2             | "TC-34: HC2 sin solapamiento de aula"                    | ✅ impl. |
| TC-35        | HC3             | "TC-35: HC3 respeta availability del docente"            | ✅ impl. |
| TC-36        | HC3             | "TC-36: HC3 docente sin availability produce conflicto"  | ✅ impl. |
| TC-37        | RF-07           | "TC-37: sin solución completa devuelve conflictos"       | ✅ impl. |
| TC-SC1       | SC1             | "TC-SC1: SC1 registra preferencia cumplida"              | ✅ impl. |
| TC-SC2       | SC2             | "TC-SC2: SC2 distribuye cursos uniformemente"            | ✅ impl. |
| TC-FO1       | Función Obj.    | "TC-FO1: objectiveScore en rango válido"                 | ✅ impl. |
| TC-FO2       | Función Obj.    | "TC-FO2: objectiveScore es 1.0 en caso óptimo"          | ✅ impl. |
| TC-FO3       | Función Obj.    | "TC-FO3: objectiveScore baja con conflictos"             | ✅ impl. |
| TC-36-PERF   | RNF (≤10s)      | "TC-36-PERF: escenario máximo ≤10s"                     | ✅ impl. |
| TC-EDGE1     | Borde           | "TC-EDGE1: entradas vacías devuelven estructura válida"  | ✅ impl. |