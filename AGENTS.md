# AGENTS.md

# Principios del Sistema

El Sistema de Generación Óptima de Horarios Académicos tiene como objetivo automatizar la planificación de horarios universitarios mediante técnicas de optimización y restricciones académicas.

El sistema busca resolver problemas frecuentes como:
- conflictos de horarios entre docentes
- superposición de aulas
- asignaciones fuera de disponibilidad
- mala distribución de bloques horarios
- cursos sin asignación

El sistema prioriza la correctitud sobre la velocidad. Un horario libre de conflictos tiene mayor valor que un horario generado rápidamente con errores o solapamientos.

Objetivos principales del sistema:
- evitar conflictos académicos
- optimizar el uso de aulas
- respetar la disponibilidad docente
- minimizar cursos sin asignación
- mejorar la organización académica institucional

---

# Reglas Globales

- Toda asignación debe contener exactamente:
  curso, docente, aula, día y bloque horario.

- El sistema nunca asignará un docente fuera de su disponibilidad registrada.

- Un aula no puede contener más de un curso en el mismo bloque horario.

- Un docente no puede impartir dos cursos simultáneamente.

- Todo curso debe tener un único horario asignado.

- Toda asignación debe respetar la capacidad máxima del aula.

- El sistema debe registrar cursos no asignados cuando no existan recursos suficientes.

---

# Restricciones Duras

## HC1
Un docente no puede estar asignado a dos cursos en el mismo bloque horario.

## HC2
Un aula no puede asignarse a más de un curso simultáneamente.

## HC3
La capacidad del aula debe ser mayor o igual al número de estudiantes del curso.

## HC4
Todo curso debe asignarse únicamente dentro de los bloques horarios definidos por el sistema.

## HC5
El sistema debe respetar la disponibilidad de los docentes al momento de asignar cursos.

---

# Restricciones Blandas 

## SC1
Priorizar horarios preferidos por los docentes.

## SC2
Evitar bloques consecutivos excesivos para docentes y estudiantes.

## SC3
Distribuir equilibradamente la carga académica durante la semana.

## SC4
Priorizar el uso eficiente de aulas con capacidad cercana a la cantidad de estudiantes.

---

# Función Objetivo

El sistema evaluará la calidad de la solución mediante el siguiente objectiveScore:

ObjectiveScore =
(+10 × preferenciasCumplidas)
(-50 × conflictos)
(-20 × cursosSinAsignar)
(-5 × sobrecargaHoraria)

Donde:
- preferenciasCumplidas representa las restricciones blandas satisfechas.
- conflictos representa violaciones de restricciones duras.
- cursosSinAsignar representa cursos sin horario asignado.
- sobrecargaHoraria representa exceso de bloques consecutivos.