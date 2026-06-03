# Especificación de Casos Verificables — SGOHA

**Sistema:** SGOHA — Sistema de Generación Óptima de Horarios Académicos
**Enfoque:** Spec-Driven Development + TDD
 

---

## 1. Formato de casos

Cada caso sigue la estructura **DADO / CUANDO / ENTONCES** (Gherkin-style):

```
DADO      → precondición: estado del sistema antes de la acción
CUANDO    → acción: invocación del sistema o función
ENTONCES  → resultado esperado: comportamiento verificable y medible
TRAZA     → archivo y nombre del test Jest que lo implementa
```

---

## 2. Grupo 1 — Gestión de cursos (RF-01)

### TC-01 — Registro de curso válido

```
DADO    que se envían todos los campos obligatorios correctos:
        código único, nombre, créditos entre 1–6, tipo de aula válido
CUANDO  se llama a POST /course con los datos completos
ENTONCES:
  - El curso queda registrado en la base de datos
  - La respuesta contiene { acknowledged: true, insertedId: <id> }
  - Tiempo de respuesta ≤ 2 segundos
TRAZA   → backend/tests/course.test.js › "TC-01: registro de curso válido"
```

---

### TC-02 — Código de curso duplicado

```
DADO    que ya existe un curso con código "MAT01" en la base de datos
CUANDO  se intenta registrar otro curso con el mismo código "MAT01"
ENTONCES:
  - La operación es rechazada
  - La respuesta contiene un mensaje de error indicando código existente
  - No se crea un registro duplicado en la base de datos
TRAZA   → backend/tests/course.test.js › "TC-02: código duplicado rechazado"
```

---

### TC-03 — Campo obligatorio vacío

```
DADO    que se envía una solicitud de registro sin el campo "nombre"
CUANDO  se llama a POST /course con el campo faltante
ENTONCES:
  - La operación es rechazada antes de persistir
  - La respuesta contiene un mensaje de error de validación
TRAZA   → backend/tests/course.test.js › "TC-03: campo vacío rechazado"
```

---

### TC-04 — Prerrequisito inexistente

```
DADO    que se intenta registrar un curso con prerequisites: ["CODIGO_INEXISTENTE"]
CUANDO  se llama a POST /course
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el prerrequisito no existe en la base de datos
TRAZA   → backend/tests/course.test.js › "TC-04: prerrequisito inexistente rechazado"
```

---

## 3. Grupo 2 — Gestión de docentes (RF-02)

### TC-05 — Registro de docente válido

```
DADO    que se envían todos los campos obligatorios correctos:
        nombre, correo único con formato válido, availability con formato "Día-HH-HH"
CUANDO  se llama a POST /teacher con los datos completos
ENTONCES:
  - El docente queda registrado en la base de datos
  - La respuesta confirma el registro exitoso
  - Tiempo de respuesta ≤ 2 segundos
TRAZA   → backend/tests/teacher.test.js › "TC-05: registro de docente válido"
```

---

### TC-06 — Correo de docente duplicado

```
DADO    que ya existe un docente con correo "juan@uni.edu"
CUANDO  se intenta registrar otro docente con el mismo correo
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el correo ya está registrado
TRAZA   → backend/tests/teacher.test.js › "TC-06: correo duplicado rechazado"
```

---

### TC-07 — Correo con formato inválido

```
DADO    que se envía un correo con formato incorrecto (ej: "juanuni.edu")
CUANDO  se llama a POST /teacher
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el formato del correo es inválido
TRAZA   → backend/tests/teacher.test.js › "TC-07: correo inválido rechazado"
```

---

### TC-08 — Disponibilidad con formato inválido

```
DADO    que se envía availability con formato incorrecto (ej: ["lunes8", "LUNES-08:00"])
CUANDO  se llama a POST /teacher
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el formato de disponibilidad es inválido
  - El formato correcto esperado es "Día-HH-HH" (ej: "Lunes-8-10")
TRAZA   → backend/tests/teacher.test.js › "TC-08: disponibilidad inválida rechazada"
```

---

## 4. Grupo 3 — Gestión de aulas (RF-03)

### TC-10 — Registro de aula válida

```
DADO    que se envían todos los campos: código único, capacidad > 0, tipo válido
CUANDO  se llama a POST /classroom con los datos completos
ENTONCES:
  - El aula queda registrada en la base de datos
  - La respuesta confirma el registro exitoso
  - Tiempo de respuesta ≤ 2 segundos
TRAZA   → backend/tests/classroom.test.js › "TC-10: registro de aula válida"
```

---

### TC-11 — Código de aula duplicado

```
DADO    que ya existe un aula con código "A101"
CUANDO  se intenta registrar otra aula con el mismo código
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el código ya existe
TRAZA   → backend/tests/classroom.test.js › "TC-11: código de aula duplicado rechazado"
```

---

### TC-12 — Capacidad de aula inválida

```
DADO    que se envía una solicitud con capacidad = 0 o capacidad negativa
CUANDO  se llama a POST /classroom
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que la capacidad debe ser mayor a 0
TRAZA   → backend/tests/classroom.test.js › "TC-12: capacidad inválida rechazada"
```

---

### TC-13 — Tipo de aula inválido

```
DADO    que se envía tipo = "auditorio" (valor fuera del enum permitido)
CUANDO  se llama a POST /classroom
ENTONCES:
  - La operación es rechazada
  - La respuesta indica que el tipo debe ser "estándar" o "laboratorio"
TRAZA   → backend/tests/classroom.test.js › "TC-13: tipo de aula inválido rechazado"
```

---

## 5. Grupo 4 — Gestión de estudiantes (RF-04)

### TC-15 — Registro de estudiante válido

```
DADO    que se envían todos los campos: código único, nombre, correo válido único
CUANDO  se llama a POST /student con los datos completos
ENTONCES:
  - El estudiante queda registrado en la base de datos
  - La respuesta confirma el registro exitoso
  - Tiempo de respuesta ≤ 2 segundos
TRAZA   → backend/tests/student.test.js › "TC-15: registro de estudiante válido"
```

---

### TC-20 — Actualización de historial académico

```
DADO    que existe un estudiante registrado con approvedCourses: []
CUANDO  se llama a PATCH /student/:id con approvedCourses: ["MAT01"]
ENTONCES:
  - El historial queda actualizado en la base de datos
  - La respuesta confirma la actualización exitosa
  - Los demás campos del estudiante no se modifican
TRAZA   → backend/tests/student.test.js › "TC-20: historial académico actualizado"
```

---

## 6. Grupo 5 — Validación de prerrequisitos (RF-05)

### TC-21 — Matrícula permitida: cumple prerrequisitos

```
DADO    que el estudiante tiene approvedCourses: ["MAT01"]
        y el curso a matricular tiene prerequisites: ["MAT01"]
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La matrícula es permitida y registrada
  - La respuesta confirma "Matrícula registrada"
  - Tiempo de respuesta ≤ 1 segundo
TRAZA   → backend/tests/enrollment.test.js › "TC-21: matrícula permitida con prerrequisitos"
```

---

### TC-22 — Matrícula rechazada: falta un prerrequisito

```
DADO    que el estudiante tiene approvedCourses: []
        y el curso a matricular tiene prerequisites: ["MAT01"]
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La matrícula es rechazada
  - La respuesta indica exactamente qué prerrequisito falta:
    "Falta prerrequisito MAT01 para <curso>"
TRAZA   → backend/tests/enrollment.test.js › "TC-22: matrícula rechazada por prerrequisito faltante"
```

---

### TC-24 — Matrícula permitida: curso sin prerrequisitos

```
DADO    que el curso a matricular tiene prerequisites: [] (ninguno)
        independientemente del historial del estudiante
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La validación de prerrequisitos es omitida correctamente
  - La matrícula continúa al siguiente paso de validación
TRAZA   → backend/tests/enrollment.test.js › "TC-24: curso sin prerrequisitos permitido"
```

---

## 7. Grupo 6 — Validación de créditos (RF-06)

### TC-26 — Matrícula permitida: 21 créditos (dentro del rango)

```
DADO    que los cursos seleccionados suman 21 créditos en total
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La validación de créditos es aprobada
  - La matrícula es registrada exitosamente
TRAZA   → backend/tests/enrollment.test.js › "TC-26: 21 créditos dentro del rango permitido"
```

---

### TC-27 — Matrícula permitida: 20 créditos (límite inferior)

```
DADO    que los cursos seleccionados suman exactamente 20 créditos
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La validación de créditos es aprobada (límite inferior válido)
  - La matrícula es registrada exitosamente
TRAZA   → backend/tests/enrollment.test.js › "TC-27: 20 créditos en límite inferior"
```

---

### TC-28 — Matrícula permitida: 22 créditos (límite superior)

```
DADO    que los cursos seleccionados suman exactamente 22 créditos
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La validación de créditos es aprobada (límite superior válido)
  - La matrícula es registrada exitosamente
TRAZA   → backend/tests/enrollment.test.js › "TC-28: 22 créditos en límite superior"
```

---

### TC-29 — Matrícula rechazada: créditos insuficientes

```
DADO    que los cursos seleccionados suman 19 créditos (bajo el mínimo)
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La matrícula es rechazada
  - La respuesta indica: "Créditos fuera de rango (20-22)"
TRAZA   → backend/tests/enrollment.test.js › "TC-29: matrícula rechazada por créditos insuficientes"
```

---

### TC-30 — Matrícula rechazada: exceso de créditos

```
DADO    que los cursos seleccionados suman 23 créditos (sobre el máximo)
CUANDO  se llama a POST /enrollment
ENTONCES:
  - La matrícula es rechazada
  - La respuesta indica: "Créditos fuera de rango (20-22)"
TRAZA   → backend/tests/enrollment.test.js › "TC-30: matrícula rechazada por exceso de créditos"
```

---

## 8. Grupo 7 — Generación de horarios: restricciones duras (RF-07)

### TC-32 — Generación válida sin conflictos

```
DADO    que existen 3 cursos, 2 docentes con availability definida en distintos bloques
        y 2 aulas disponibles
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - schedule.length === 3 (todos los cursos fueron asignados)
  - metrics.conflicts === 0
  - metrics.objectiveScore >= 0.7
TRAZA   → backend/tests/schedule.test.js › "TC-32: genera horario sin conflictos"
```

---

### TC-33 — HC1: Sin solapamiento de docente

```
DADO    que existen 2 cursos y 1 solo docente con availability en múltiples bloques
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún par de asignaciones comparte el mismo teacher, day y block simultáneamente
  - No existe (a, b) tal que: a.teacher === b.teacher && a.day === b.day && a.block === b.block
TRAZA   → backend/tests/schedule.test.js › "TC-33: HC1 sin solapamiento de docente"
```

---

### TC-34 — HC2: Sin solapamiento de aula

```
DADO    que existen 2 cursos, 2 docentes disponibles y 1 sola aula
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún par de asignaciones comparte el mismo classroom, day y block simultáneamente
  - No existe (a, b) tal que: a.classroom === b.classroom && a.day === b.day && a.block === b.block
TRAZA   → backend/tests/schedule.test.js › "TC-34: HC2 sin solapamiento de aula"
```

---

### TC-35 — HC3: Respetar disponibilidad del docente

```
DADO    que existe 1 docente con availability = ["Lunes-8-10"] y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - La asignación resultante tiene day === "Lunes" y block === "8-10"
  - No se genera ninguna asignación fuera de la availability del docente
TRAZA   → backend/tests/schedule.test.js › "TC-35: HC3 respeta availability del docente"
```

---

### TC-36 — HC3: Docente sin availability no se asigna

```
DADO    que existe 1 docente con availability = [] y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - schedule.length === 0
  - metrics.conflicts === 1
  - metrics.unassigned incluye el nombre del curso
TRAZA   → backend/tests/schedule.test.js › "TC-36: HC3 docente sin availability produce conflicto"
```

---

### TC-37 — Sin solución posible (recursos insuficientes)

```
DADO    que existe 1 docente con availability = ["Lunes-8-10"]
        y 2 cursos a asignar (imposible: solo hay 1 bloque disponible)
        y 1 aula
CUANDO  se llama a generateSchedule(courses, [docente], [aula])
ENTONCES:
  - schedule.length === 1 (solo el primero se asigna)
  - metrics.conflicts === 1
  - metrics.unassigned.length === 1
  - metrics.objectiveScore < 1.0
TRAZA   → backend/tests/schedule.test.js › "TC-37: sin solución completa devuelve conflictos"
```

---

## 9. Grupo 8 — Generación de horarios: restricciones blandas (RF-07)

### TC-SC1 — SC1: Preferencias del docente se registran

```
DADO    que existe 1 docente con:
          availability = ["Lunes-8-10", "Martes-10-12"]
          preferences  = ["Lunes-8-10"]
        y 1 curso a asignar
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - La asignación tiene meetsPreference === true
  - metrics.preferencesMet === 1
TRAZA   → backend/tests/schedule.test.js › "TC-SC1: SC1 registra preferencia cumplida"
```

---

### TC-SC2 — SC2: Distribución uniforme entre días

```
DADO    que existen 10 cursos, 5 docentes disponibles en todos los bloques y 5 aulas
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - Ningún día concentra más del 50% de las asignaciones
  - Ningún día tiene más de 5 asignaciones de un total de 10
TRAZA   → backend/tests/schedule.test.js › "TC-SC2: SC2 distribuye cursos uniformemente"
```

---

## 10. Grupo 9 — Función objetivo (RF-07)

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

### TC-FO2 — objectiveScore óptimo (sin conflictos, preferencias cumplidas)

```
DADO    que existe 1 curso, 1 docente con:
          availability = ["Lunes-8-10"]
          preferences  = ["Lunes-8-10"]
        y 1 aula
CUANDO  se llama a generateSchedule([curso], [docente], [aula])
ENTONCES:
  - metrics.conflicts === 0
  - metrics.preferencesMet === 1
  - metrics.objectiveScore === 1.0
TRAZA   → backend/tests/schedule.test.js › "TC-FO2: objectiveScore es 1.0 en caso óptimo"
```

---

### TC-FO3 — objectiveScore baja con conflictos

```
DADO    que existen 2 cursos y solo 1 bloque disponible para 1 docente y 1 aula
CUANDO  se llama a generateSchedule(courses, [docente], [aula])
ENTONCES:
  - metrics.conflicts === 1
  - metrics.objectiveScore < 1.0
  - metrics.objectiveScore ≈ 0.7 × (1/2) = 0.35
TRAZA   → backend/tests/schedule.test.js › "TC-FO3: objectiveScore baja con conflictos"
```

---

## 11. Grupo 10 — Rendimiento y escala (RF-07)

### TC-36-PERF — Escenario máximo ≤ 10 segundos

```
DADO    que existen 30 cursos, 15 docentes con availability en todos los bloques
        y 10 aulas
CUANDO  se llama a generateSchedule(courses, teachers, classrooms)
ENTONCES:
  - La función completa en ≤ 10 000 ms
  - schedule.length > 0
  - Resultado validado: 0.71 ms en Node.js v22 (escenario real ejecutado)
TRAZA   → backend/tests/schedule.test.js › "TC-36-PERF: escenario máximo ≤10s"
```

---

## 12. Grupo 11 — Visualización de horarios (RF-08, RF-09, RF-10)

### TC-38 — RF-08: Visualización de horario por estudiante

```
DADO    que existe un horario generado válido y un id_estudiante registrado
CUANDO  se consulta GET /schedule con el id del estudiante
ENTONCES:
  - La respuesta muestra la grilla semanal del estudiante
  - Cada bloque contiene: curso, docente y aula
  - No existen solapamientos visibles en la grilla
  - Tiempo de carga ≤ 2 segundos
TRAZA   → RF-08 validado manualmente en frontend
```

---

### TC-43 — RF-09: Visualización de horario por docente

```
DADO    que existe un horario generado válido y un id_docente registrado con cursos asignados
CUANDO  se consulta la vista de horario del docente
ENTONCES:
  - Se muestran todos los cursos asignados al docente
  - Cada entrada contiene: curso, día, hora y aula
  - No existen solapamientos en la carga del docente
  - Tiempo de carga ≤ 2 segundos
TRAZA   → RF-09 validado manualmente en frontend
```

---

### TC-48 — RF-10: Visualización de ocupación por aula

```
DADO    que existe un horario generado válido y un id_aula registrada
CUANDO  se consulta la vista de ocupación del aula
ENTONCES:
  - Se muestra la ocupación por franja horaria
  - Cada franja ocupada indica: curso y docente
  - Las franjas libres son identificables visualmente
  - Tiempo de carga ≤ 2 segundos
TRAZA   → RF-10 validado manualmente en frontend
```

---

## 13. Grupo 12 — Datos vacíos y casos borde

### TC-EDGE1 — Entradas vacías devuelven estructura válida

```
DADO    que se pasan arrays vacíos como entrada
CUANDO  se llama a generateSchedule([], [], [])
ENTONCES:
  - La función no lanza excepción
  - schedule === []
  - conflicts === 0
  - objectiveScore === 0
TRAZA   → backend/tests/schedule.test.js › "TC-EDGE1: entradas vacías devuelven estructura válida"
```

---

## 14. Trazabilidad completa

| ID | RF / HC / SC | Descripción | Test Jest | Estado |
|----|-------------|-------------|-----------|--------|
| TC-01 | RF-01 | Registro de curso válido | `course.test.js` | ✅ |
| TC-02 | RF-01 | Código duplicado rechazado | `course.test.js` | ✅ |
| TC-03 | RF-01 | Campo vacío rechazado | `course.test.js` | ✅ |
| TC-04 | RF-01 | Prerrequisito inexistente rechazado | `course.test.js` | ✅ |
| TC-05 | RF-02 | Registro de docente válido | `teacher.test.js` | ✅ |
| TC-06 | RF-02 | Correo duplicado rechazado | `teacher.test.js` | ✅ |
| TC-07 | RF-02 | Correo inválido rechazado | `teacher.test.js` | ✅ |
| TC-08 | RF-02 | Disponibilidad inválida rechazada | `teacher.test.js` | ✅ |
| TC-10 | RF-03 | Registro de aula válida | `classroom.test.js` | ✅ |
| TC-11 | RF-03 | Código de aula duplicado rechazado | `classroom.test.js` | ✅ |
| TC-12 | RF-03 | Capacidad inválida rechazada | `classroom.test.js` | ✅ |
| TC-13 | RF-03 | Tipo de aula inválido rechazado | `classroom.test.js` | ✅ |
| TC-15 | RF-04 | Registro de estudiante válido | `student.test.js` | ✅ |
| TC-20 | RF-04 | Historial académico actualizado | `student.test.js` | ✅ |
| TC-21 | RF-05 | Matrícula permitida con prerrequisitos | `enrollment.test.js` | ✅ |
| TC-22 | RF-05 | Matrícula rechazada por prerrequisito faltante | `enrollment.test.js` | ✅ |
| TC-24 | RF-05 | Curso sin prerrequisitos permitido | `enrollment.test.js` | ✅ |
| TC-26 | RF-06 | 21 créditos dentro del rango | `enrollment.test.js` | ✅ |
| TC-27 | RF-06 | 20 créditos en límite inferior | `enrollment.test.js` | ✅ |
| TC-28 | RF-06 | 22 créditos en límite superior | `enrollment.test.js` | ✅ |
| TC-29 | RF-06 | Créditos insuficientes rechazados | `enrollment.test.js` | ✅ |
| TC-30 | RF-06 | Exceso de créditos rechazado | `enrollment.test.js` | ✅ |
| TC-32 | RF-07 | Generación válida sin conflictos | `schedule.test.js` | ✅ |
| TC-33 | HC1 | Sin solapamiento de docente | `schedule.test.js` | ✅ |
| TC-34 | HC2 | Sin solapamiento de aula | `schedule.test.js` | ✅ |
| TC-35 | HC3 | Respeta availability del docente | `schedule.test.js` | ✅ |
| TC-36 | HC3 | Docente sin availability produce conflicto | `schedule.test.js` | ✅ |
| TC-37 | RF-07 | Sin solución completa devuelve conflictos | `schedule.test.js` | ✅ |
| TC-SC1 | SC1 | Preferencia cumplida registrada | `schedule.test.js` | ✅ |
| TC-SC2 | SC2 | Distribución uniforme entre días | `schedule.test.js` | ✅ |
| TC-FO1 | Func. Obj. | objectiveScore en rango [0,1] | `schedule.test.js` | ✅ |
| TC-FO2 | Func. Obj. | objectiveScore = 1.0 en caso óptimo | `schedule.test.js` | ✅ |
| TC-FO3 | Func. Obj. | objectiveScore baja con conflictos | `schedule.test.js` | ✅ |
| TC-36-PERF | RNF | Escenario máximo ≤ 10 000 ms | `schedule.test.js` | ✅ |
| TC-38 | RF-08 | Visualización horario por estudiante | Frontend manual | ✅ |
| TC-43 | RF-09 | Visualización horario por docente | Frontend manual | ✅ |
| TC-48 | RF-10 | Visualización ocupación por aula | Frontend manual | ✅ |
| TC-EDGE1 | Borde | Entradas vacías devuelven estructura válida | `schedule.test.js` | ✅ |