# Project Charter  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Propósito y Justificación del Proyecto

La Universidad Continental opera bajo un modelo de currículo flexible que genera alta complejidad en la planificación de horarios académicos.

Actualmente, este proceso es realizado manualmente por coordinadores académicos, lo que provoca problemas recurrentes como:

- Solapamiento de horarios  
- Incumplimiento de prerrequisitos  
- Subutilización de infraestructura  

El proyecto **SGOHA** busca automatizar este proceso mediante una aplicación web que implementa un modelo de **Satisfacción de Restricciones (CSP)**, reduciendo el tiempo de planificación y garantizando la validez de los horarios generados.

---

## 2. Objetivo General

Desarrollar un Producto Mínimo Viable (PMV) de una aplicación web basada en el stack **MERN**, capaz de generar horarios académicos válidos considerando:

- Prerrequisitos académicos  
- Disponibilidad de docentes y aulas  
- Límite de créditos  

El desarrollo se realizará en un periodo de **12 semanas** bajo la metodología **Scrum**.

---

## 3. Objetivos Específicos

- Analizar e identificar variables, restricciones y actores del problema de planificación de horarios.  
- Modelar el problema como un **Constraint Satisfaction Problem (CSP)** con supuestos justificados.  
- Diseñar la arquitectura del sistema bajo el patrón **SPA + API REST** utilizando stack MERN.  
- Implementar los requerimientos funcionales principales: registro, validación de matrícula, generación y visualización de horarios.  
- Documentar el proyecto siguiendo las áreas de conocimiento del **PMBOK** y la estructura **Arc42**.  

---

## 4. Alcance del Proyecto

### 4.1 Incluido en el PMV

- Gestión de entidades: estudiantes, docentes, cursos y aulas.  
- Motor de validación de matrícula (prerrequisitos y límite de créditos).  
- Motor de generación de horarios basado en CSP (backtracking básico).  
- Visualización de horarios por tipo de usuario.  
- Documentación técnica y de gestión del proyecto.  

---

### 4.2 Excluido del PMV

- Integración con sistemas universitarios existentes (SIS, ERP).  
- Módulo de notificaciones (correo electrónico o SMS).  
- Algoritmos avanzados de optimización (genéticos o metaheurísticos).  
- Exportación de reportes en PDF o Excel.  

---

## 5. Entregables Principales

| Sprint | Entregable | Semanas |
|--------|------------|---------|
| Sprint 0 | Documentación inicial: Charter, Visión, Supuestos, Requerimientos, repositorio GitHub | 1–3 |
| Sprint 1 | Backend API REST + frontend de registro | 4–7 |
| Sprint 2 | Motor CSP, generación de horarios, visualización, pruebas y documentación final | 8–12 |

---

## 6. Stakeholders

| Stakeholder | Rol en el Proyecto | Nivel de Influencia |
|------------|--------------------|---------------------|
| Docente del curso | Evaluador y patrocinador académico | Alto |
| Equipo de desarrollo | Diseño, implementación y documentación | Alto |
| Coordinadores académicos | Usuarios finales primarios | Medio |
| Estudiantes | Usuarios finales secundarios | Bajo |

---

## 7. Cronograma Preliminar

| Semana | Actividad Principal | Responsable | Hito |
|--------|-------------------|-------------|------|
| 1–2 | Análisis del problema, modelado CSP y definición de requerimientos | Todo el equipo | Documentos Sprint 0 |
| 3 | Configuración del repositorio y decisiones técnicas | Todo el equipo | Repositorio operativo |
| 4–7 | Desarrollo backend y frontend inicial | Backend / Frontend | Sprint 1 funcional |
| 8–11 | Motor CSP, generación de horarios y pruebas | Todo el equipo | Sprint 2 funcional |
| 12 | Documentación final y video demostrativo | Todo el equipo | Entrega final v1.0.0 |

---

## 8. Riesgos Iniciales

| Riesgo | Probabilidad | Impacto | Respuesta |
|-------|-------------|---------|----------|
| Subestimación de la complejidad del motor CSP | Media | Alto | Simplificar CSP a backtracking básico |
| Falta de coordinación del equipo | Media | Alto | Daily standups y revisión en GitHub |
| Cambios en requerimientos | Alta | Medio | Gestión mediante backlog en Scrum |
| Problemas de integración frontend-backend | Media | Medio | Definir contrato API REST desde Sprint 0 |

---

## 9. Restricciones del Proyecto

- Tiempo limitado: 12 semanas académicas no prorrogables.  
- Tecnología obligatoria: stack MERN (MongoDB, Express.js, React.js, Node.js).  
- Metodología: Scrum con Gitflow en GitHub.  
- Recursos: sin presupuesto; uso de servicios gratuitos (MongoDB Atlas, Vercel, Render).  

---