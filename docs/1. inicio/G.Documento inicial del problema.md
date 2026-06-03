# Documento Inicial del Problema  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Descripción del Problema

Las universidades con currículo flexible enfrentan dificultades significativas en la planificación de horarios académicos. A diferencia de los currículos fijos, donde los grupos de estudiantes son homogéneos, el currículo flexible permite que cada estudiante avance a su propio ritmo. Esto genera grupos heterogéneos con combinaciones únicas de cursos matriculados, lo que incrementa significativamente la complejidad de asignación de aulas, docentes y horarios.

El proceso actual en la Universidad Continental presenta los siguientes problemas:

- Conflictos de horario: docentes asignados a dos cursos en el mismo intervalo o aulas con doble reserva.  
- Violación de prerrequisitos: estudiantes matriculados en cursos no habilitados para su nivel.  
- Subutilización de aulas: asignación ineficiente de espacios físicos.  
- Alto tiempo de planificación: el proceso manual puede tomar días o incluso semanas por semestre.  

---

## 2. Evidencia de la Complejidad del Problema

El problema de generación de horarios universitarios (University Course Timetabling Problem) es clasificado como un problema **NP-difícil**, lo que implica una alta complejidad computacional.

### 2.1 Incertidumbre

- La demanda de cursos varía en cada semestre.  
- La disponibilidad de docentes puede cambiar por factores externos.  
- Los requerimientos de infraestructura dependen del tipo de curso (laboratorio, aula estándar, etc.).  

---

### 2.2 Interdependencia de Variables

- La asignación de un curso afecta simultáneamente a docentes, aulas y estudiantes.  
- Los prerrequisitos generan dependencias entre cursos de distintos ciclos académicos.  
- El límite de créditos condiciona las combinaciones posibles de matrícula por estudiante.  

---

### 2.3 Necesidad de Soluciones Adaptativas

- No existe una única solución óptima, sino múltiples soluciones válidas.  
- El sistema debe adaptarse a cambios sin reconfiguración manual completa.  
- El modelo debe ser extensible para nuevas restricciones futuras.  

---

## 3. Variables del Modelo

| Variable | Tipo | Descripción |
|----------|------|-------------|
| Curso | Entidad principal | Unidad académica con créditos, prerrequisitos y tipo de aula requerida. |
| Docente | Recurso humano | Profesor asignado con disponibilidad horaria definida. |
| Estudiante | Entidad principal | Alumno con historial académico y solicitud de matrícula. |
| Aula | Recurso físico | Espacio físico con capacidad y tipo (laboratorio o estándar). |
| Franja Horaria | Variable de decisión | Intervalo de tiempo donde se dicta un curso. |

---

## 4. Actores (Stakeholders) del Sistema

| Actor | Necesidad | Relación con el Problema |
|------|----------|--------------------------|
| Coordinador académico | Generar horarios válidos de forma eficiente | Usuario principal del sistema de generación |
| Administrador del sistema | Mantener datos de cursos, docentes y aulas | Provee la información base del modelo |
| Docente | Conocer su horario y disponibilidad respetada | Fuente de restricciones operativas |
| Estudiante | Matricularse en cursos válidos y consultar horario | Beneficiario final del sistema |

---

## 5. Ambigüedades Identificadas

Durante el análisis inicial se identificaron las siguientes ambigüedades, resueltas mediante supuestos para el PMV:

| ID | Ambigüedad | Decisión adoptada |
|----|------------|------------------|
| A01 | ¿Existen múltiples secciones por curso? | Se asume una sola sección por curso en el PMV. |
| A02 | ¿Duración de clases variable? | Se asume duración fija de 2 horas por sesión. |
| A03 | ¿Un curso puede dictarse más de una vez por semana? | Sí, pero con sesiones independientes. |
| A04 | ¿Cursos con requisitos de laboratorio? | Sí, el tipo de aula es considerado como restricción. |
| A05 | ¿Optimización avanzada es obligatoria? | No, se prioriza generación de soluciones válidas (CSP básico). |

---

## 6. Modelado Formal como CSP

El problema se modela como un **Constraint Satisfaction Problem (CSP)**:

- **Variables:**  
  X = {x₁, x₂, ..., xₙ}, donde cada xᵢ representa la asignación de un curso.

- **Dominios:**  
  D(xᵢ) = combinación de franjas horarias, docentes disponibles y aulas compatibles.

- **Restricciones:**  
  C = {R01, R02, R03, R04, R05, R06} según el registro de restricciones del sistema.

### Estrategia de resolución

Se implementará un algoritmo de **backtracking con propagación de restricciones (AC-3)**, debido a su simplicidad y adecuación al alcance del PMV.

---

## 7. Priorización de Restricciones

| Prioridad | Restricción | Tipo |
|----------|------------|------|
| Alta | No solapamiento de docentes | Restricción dura |
| Alta | No solapamiento de aulas | Restricción dura |
| Alta | Cumplimiento de prerrequisitos | Restricción dura |
| Alta | Límite de créditos por estudiante | Restricción dura |
| Media | Disponibilidad de docente | Restricción blanda |
| Media | Capacidad de aula | Restricción blanda |

---