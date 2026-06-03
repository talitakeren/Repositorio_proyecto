# Documento de Selección del Enfoque del Proyecto  
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## 1. Introducción

El presente documento justifica las decisiones tecnológicas y metodológicas adoptadas para el desarrollo del **Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible (SGOHA)**.

La selección del enfoque se realizó evaluando distintas alternativas tecnológicas y metodológicas, considerando su viabilidad técnica, alineación con el problema y restricciones del proyecto.

Asimismo, se consideraron aspectos como escalabilidad, mantenibilidad y facilidad de evolución del sistema, con el objetivo de asegurar una solución sostenible en el tiempo.

---

## 2. Criterios de Selección del Enfoque

Los criterios utilizados para evaluar las alternativas fueron:

- **Viabilidad técnica:** capacidad de la tecnología para implementar los requisitos funcionales y no funcionales del sistema.  
- **Valor para el desarrollo:** facilidad de adopción, curva de aprendizaje y soporte de la comunidad.  
- **Gestión de riesgos:** madurez de las tecnologías, estabilidad y disponibilidad de documentación.  
- **Compatibilidad con metodología ágil (Scrum):** soporte para desarrollo iterativo e incremental.  
- **Restricciones del proyecto:** tiempo limitado (12 semanas) y equipo con experiencia media en desarrollo web.  

---

## 3. Stack Tecnológico Seleccionado: MERN

### 3.1 Descripción del Stack MERN

El stack MERN está compuesto por:

- **MongoDB:** base de datos NoSQL orientada a documentos  
- **Express.js:** framework minimalista para creación de APIs en Node.js  
- **React.js:** biblioteca frontend para construcción de interfaces de usuario reactivas  
- **Node.js:** entorno de ejecución para JavaScript en el servidor  

Este stack permite el uso de JavaScript en todo el sistema (frontend y backend), lo que reduce la complejidad de integración entre capas y facilita el desarrollo.

---

## 3.2 Comparación de Alternativas

Se evaluaron tres stacks tecnológicos con el objetivo de determinar cuál se adapta mejor al contexto del proyecto.

### Comparación resumida

| Criterio | MERN (Seleccionado) | Django + React | Spring Boot + Angular |
|----------|---------------------|----------------|------------------------|
| Lenguaje unificado | Sí (JavaScript) | No (Python + JS) | No (Java + TS) |
| Curva de aprendizaje | Baja a media | Media | Alta |
| Facilidad de desarrollo | Alta | Media | Media-baja |
| Escalabilidad | Alta | Media | Alta |
| Adecuación a Scrum | Alta | Media | Media-baja |
| Tiempo de implementación | Óptimo | Medio | Bajo |

### Interpretación de la comparación

- **MERN**: fue seleccionado porque ofrece un lenguaje unificado (JavaScript), lo que simplifica el desarrollo y reduce la curva de aprendizaje del equipo. Además, presenta alta compatibilidad con desarrollo ágil y buena escalabilidad mediante arquitecturas modernas.

- **Django + React**: presenta una arquitectura sólida y segura, sin embargo, introduce dos lenguajes distintos (Python y JavaScript), lo que incrementa la complejidad del proyecto y la curva de aprendizaje.

- **Spring Boot + Angular**: es una opción altamente robusta a nivel empresarial, pero su complejidad técnica y curva de aprendizaje elevada lo hacen poco adecuado para un proyecto con un plazo de 12 semanas.
---

## 3.3 Justificación por Componente

- **MongoDB**: Se selecciona MongoDB debido a la flexibilidad de su modelo de datos. En el sistema de horarios académicos, las entidades como cursos, docentes y aulas pueden variar en estructura. Esto hace que un modelo NoSQL sea más adecuado que bases de datos relacionales rígidas como PostgreSQL, permitiendo cambios rápidos durante el desarrollo.


- **Express.js**: Express.js se utiliza como capa backend ligera sobre Node.js, facilitando la creación de APIs REST de forma rápida y estructurada. Es adecuado para un Producto Mínimo Viable (PMV), donde se prioriza la rapidez de desarrollo sobre arquitecturas complejas.

- **React.js**: React.js permite construir interfaces de usuario dinámicas basadas en componentes reutilizables. Su ecosistema facilita la creación de una SPA (Single Page Application), ideal para la visualización interactiva de horarios académicos.

- **Node.js**: Node.js permite ejecutar JavaScript en el servidor y manejar múltiples solicitudes de forma concurrente mediante un modelo event-driven. Esto lo hace adecuado para sistemas con múltiples usuarios consultando horarios simultáneamente.

---

## 4. Metodología de Desarrollo: Scrum

Se adopta **Scrum** como metodología ágil debido a:

- La naturaleza cambiante de los requerimientos del sistema.  
- La necesidad de entregar resultados incrementales en 12 semanas.  
- La posibilidad de dividir el trabajo en 3 sprints (Sprint 0, Sprint 1, Sprint 2).  
- La mejora continua mediante revisiones y retrospectivas.  

Se descarta Kanban puro debido a que no define entregas por iteraciones, lo que dificulta evidenciar el avance del proyecto en un entorno académico.

---

## 5. Flujo de Control de Versiones: Git Flow

Se adopta el modelo **Git Flow** como estrategia de control de versiones, debido a su organización clara en entornos académicos y proyectos estructurados.

El desarrollo se organiza en las siguientes ramas principales:

- `main`: versión estable del proyecto.
- `develop`: rama principal de integración del desarrollo.
- `feature/nombre-funcionalidad`: desarrollo de nuevas funcionalidades.
- `release`: preparación de versiones estables antes de su despliegue.
- `hotfix`: correcciones urgentes en producción.

Cada funcionalidad se desarrolla en una rama `feature/*` y se integra mediante Pull Requests hacia `develop`.

Las versiones finales se consolidan en `main` tras pruebas y validación.

### Se descartan otras alternativas:

- **Feature Branch Workflow:**  
Aunque es más simple, no ofrece una separación formal entre integración (`develop`) y producción (`main`), lo cual es clave en este proyecto.

- **Trunk-Based Development:**  
Requiere integración continua y automatización CI/CD avanzada no contemplada en el alcance del proyecto.

---

## 6. Conclusión

El stack **MERN combinado con Scrum y Feature Branch Workflow** representa la solución más adecuada para el contexto del proyecto.

Esta elección permite:

- Desarrollo rápido y eficiente  
- Menor complejidad técnica inicial  
- Entregas incrementales funcionales  
- Adaptación a cambios durante el desarrollo  

En conjunto, estas decisiones aseguran coherencia con los objetivos del proyecto, las restricciones de tiempo y el nivel del equipo.