# SPEC.md

# Especificación Formal del Sistema

Sistema de Generación Óptima de Horarios Académicos

---

# Entradas

El sistema recibe la siguiente información:

## Cursos

Cada curso contiene:
- codigo
- nombre
- cantidadEstudiantes
- ciclo
- horasSemanales

## Docentes

Cada docente contiene:
- nombre
- availability[]
- preferences[]
- cursosAsignados[]

## Aulas

Cada aula contiene:
- codigo
- capacidad
- tipo

## Bloques Horarios

Configuración de:
- día
- horaInicio
- horaFin

# Salidas

El sistema devuelve un objeto compuesto por:

## schedule[]

Contiene todas las asignaciones válidas.

Cada asignación contiene:
- curso
- docente
- aula
- día
- bloqueHorario

## metrics

Contiene métricas generales del sistema:

- totalAssigned
- conflicts
- unassigned[]
- preferencesMet
- objectiveScore

# Reglas de Negocio

## Endpoint: /generate-schedule

### Descripción
Genera automáticamente un horario académico óptimo respetando restricciones duras y blandas.

### Validaciones
- disponibilidad docente
- conflictos de aulas
- conflictos de docentes
- capacidad de aulas
- bloques horarios válidos

### Respuesta Exitosa
El sistema devolverá una confirmación indicando que el horario fue generado correctamente, incluyendo las asignaciones realizadas y las métricas obtenidas.

### Respuesta de Error
El sistema mostrará un mensaje indicando que no existen recursos suficientes para generar el horario académico.

---

## Endpoint: /courses

### Descripción
Gestiona la información de cursos académicos.

### Validaciones
- código único
- cantidad de estudiantes válida

### Respuesta Exitosa
El sistema confirmará el registro correcto de los cursos académicos.

### Respuesta de Error
El sistema mostrará un mensaje indicando que los datos ingresados del curso son inválidos.

---

## Endpoint: /teachers

### Descripción
Gestiona la información de docentes y disponibilidad.

### Validaciones
- availability[] válido
- nombre obligatorio

### Respuesta Exitosa
El sistema confirmará el registro correcto de la información de docentes y su disponibilidad.

### Respuesta de Error
El sistema mostrará un mensaje indicando que la disponibilidad del docente es inválida.

---

## Endpoint: /classrooms

### Descripción
Gestiona la información de aulas académicas.

### Validaciones
- capacidad válida
- código único

### Respuesta Exitosa
El sistema confirmará el registro correcto de las aulas académicas.

### Respuesta de Error
El sistema mostrará un mensaje indicando que la capacidad del aula es inválida.

---

# Casos Límite

## Caso 1
0 docentes disponibles:
- schedule vacío
- conflicts > 0

---

## Caso 2
Docente con availability=[]:
- el docente nunca será asignado

---

## Caso 3
Más cursos que bloques horarios disponibles:
- existirán cursos en unassigned[]

---

## Caso 4
Aula insuficiente:
- el sistema rechazará la asignación

---

## Caso 5
Conflicto de horarios:
- el sistema evitará asignaciones inválidas

---

## Caso 6
No existen aulas registradas:
- schedule vacío
- conflicts incrementa

---

# Coherencia Regla-Código-Test

| Regla                         | Implementación | Test             |
|-------------------------------|----------------|------------------|
| HC1 docente no duplicado      | scheduler.js   | schedule.test.js |
| HC2 aula no duplicada         | scheduler.js   | schedule.test.js |
| HC3 capacidad aula            | scheduler.js   | schedule.test.js |
| HC5 availability docente      | scheduler.js   | teacher.test.js  |
| SC1 preferencias docentes     | scheduler.js   | schedule.test.js |
| Validación de cursos          | courses.js     | course.test.js   |

---

# Reducción de Ambigüedad

La especificación permitió definir claramente que las restricciones blandas (SC) no invalidan el horario generado, sino que únicamente afectan el objectiveScore.

Esto evitó implementar un algoritmo que rechazara soluciones válidas cuando no existían preferencias docentes registradas.

También permitió definir previamente la estructura exacta de schedule[] y metrics, reduciendo inconsistencias entre frontend y backend.

---

# Anticipación de Conflictos

Antes de implementar el sistema se identificó el posible solapamiento de docentes en un mismo bloque horario. Debido a ello se definió HC1 y se planificó el test TC-01 antes de desarrollar el algoritmo.

Asimismo, se detectó la posibilidad de tener más cursos que bloques horarios disponibles, por lo que se agregó el manejo de cursos no asignados mediante unassigned[].

Finalmente, se anticipó el conflicto de aulas con capacidad insuficiente, agregando HC3 y validaciones previas en el proceso de generación de horarios.