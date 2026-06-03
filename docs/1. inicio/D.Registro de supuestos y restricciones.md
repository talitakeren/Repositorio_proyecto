# Registro de Supuestos y Restricciones  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Supuestos del Proyecto

Los supuestos representan condiciones consideradas verdaderas para el diseño e implementación del Producto Mínimo Viable (PMV).  Si alguno de estos supuestos no se cumple, podría implicar ajustes en el alcance o en el modelo del sistema.

| ID | Categoría | Supuesto | Justificación |
|----|----------|----------|---------------|
| S01 | Datos | Cada docente tiene una disponibilidad horaria registrada y estática durante el semestre. | Simplifica el modelo CSP al eliminar variaciones dinámicas de disponibilidad. |
| S02 | Datos | Los prerrequisitos de cada curso son conocidos y no cambian durante el semestre. | Permite modelar restricciones de precedencia sin lógica dinámica. |
| S03 | Modelo | El límite de créditos por semestre es uniforme (20 a 22 créditos para todos los estudiantes). | Reduce la variabilidad del modelo; casos especiales quedan fuera del alcance. |
| S04 | Infraestructura | La capacidad de cada aula es un dato fijo registrado en el sistema. | Permite validar asignaciones sin depender de fuentes externas. |
| S05 | Técnico | El equipo tiene acceso a internet y puede usar servicios gratuitos en la nube (MongoDB Atlas, Render, Vercel). | Elimina la necesidad de infraestructura propia. |
| S06 | Equipo | Todos los integrantes tienen conocimientos básicos de JavaScript y pueden aprender el stack MERN durante el Sprint 0. | Reduce riesgo técnico al usar un lenguaje unificado. |
| S07 | Negocio | Los coordinadores académicos son los usuarios principales del sistema; los estudiantes solo consultan información. | Define claramente los roles del sistema para el diseño UX. |

---

## 2. Restricciones del Proyecto

Las restricciones representan condiciones externas no negociables que limitan las decisiones del equipo dentro del alcance del proyecto.

---

## 2.1 Restricciones del Modelo de Optimización (CSP)

| ID | Tipo | Restricción | Impacto en el diseño |
|----|------|------------|----------------------|
| R01 | Académica | Un estudiante solo puede matricularse en un curso si ha aprobado todos sus prerrequisitos. | Requiere validación de grafos de dependencias antes de asignación. |
| R02 | Académica | Un estudiante debe tener entre 20 y 22 créditos por semestre. | El sistema debe validar créditos antes de confirmar matrícula. |
| R03 | Operativa | Un docente no puede dictar dos cursos en el mismo horario. | El CSP debe evitar solapamientos de asignación docente. |
| R04 | Operativa | Un aula no puede ser asignada a dos cursos en el mismo horario. | El CSP debe validar disponibilidad de aulas. |
| R05 | Operativa | La capacidad del aula debe ser mayor o igual al número de estudiantes del curso. | Requiere comparar atributos de aula vs. tamaño de grupo. |
| R06 | Operativa | El horario generado debe respetar la disponibilidad declarada del docente. | La disponibilidad se usa como dominio de asignación en el CSP. |

---

## 2.2 Restricciones Técnicas del Proyecto

| ID | Dimensión | Restricción |
|----|----------|-------------|
| T01 | Tecnológica | El sistema debe desarrollarse exclusivamente con el stack MERN (MongoDB, Express.js, React.js, Node.js). |
| T02 | Temporal | El proyecto tiene una duración máxima de 12 semanas sin posibilidad de extensión. |
| T03 | Económica | No existe presupuesto; solo se pueden usar herramientas gratuitas. |
| T04 | Computacional | El motor de generación de horarios debe responder en menos de 10 segundos para el tamaño de datos del PMV (30 cursos, 15 docentes, 10 aulas). |
| T05 | Repositorio | El código debe gestionarse en GitHub usando Feature Branch Workflow con Pull Requests obligatorios. |

---