# Informe Final de Lecciones Aprendidas
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

**Versión:** 1.0.0  
**Fecha:** Junio 2026  
**Compilado por:** Equipo SGOHA — Taller de Proyectos 2  

---

## 1. Propósito

Este documento consolida las lecciones aprendidas y retrospectivas realizadas a lo largo del ciclo de vida del proyecto SGOHA. Su objetivo es identificar qué funcionó bien para que otros equipos lo adopten, y qué no funcionó para evitarlo en proyectos futuros.

---

## 2. Lecciones Aprendidas por Área

### 2.1 Gestión del Proyecto y Scrum

| ID | Categoría | Descripción | Recomendación |
|----|-----------|-------------|---------------|
| LA-01 | Planificación | El scope comprometido (~90 pts) superó en ~25% la velocidad real del equipo (72 pts). La subestimación fue especialmente grave en tareas relacionadas al motor CSP. | En proyectos con componentes algorítmicos complejos (NP-hard), aplicar un factor de incertidumbre del 30–40% sobre las estimaciones iniciales. Usar Planning Poker con mayor número de rondas. |
| LA-02 | Ejecución | Se registraron aproximadamente 17 días sin avance visible en el burndown entre el 10 y el 27 de abril. | Incluir tareas intermedias y "subtareas de investigación" en el backlog para hacer visible el trabajo cognitivo previo a la implementación. |
| LA-03 | Daily Standup | Los bloqueos entre módulos (CSP ↔ UI) no se detectaron a tiempo por falta de comunicación explícita sobre dependencias. | Incorporar en el daily standup una pregunta explícita sobre dependencias cruzadas entre módulos. |
| LA-04 | Retrospectiva | No se realizaron retrospectivas formales al cierre de cada sprint, lo que retrasó la identificación de mejoras. | Formalizar retrospectivas con formato Start/Stop/Continue al final de cada sprint, con actas documentadas en el repositorio. |

### 2.2 Arquitectura y Decisiones Técnicas

| ID | Categoría | Descripción | Recomendación |
|----|-----------|-------------|---------------|
| LA-05 | Arquitectura | La separación en capas (SPA + API REST) facilitó el desarrollo paralelo entre frontend y backend sin conflictos mayores. | Esta arquitectura es recomendable para equipos donde los perfiles se especializan. Mantener contratos de API REST definidos desde Sprint 0. |
| LA-06 | Stack MERN | El uso de un único lenguaje (JavaScript) en toda la pila redujo la fricción de aprendizaje y facilitó la rotación entre módulos. | Para equipos pequeños y plazos cortos, unificar el lenguaje en toda la pila es una ventaja significativa. |
| LA-07 | Algoritmo CSP | Ningún miembro del equipo tenía experiencia previa en algoritmos de backtracking y CSP. La curva de aprendizaje impactó directamente el cronograma. | Antes de comprometer historias técnicamente complejas, dedicar al menos una semana de spike (investigación técnica) sin presión de entrega. Documentar el spike como tarea explícita en el backlog. |
| LA-08 | Integración | No definir interfaces de integración entre módulos desde el inicio generó bloqueos en cadena (CSP no podía arrancar sin los modelos de datos de Aula/Docente/Curso). | Definir contratos de integración (interfaces de datos y API) en Sprint 0 antes de iniciar la implementación. |

### 2.3 Calidad y Testing

| ID | Categoría | Descripción | Recomendación |
|----|-----------|-------------|---------------|
| LA-09 | TDD | La aplicación del ciclo Red → Green → Refactor permitió detectar errores temprano y construir una base de 208 pruebas sólida. | Mantener TDD como práctica obligatoria. Establecer como Definition of Done que toda historia debe incluir su tarea de prueba. |
| LA-10 | Cobertura | La cobertura de líneas se mantuvo en 30,3%, significativamente menor al 100% aspiracional. Los módulos CSP y de matrícula tuvieron menor cobertura proporcional. | Establecer umbrales de cobertura mínimos por módulo (ej. 60% en módulos críticos) y bloquear el merge si no se alcanzan. |
| LA-11 | SonarQube | La integración de SonarQube fue tardía (no desde Sprint 0). Los 777 code smells y 784 issues acumulados habrían sido menores con revisión continua desde el inicio. | Configurar SonarQube y el Quality Gate desde el Sprint 0. Incorporar el análisis estático como parte del pipeline CI desde la primera semana. |
| LA-12 | Seguridad | Se detectaron 3 vulnerabilidades y vulnerabilidades vigentes en dependencias del frontend al cierre. | Ejecutar `npm audit` como parte del pipeline CI y establecer una política de "cero vulnerabilidades críticas" como condición de merge. |

### 2.4 Documentación

| ID | Categoría | Descripción | Recomendación |
|----|-----------|-------------|---------------|
| LA-13 | Documentación PMBOK | La estructura de documentación por fases (inicio, planificación, ejecución, seguimiento, cierre) siguiendo PMBOK resultó en una documentación trazable y coherente. | Adoptar esta estructura como plantilla base para proyectos futuros. Mantener la carpeta `/docs` como fuente de verdad documental. |
| LA-14 | Documentación técnica | La documentación de la arquitectura con Arc42 y el archivo SPEC.md facilitaron la incorporación de nuevos integrantes y la revisión del alcance. | Mantener el SPEC.md actualizado en cada sprint como referencia técnica oficial del sistema. |
| LA-15 | Formato Markdown | El uso de Markdown en todos los documentos facilitó la lectura directa en GitHub y el versionamiento mediante commits. | Establecer Markdown como formato estándar para toda la documentación del proyecto desde el inicio. |

### 2.5 Trabajo en Equipo y Organización

| ID | Categoría | Descripción | Recomendación |
|----|-----------|-------------|---------------|
| LA-16 | Distribución de carga | La carga de trabajo fue desigual en Sprint 2, concentrándose en Juan Carlos y Yenifer para las tareas CSP más complejas. | Distribuir las historias técnicas complejas entre al menos dos personas para reducir el bus factor y la concentración de riesgo. |
| LA-17 | Pull Requests | El uso obligatorio de Pull Requests con revisión evitó integraciones directas sobre main y mantuvo la calidad del código base. | Mantener la política de PR obligatorio con al menos un revisor. Añadir checklist de revisión (pruebas, lint, documentación). |
| LA-18 | Roles Scrum | La definición clara de roles (Scrum Master, Product Owner, Developers) desde Sprint 0 redujo ambigüedad en la toma de decisiones. | Formalizar los roles en el Project Charter y revisar su efectividad en cada retrospectiva. |

---

## 3. Resumen: ¿Qué salió bien?

1. Implementación funcional del motor CSP con resultado de 0 conflictos en todos los escenarios probados.
2. 208 pruebas unitarias implementadas con metodología TDD, cubriendo servicios críticos, controladores y componentes frontend.
3. Uso consistente de Gitflow con Pull Requests obligatorios y trazabilidad completa de cambios en el repositorio.
4. Documentación PMBOK completa en todas las fases del ciclo de vida.
5. Stack MERN unificado que redujo la fricción técnica entre módulos.
6. Quality Gate SonarQube aprobado al cierre del proyecto.

---

## 4. Resumen: ¿Qué no funcionó?

1. Subestimación del esfuerzo en tareas algorítmicas complejas (CSP/backtracking).
2. Falta de retrospectivas formales por sprint, lo que retrasó la identificación de mejoras aplicables.
3. Cobertura de pruebas insuficiente en módulos de alta criticidad.
4. Inicio tardío de análisis estático (SonarQube) que acumuló deuda técnica.
5. Dependencias entre módulos no documentadas desde Sprint 0, generando bloqueos en cadena.
6. Distribución de carga desigual en sprints de alta complejidad técnica.

---

## 5. Recomendaciones para Proyectos Futuros

1. Incorporar una semana de spike obligatoria antes de comprometer historias con componentes algorítmicos desconocidos.
2. Configurar herramientas de calidad (SonarQube, audit, lint) desde el Sprint 0 como parte del repositorio, no como tarea de cierre.
3. Limitar el scope de cada sprint al 80% de la velocidad real conocida para absorber imprevistos.
4. Documentar contratos de integración entre módulos antes de iniciar la implementación.
5. Formalizar retrospectivas por sprint con actas en el repositorio.

---

*Documento generado en la fase de cierre del proyecto — Taller de Proyectos 2, Ingeniería de Sistemas e Informática, Universidad Continental.*
