# Declaración de la Visión del Proyecto  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Enunciado de la Visión

El Sistema de Generación Óptima de Horarios Académicos (SGOHA) está dirigido a coordinadores académicos y administradores de la Universidad Continental, quienes requieren planificar horarios de manera eficiente en entornos de currículo flexible.

El sistema se concibe como una aplicación web que automatiza la generación de horarios académicos válidos, considerando restricciones como prerrequisitos, disponibilidad de docentes, capacidad de aulas y límites de créditos.

A diferencia del proceso manual actual, que es propenso a errores y conflictos, la solución propuesta implementa un modelo de **Satisfacción de Restricciones (CSP)**, garantizando la coherencia del horario generado, reduciendo el tiempo de planificación y mejorando la asignación de recursos académicos.

---

## 2. Problema que Resuelve

Actualmente, la planificación manual de horarios universitarios en entornos de currículo flexible presenta múltiples problemas, entre ellos:

- Solapamiento de horarios entre cursos, docentes o aulas.  
- Incumplimiento de prerrequisitos académicos.  
- Subutilización o sobreasignación de aulas.  
- Sobrecarga de docentes en determinados periodos.  

Este proceso requiere una gran cantidad de tiempo por parte de los coordinadores académicos y genera insatisfacción tanto en estudiantes como en docentes.

Además, no existe una herramienta integrada que automatice este proceso considerando simultáneamente todas las restricciones académicas y operativas.

---

## 3. Propuesta de Valor

El sistema propuesto busca mejorar la gestión de horarios académicos mediante tres pilares principales:

- **Automatización**: El sistema permite generar horarios en segundos, reemplazando procesos manuales que actualmente pueden tomar días.

- **Validez garantizada**: Todos los horarios generados cumplen estrictamente las restricciones definidas (prerrequisitos, disponibilidad, capacidad y créditos).

- **Transparencia y visualización**: El sistema permite visualizar los horarios generados de manera clara según el tipo de usuario (estudiante, docente o aula).

- **Escalabilidad**: La arquitectura basada en MERN permite que el sistema pueda escalar en volumen de datos y funcionalidades en futuras versiones.

---

## 4. Alcance del Producto Mínimo Viable (PMV)

El PMV del sistema incluirá, en un plazo de 12 semanas, las siguientes funcionalidades:

### Funcionalidades incluidas
- Registro y gestión de estudiantes, docentes, cursos y aulas.  
- Validación de matrícula considerando prerrequisitos y límite de créditos (20–22 créditos).  
- Generación automática de horarios sin conflictos mediante un modelo CSP básico.  
- Visualización de horarios por estudiante, docente y aula.  

### Funcionalidades fuera del alcance
- Optimización avanzada mediante algoritmos genéticos u otras heurísticas complejas.  
- Integración con sistemas académicos institucionales existentes.  
- Módulo de notificaciones automáticas.  
- Reportes analíticos avanzados.  

---

## 5. Usuarios Objetivo

| Actor | Necesidad Principal |
|------|---------------------|
| Coordinador académico | Generar y ajustar horarios que cumplan todas las restricciones institucionales. |
| Administrador | Gestionar  aulas, docentes y cursos del sistema. |
| Docente | Consultar su disponibilidad y los horarios asignados. |
| Estudiante | Validar su matrícula y visualizar su horario académico. |

---

## 6. Indicadores de Éxito (KPIs del Proyecto)

El éxito del proyecto será evaluado mediante indicadores cuantificables alineados al problema de optimización de horarios académicos, los objetivos del sistema y los requerimientos funcionales y no funcionales definidos.

- El sistema genera horarios académicos válidos sin conflictos (solapamiento de cursos, docentes o aulas) para un escenario de prueba con 20 cursos, 10 docentes y 5 aulas, cumpliendo las restricciones académicas definidas como prerrequisitos, créditos y disponibilidad.

- El tiempo de generación del horario óptimo no supera los 5 segundos en condiciones de carga controladas, considerando un enfoque basado en problema de satisfacción de restricciones (CSP) o optimización combinatoria.

- El sistema cumple al menos el 100% de los requerimientos funcionales definidos (registro de estudiantes, docentes, cursos y aulas; validación de matrícula; generación y visualización de horarios).

- Se verifica el cumplimiento de al menos el 80% de los requisitos no funcionales definidos bajo ISO/IEC 25010, considerando rendimiento, usabilidad, seguridad, escalabilidad y mantenibilidad.

- El sistema respeta todas las restricciones críticas del modelo (créditos entre 20–22, disponibilidad de actores, y no solapamiento de horarios) en el 100% de los casos de prueba.

- El repositorio del proyecto evidencia trazabilidad del desarrollo mediante un mínimo de 20 commits distribuidos entre los integrantes del equipo, reflejando trabajo colaborativo.

- La solución implementa un modelo basado en CSP o optimización combinatoria correctamente formulado, con definición explícita de variables, restricciones y supuestos del problema.

- La documentación del proyecto cubre de forma completa las cinco fases del proyecto (inicio, planificación, ejecución, seguimiento y control, y cierre), incluyendo modelado del problema, requerimientos y justificación de la solución. 

---