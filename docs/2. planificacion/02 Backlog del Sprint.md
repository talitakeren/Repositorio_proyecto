# Backlog del Sprint

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
**Dueño del Producto:** Coordinador Académico / Scrum Master

---

## Sprint 1

**Duración:** 21 días  
**Esfuerzo total:** 72 puntos  
**Meta:** Configuración inicial del proyecto, arquitectura base MERN y modelos de datos

| ID Tarea | Tarea | Historia | Responsable | Estado | Est. |
|----------|-------|----------|-------------|--------|------|
| T-01.1 | Diseñar modelo de datos Course en MongoDB (nombre, código, créditos, prerrequisitos, tipoAula) | HU-01 | Juan Carlos | 📋 Por Hacer | 8 |
| T-01.2 | Implementar endpoint POST /api/courses con validación de campos obligatorios | HU-01 | Juan Carlos | 📋 Por Hacer | 10 |
| T-01.3 | Implementar endpoints GET, PUT, DELETE /api/courses/:id | HU-01 | Tatiana | 📋 Por Hacer | 8 |
| T-01.4 | Desarrollar componente React "Formulario de Curso" con campos y validaciones frontend | HU-01 | Tatiana | 📋 Por Hacer | 8 |
| T-01.5 | Desarrollar vista listado de cursos con opciones de edición y eliminación | HU-01 | Alexandra | 📋 Por Hacer | 10 |
| T-02.1 | Diseñar modelo Teacher en MongoDB (nombre, correo, disponibilidad: arreglo franjas día-hora) | HU-02 | Alexandra | 📋 Por Hacer | 8 |
| T-02.2 | Implementar endpoints CRUD /api/teachers con validación de correo único | HU-02 | Yenifer | 📋 Por Hacer | 6 |
| T-02.3 | Desarrollar componente React para registro y edición de disponibilidad horaria (selector día/hora) | HU-02 | Yenifer | 📋 Por Hacer | 8 |
| T-02.4 | Desarrollar vista listado de docentes con disponibilidad resumida | HU-02 | Talita | 📋 Por Hacer | 6 |

---

## Sprint 2

**Duración:** 15 días  
**Esfuerzo total:** 148 puntos  
**Meta:** CRUD de entidades (cursos, docentes, aulas, estudiantes) y validación de matrícula

| ID Tarea | Tarea | Historia | Responsable | Estado | Est. |
|----------|-------|----------|-------------|--------|------|
| T-03.1 | Diseñar modelo Classroom en MongoDB (código, capacidad, tipo) | HU-03 | Juan Carlos | 📋 Por Hacer | 13 |
| T-03.2 | Implementar endpoints CRUD /api/classrooms | HU-03 | Juan Carlos | 📋 Por Hacer | 16 |
| T-03.3 | Desarrollar componente React "Formulario de Aula" con validaciones (capacidad > 0, tipo requerido) | HU-03 | Tatiana | 📋 Por Hacer | 10 |
| T-03.4 | Desarrollar vista catálogo de aulas con filtro por tipo | HU-03 | Tatiana | 📋 Por Hacer | 16 |
| T-04.1 | Diseñar modelo Student en MongoDB (código, nombre, correo, cursosAprobados[]) | HU-04 | Alexandra | 📋 Por Hacer | 13 |
| T-04.2 | Implementar endpoints CRUD /api/students | HU-04 | Alexandra | 📋 Por Hacer | 8 |
| T-04.3 | Desarrollar componente React "Formulario de Estudiante" con selección múltiple de cursos aprobados | HU-04 | Yenifer | 📋 Por Hacer | 8 |
| T-04.4 | Desarrollar vista listado de estudiantes con búsqueda por código o nombre | HU-04 | Yenifer | 📋 Por Hacer | 8 |
| T-05.1 | Implementar servicio backend de validación de prerrequisitos (recorrido del grafo de dependencias) | HU-05 | Talita | 📋 Por Hacer | 8 |
| T-05.2 | Integrar validación en endpoint POST /api/enrollments; respuesta 422 con detalle del prerrequisito faltante | HU-05 | Talita | 📋 Por Hacer | 8 |
| T-05.3 | Desarrollar interfaz de matrícula con selector de cursos e indicadores de estado de prerrequisito | HU-05 | Juan Carlos | 📋 Por Hacer | 8 |
| T-05.4 | Mostrar mensaje de error específico en UI cuando se intenta matricular curso con prerrequisito incumplido | HU-05 | Tatiana | 📋 Por Hacer | 8 |
| T-06.1 | Implementar servicio de cálculo de créditos totales por estudiante en la matrícula activa | HU-06 | Alexandra | 📋 Por Hacer | 8 |
| T-06.2 | Integrar validación de créditos en endpoint de matrícula; bloquear si < 20 o > 22 | HU-06 | Yenifer | 📋 Por Hacer | 8 |
| T-06.3 | Mostrar contador de créditos en tiempo real en la UI de matrícula | HU-06 | Talita | 📋 Por Hacer | 8 |

---

## Sprint 3

**Duración:** 12 días  
**Esfuerzo total:** 56 puntos  
**Meta:** Motor CSP, generación de horarios y visualización por actor

| ID Tarea | Tarea | Historia | Responsable | Estado | Est. |
|----------|-------|----------|-------------|--------|------|
| T-07.1 | Diseñar estructura CSP: variables (curso-franja-docente-aula), dominios y restricciones R01–R06 | HU-07 | Juan Carlos | 📋 Por Hacer | 10 |
| T-07.2 | Implementar algoritmo de backtracking con propagación de restricciones (AC-3) en Node.js | HU-07 | Juan Carlos | 📋 Por Hacer | 10 |
| T-07.3 | Implementar restricción R03: no-solapamiento de docente (mismo docente, misma franja) | HU-07 | Tatiana | 📋 Por Hacer | 8 |
| T-07.4 | Implementar restricción R04: no-solapamiento de aula (un aula, una asignación por franja) | HU-07 | Alexandra | 📋 Por Hacer | 10 |
| T-07.5 | Implementar restricción R05: capacidad de aula ≥ número de matriculados en el curso | HU-07 | Yenifer | 📋 Por Hacer | 6 |
| T-07.6 | Implementar restricción R06: asignación solo en franjas declaradas disponibles por el docente | HU-07 | Talita | 📋 Por Hacer | 6 |
| T-07.7 | Exponer endpoint POST /api/schedules/generate que invoque el motor CSP y persista el resultado | HU-07 | Juan Carlos | 📋 Por Hacer | 6 |

---

## Sprint 4

**Duración:** 10 días  
**Esfuerzo total:** 95 puntos  
**Meta:** Visualización de horarios por actor y autenticación

| ID Tarea | Tarea | Historia | Responsable | Estado | Est. |
|----------|-------|----------|-------------|--------|------|
| T-08.1 | Implementar endpoint GET /api/schedules/student/:id (horario del estudiante por matrícula) | HU-08 | Tatiana | 📋 Por Hacer | 13 |
| T-08.2 | Desarrollar componente React "GrillaHorario" (semana × franjas) con bloques de curso, docente y aula | HU-08 | Alexandra | 📋 Por Hacer | 8 |
| T-08.3 | Implementar selector de estudiante en vista de horario para consulta por coordinador | HU-08 | Yenifer | 📋 Por Hacer | 8 |
| T-09.1 | Implementar endpoint GET /api/schedules/teacher/:id que retorne el horario del docente | HU-09 | Talita | 📋 Por Hacer | 10 |
| T-09.2 | Desarrollar vista "Horario Docente" reutilizando GrillaHorario con datos del docente | HU-09 | Juan Carlos | 📋 Por Hacer | 8 |
| T-10.1 | Implementar endpoint GET /api/schedules/classroom/:id que retorne ocupación del aula por franja | HU-10 | Tatiana | 📋 Por Hacer | 8 |
| T-10.2 | Desarrollar vista "Ocupación de Aulas" con selector de aula y grilla de ocupación semanal | HU-10 | Alexandra | 📋 Por Hacer | 8 |
| T-11.1 | Diseñar modelo User en MongoDB (usuario, correo, contraseña hasheada con bcrypt, rol) | HU-11 | Yenifer | 📋 Por Hacer | 8 |
| T-11.2 | Implementar endpoint POST /api/auth/login con generación de JWT (válido 8h) | HU-11 | Talita | 📋 Por Hacer | 8 |
| T-11.3 | Implementar middleware de autenticación JWT en rutas protegidas del backend | HU-11 | Juan Carlos | 📋 Por Hacer | 8 |
| T-11.4 | Desarrollar pantalla de Login en React con validación de formulario y manejo de token en contexto | HU-11 | Tatiana | 📋 Por Hacer | 8 |
