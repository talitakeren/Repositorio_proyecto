# Backlog Detallado del Producto

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)  
**Dueño del Producto:** Coordinador Académico / Scrum Master

---

## Leyenda de Estados

| Estado | Descripción |
|--------|-------------|
| ✅ Terminado | Tarea completada |
| 🔄 En Progreso | Tarea en curso |
| 📋 Por Hacer | Pendiente de iniciar |
| 🗑️ Eliminado | Descartada |

---

## Sprints

| Sprint | Inicio | Días | Final | Estimación | Estado | Meta |
|--------|--------|------|-------|-----------|--------|------|
| 1 | 07/04/2026 | 28 | 19/09/2018 | 220 pts | ✅ Terminado | Configuración inicial del proyecto, arquitectura base MERN y modelos de datos |
| 2 | 05/05/2026 | 28 | 01/06/2026 | 56 pts | 🔄 En Progreso | CRUD de entidades (cursos, docentes, aulas, estudiantes) y validación de matrícula |
| 3 | 02/06/2026 | 28 | 29/06/2026 | 63 pts | 📋 Planeado | Motor CSP, generación de horarios y visualización por actor |

---

## Historias de Usuario y Tareas

---

### HU-01 — Registro de Cursos

**Rol:** Administrador  
**Deseo:** Registrar nuevos cursos con nombre, código, créditos, prerrequisitos y tipo de aula requerida  
**Para:** Que el sistema cuente con el catálogo de cursos necesario para la generación de horarios

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-01.1 | Diseñar modelo de datos Course en MongoDB (nombre, código, créditos, prerrequisitos, tipoAula) | El esquema Course se crea en MongoDB Atlas y acepta los atributos definidos | Must Have | 8 | — | 1 | ✅ Terminado |
| T-01.2 | Implementar endpoint POST /api/courses con validación de campos obligatorios | POST /api/courses responde 201 con el curso creado y persiste en BD | Must Have | 10 | T-01.1 | 1 | ✅ Terminado |
| T-01.3 | Implementar endpoints GET, PUT, DELETE /api/courses/:id | CRUD completo funcional; GET lista todos los cursos, PUT actualiza, DELETE elimina | Must Have | 8 | T-01.2 | 1 | ✅ Terminado |
| T-01.4 | Desarrollar componente React "Formulario de Curso" con campos y validaciones frontend | El formulario valida campos requeridos y muestra mensajes de error en menos de 1s | Must Have | 8 | T-01.3 | 1 | ✅ Terminado |
| T-01.5 | Desarrollar vista listado de cursos con opciones de edición y eliminación | La tabla muestra todos los cursos registrados con botones Editar/Eliminar operativos | Must Have | 10 | T-01.4 | 1 | ✅ Terminado |

---

### HU-02 — Registro de Docentes

**Rol:** Administrador  
**Deseo:** Registrar docentes con nombre, correo electrónico y disponibilidad horaria semanal  
**Para:** Que el motor CSP pueda respetar la disponibilidad real de cada docente al generar los horarios

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-02.1 | Diseñar modelo Teacher en MongoDB con atributos nombre, correo y disponibilidad (arreglo de franjas día-hora) | El esquema Teacher se crea correctamente con disponibilidad como arreglo de objetos {día, hora} | Must Have | 8 | — | 1 | ✅ Terminado |
| T-02.2 | Implementar endpoints CRUD /api/teachers con validación de correo único | No se permite registrar dos docentes con el mismo correo; respuesta 409 en caso de duplicado | Must Have | 6 | T-02.1 | 1 | ✅ Terminado |
| T-02.3 | Desarrollar componente React para registro y edición de disponibilidad horaria (selector día/hora) | El selector permite marcar/desmarcar franjas disponibles y persiste correctamente al guardar | Must Have | 8 | T-02.2 | 1 | ✅ Terminado |
| T-02.4 | Desarrollar vista listado de docentes con disponibilidad resumida | La tabla muestra nombre, correo y número de franjas disponibles por semana | Must Have | 6 | T-02.3 | 1 | ✅ Terminado |

---

### HU-03 — Registro de Aulas

**Rol:** Administrador  
**Deseo:** Registrar aulas con código, capacidad y tipo (estándar o laboratorio)  
**Para:** Que el sistema asigne aulas compatibles con el tipo de curso y la cantidad de estudiantes matriculados

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-03.1 | Diseñar modelo Classroom en MongoDB (código, capacidad, tipo) | Esquema Classroom creado y validado en MongoDB Atlas | Must Have | 13 | — | 1 | ✅ Terminado |
| T-03.2 | Implementar endpoints CRUD /api/classrooms | CRUD funcional; GET retorna listado con todos los atributos | Must Have | 16 | T-03.1 | 1 | ✅ Terminado |
| T-03.3 | Desarrollar componente React "Formulario de Aula" con validaciones (capacidad > 0, tipo requerido) | Formulario valida que capacidad sea entero positivo y tipo esté seleccionado | Must Have | 10 | T-03.2 | 1 | ✅ Terminado |
| T-03.4 | Desarrollar vista catálogo de aulas con filtro por tipo | La vista muestra aulas filtradas por tipo estándar/laboratorio correctamente | Must Have | 16 | T-03.3 | 1 | ✅ Terminado |

---

### HU-04 — Registro de Estudiantes

**Rol:** Administrador  
**Deseo:** Registrar estudiantes con código, nombre, correo e historial de cursos aprobados  
**Para:** Que el sistema valide automáticamente los prerrequisitos durante la matrícula

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-04.1 | Diseñar modelo Student en MongoDB (código, nombre, correo, cursosAprobados[]) | Esquema Student persiste en BD con historial de cursos aprobados como arreglo de IDs | Must Have | 13 | — | 1 | ✅ Terminado |
| T-04.2 | Implementar endpoints CRUD /api/students | CRUD funcional; el historial académico es editable vía PUT | Must Have | 8 | T-04.1 | 1 | ✅ Terminado |
| T-04.3 | Desarrollar componente React "Formulario de Estudiante" con selección múltiple de cursos aprobados | El formulario permite agregar/quitar cursos del historial y persiste correctamente | Must Have | 8 | T-04.2 | 1 | ✅ Terminado |
| T-04.4 | Desarrollar vista listado de estudiantes con búsqueda por código o nombre | La búsqueda retorna resultados filtrados en tiempo real (sin recarga de página) | Must Have | 8 | T-04.3 | 1 | ✅ Terminado |

---

### HU-05 — Matrícula con Validación de Prerrequisitos

**Rol:** Coordinador  
**Deseo:** Matricular a un estudiante en cursos validando automáticamente que cumpla todos los prerrequisitos  
**Para:** Evitar asignaciones inválidas que incumplan el plan de estudios y garantizar la integridad académica

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-05.1 | Implementar servicio backend de validación de prerrequisitos (recorrido del grafo de dependencias de cursos) | El servicio retorna lista de prerrequisitos incumplidos para un par estudiante-curso en < 1 segundo | Must Have | 8 | T-04.1, T-01.1 | 1 | ✅ Terminado |
| T-05.2 | Integrar validación de prerrequisitos en endpoint POST /api/enrollments; respuesta 422 con detalle del prerrequisito faltante | Al intentar matricular sin prerrequisito, la API responde 422 con mensaje que identifica el curso faltante | Must Have | 8 | T-05.1 | 1 | ✅ Terminado |
| T-05.3 | Desarrollar interfaz de matrícula: selector de cursos disponibles para el estudiante con indicadores de estado de prerrequisito | Los cursos sin prerrequisito cumplido aparecen deshabilitados con tooltip explicativo | Must Have | 8 | T-05.2 | 1 | ✅ Terminado |
| T-05.4 | Mostrar mensaje de error específico en UI cuando se intenta matricular curso con prerrequisito incumplido | El mensaje indica exactamente qué prerrequisito falta; no se registra la matrícula | Must Have | 8 | T-05.3 | 1 | ✅ Terminado |

---

### HU-06 — Validación de Carga Crediticia

**Rol:** Coordinador  
**Deseo:** Que el sistema valide que la carga crediticia del estudiante esté entre 20 y 22 créditos al confirmar la matrícula  
**Para:** Garantizar que ningún estudiante exceda el límite permitido ni se matricule con carga insuficiente

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-06.1 | Implementar servicio de cálculo de créditos totales por estudiante en la matrícula activa | El servicio retorna la suma de créditos de los cursos seleccionados en tiempo real | Must Have | 8 | T-04.1, T-01.1 | 1 | ✅ Terminado |
| T-06.2 | Integrar validación de créditos en endpoint de matrícula; bloquear si < 20 o > 22 | La API rechaza matrícula con total fuera del rango [20,22] e indica el total acumulado | Must Have | 8 | T-06.1 | 1 | ✅ Terminado |
| T-06.3 | Mostrar contador de créditos en tiempo real en la UI de matrícula | El contador se actualiza al seleccionar/deseleccionar cursos; se torna rojo al superar 22 | Must Have | 8 | T-06.2 | 1 | ✅ Terminado |

---

### HU-07 — Generación Automática de Horario

**Rol:** Coordinador  
**Deseo:** Generar automáticamente un horario semestral válido para todos los cursos matriculados pulsando un botón  
**Para:** Eliminar el proceso manual de planificación y obtener un horario sin conflictos en segundos

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-07.1 | Diseñar estructura de datos del CSP: variables (asignaciones curso-franja-docente-aula), dominios y restricciones R01–R06 | El modelo CSP está documentado y las restricciones se definen como funciones evaluables | Must Have | 10 | HU-01 a HU-06 | 2 | 📋 Por Hacer |
| T-07.2 | Implementar algoritmo de backtracking con propagación de restricciones (AC-3) en Node.js | El algoritmo produce un horario válido para 20 cursos, 10 docentes y 5 aulas en < 10 segundos | Must Have | 10 | T-07.1 | 2 | 📋 Por Hacer |
| T-07.3 | Implementar restricción R03: no-solapamiento de docente (mismo docente no puede dictar dos cursos simultáneos) | El motor rechaza asignaciones que solapen la franja de un docente; prueba unitaria pasa | Must Have | 8 | T-07.2 | 2 | 📋 Por Hacer |
| T-07.4 | Implementar restricción R04: no-solapamiento de aula (un aula no puede tener dos cursos en la misma franja) | El motor rechaza asignaciones con aula duplicada en misma franja; prueba unitaria pasa | Must Have | 10 | T-07.2 | 2 | 📋 Por Hacer |
| T-07.5 | Implementar restricción R05: capacidad de aula ≥ número de matriculados en el curso | El motor solo asigna aulas cuya capacidad sea mayor o igual al tamaño del grupo | Must Have | 6 | T-07.2 | 2 | 📋 Por Hacer |
| T-07.6 | Implementar restricción R06: asignación solo en franjas declaradas disponibles por el docente | El motor no asigna al docente en franjas fuera de su disponibilidad registrada | Must Have | 6 | T-07.2 | 2 | 📋 Por Hacer |
| T-07.7 | Exponer endpoint POST /api/schedules/generate que invoque el motor CSP y persista el resultado | El endpoint responde con el horario generado en JSON en < 10 s; 200 si válido, 422 si sin solución | Must Have | 6 | T-07.2 a T-07.6 | 2 | 📋 Por Hacer |

---

### HU-08 — Vista de Horario del Estudiante

**Rol:** Estudiante  
**Deseo:** Ver mi horario semanal en formato de grilla (días vs. horas) con el nombre del curso, docente y aula asignada  
**Para:** Conocer mis clases programadas y planificar mis actividades académicas de manera eficiente

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-08.1 | Implementar endpoint GET /api/schedules/student/:id que retorne el horario del estudiante filtrado por su matrícula | El endpoint retorna solo los cursos matriculados por el estudiante con franja, docente y aula | Must Have | 13 | T-07.7 | 3 | 📋 Por Hacer |
| T-08.2 | Desarrollar componente React "GrillaHorario" (semana × franjas horarias) que renderice los bloques de curso | La grilla muestra 5 días × franjas sin solapamientos visuales; nombre de curso, docente y aula visibles | Must Have | 8 | T-08.1 | 3 | 📋 Por Hacer |
| T-08.3 | Implementar selector de estudiante en la vista de horario para que el coordinador consulte cualquier alumno | Al seleccionar un estudiante del listado, la grilla se actualiza con su horario correcto | Must Have | 8 | T-08.2 | 3 | 📋 Por Hacer |

---

### HU-09 — Vista de Horario del Docente

**Rol:** Docente  
**Deseo:** Ver los cursos que tengo asignados con su franja horaria y aula en formato de grilla o listado  
**Para:** Conocer mi carga semanal y los espacios donde debo impartir clases sin necesidad de consultar al coordinador

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-09.1 | Implementar endpoint GET /api/schedules/teacher/:id que retorne el horario del docente | El endpoint retorna todos los cursos asignados al docente con franja y aula | Should Have | 10 | T-07.7 | 3 | 📋 Por Hacer |
| T-09.2 | Desarrollar vista "Horario Docente" reutilizando el componente GrillaHorario con datos del docente | La grilla del docente muestra todos sus cursos sin solapamientos; carga horaria total visible | Should Have | 8 | T-09.1, T-08.2 | 3 | 📋 Por Hacer |

---

### HU-10 — Vista de Ocupación de Aulas

**Rol:** Coordinador  
**Deseo:** Consultar la ocupación de cada aula por franja horaria, viendo el curso y grupo asignado  
**Para:** Verificar la distribución de infraestructura y detectar aulas subutilizadas o con alta demanda

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-10.1 | Implementar endpoint GET /api/schedules/classroom/:id que retorne la ocupación del aula por franja | El endpoint retorna las franjas ocupadas con curso asignado; franjas libres identificadas | Should Have | 8 | T-07.7 | 3 | 📋 Por Hacer |
| T-10.2 | Desarrollar vista "Ocupación de Aulas" con selector de aula y grilla de ocupación semanal | La grilla muestra franjas ocupadas (con curso) y libres; no aparecen aulas doblemente asignadas | Should Have | 8 | T-10.1 | 3 | 📋 Por Hacer |

---

### HU-11 — Autenticación de Usuarios

**Rol:** Administrador  
**Deseo:** Iniciar sesión con usuario y contraseña para acceder al sistema  
**Para:** Proteger los datos académicos y restringir el acceso a usuarios autorizados

| ID Tarea | Descripción | Criterios de Aceptación | Prioridad | Est. | Dependencias | Sprint | Estado |
|----------|-------------|------------------------|-----------|------|--------------|--------|--------|
| T-11.1 | Diseñar modelo User en MongoDB (usuario, correo, contraseña hasheada con bcrypt, rol) | El esquema User almacena contraseñas con hash bcrypt; nunca en texto plano | Could Have | 8 | — | 4 | 📋 Por Hacer |
| T-11.2 | Implementar endpoint POST /api/auth/login con generación de JWT | El login retorna JWT válido por 8 horas; credenciales incorrectas retornan 401 | Could Have | 8 | T-11.1 | 4 | 📋 Por Hacer |
| T-11.3 | Implementar middleware de autenticación JWT en rutas protegidas del backend | Las rutas /api/courses, /api/teachers, etc. retornan 401 si no se envía token válido | Could Have | 8 | T-11.2 | 4 | 📋 Por Hacer |
| T-11.4 | Desarrollar pantalla de Login en React con validación de formulario y manejo de token en contexto | El usuario puede iniciar sesión y el token persiste en memoria de sesión; logout elimina el token | Could Have | 8 | T-11.3 | 4 | 📋 Por Hacer |
