# Declaración de Trabajo — Validación de Cierre (Statement of Work)
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)
---

## 1. Descripción del Alcance Comprometido

El proyecto SGOHA se comprometió a desarrollar un Producto Mínimo Viable (PMV) de una plataforma web de generación automática de horarios académicos, implementando los siguientes componentes bajo el stack MERN y metodología Scrum, en un periodo de 12 semanas académicas.

---

## 2. Verificación de Entregables por Módulo

### 2.1 Módulo de Gestión de Entidades

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| CRUD Estudiantes | Registro, edición, consulta y eliminación de estudiantes con validaciones | ✅ Completo | `backend/routes/` · `student.controller.test.js` (4 tests) |
| CRUD Docentes | Gestión de docentes con disponibilidad horaria | ✅ Completo | `backend/src/` · `classroom.service.test.js` |
| CRUD Cursos | Gestión de cursos con prerrequisitos y créditos | ✅ Completo | `course.controller.test.js` (5 tests) · `course.service.test.js` |
| CRUD Aulas | Gestión de aulas con capacidad y disponibilidad | ✅ Completo | `classroom.controller.test.js` (6 tests) |

### 2.2 Módulo de Matrícula y Validación

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Validación de prerrequisitos | Verificación de grafo de dependencias antes de confirmar matrícula | ✅ Completo | `enrollment.service.test.js` · `scheduleEnrollment.test.js` |
| Validación de límite de créditos | Control de rango 20–22 créditos por semestre | ✅ Completo | `settings.service.test.js` |
| Respuestas de error descriptivas | Mensaje de error claro cuando falla la validación | ✅ Completo | `apiResponse.test.js` · Error 400 con mensaje desde backend |

### 2.3 Módulo CSP — Motor de Generación de Horarios

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Modelo CSP con variables y dominios | Variables de decisión: (curso, docente, aula, franja) | ✅ Completo | `csp.service.test.js` · SPEC.md |
| Restricciones duras HC1–HC3 | No solapamiento de docentes, aulas y franjas | ✅ Completo | 0 conflictos en escenarios de prueba |
| Restricciones blandas SC1–SC2 | Preferencias de disponibilidad docente | ✅ Completo | `backend/services/` |
| Algoritmo backtracking + AC-3 | Motor de búsqueda con propagación de restricciones | ✅ Completo | `csp.service.test.js` · Tiempo < 10 s en PMV |
| Criterio de rendimiento | Generación en < 10 s para ≤ 30 cursos, 15 docentes, 10 aulas | ✅ Completo | T-05.3 prueba de rendimiento |

### 2.4 Módulo de Visualización

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Grilla semanal de horarios | Visualización de horarios generados con franjas horarias | ✅ Completo | Componente React validado en pruebas de UI |
| Indicadores de conflicto | Visualización de conflictos en la grilla (T-08.3) | ✅ Completo | Indicadores en rojo con descripción del conflicto |
| Vista por rol (Admin / Visualizador) | Vistas diferenciadas según tipo de usuario | ✅ Completo | Implementado con JWT + middleware de roles |

### 2.5 Módulo de Autenticación y Seguridad

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Autenticación JWT | Login/logout/refresh con tokens JWT | ✅ Completo | `auth.service.test.js` (7 tests) · `auth.middleware.test.js` |
| Roles diferenciados (Admin / Visualizador) | Control de acceso por rol en todos los endpoints | ✅ Completo | `auth.middleware.test.js` · Errores 401 y 403 verificados |
| Cabeceras de seguridad (Helmet) | Endurecimiento de cabeceras HTTP | ✅ Completo | `helmet` configurado en `server.js` |
| Rate limiting | Protección contra fuerza bruta y abuso | ✅ Completo | `loginRateLimiter` y `apiRateLimiter` activos |
| HTTPS | Cifrado en tránsito | ✅ Completo | Configurado en despliegue (Render con HTTPS) |

### 2.6 Calidad y Testing

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Pruebas unitarias backend | Cobertura de servicios, controladores y middlewares | ✅ Completo | 208 pruebas ejecutadas · `tests/unit/backend/` |
| Pruebas unitarias frontend | Cobertura de componentes y utilitarios React | ✅ Completo | `tests/unit/frontend/` |
| TDD documentado | Evidencia del ciclo Red → Green → Refactor | ✅ Completo | Drive: evidencia TDD disponible |
| SonarQube Quality Gate | Análisis estático con Quality Gate aprobado | ✅ Completo | `SONARQUBE_LOCAL_EXECUTION.md` · Status OK |
| ESLint sin errores | 0 errores de lint en frontend | ✅ Completo | ESLint ejecutado en pipeline CI |
| Audit backend sin vulnerabilidades | 0 vulnerabilidades en cadena de suministro backend | ✅ Completo | `npm audit` backend clean |

### 2.7 Documentación

| Entregable | Descripción comprometida | Estado | Evidencia |
|------------|------------------------|--------|-----------|
| Documentación fase inicio | Charter, Visión, Supuestos, Requerimientos, equipo | ✅ Completo | `/docs/1. inicio/` · 8 documentos |
| Documentación fase planificación | Backlog, cronograma, presupuesto, registro de riesgos | ✅ Completo | `/docs/2. planificacion/` · 5 documentos |
| Documentación fase ejecución | Documentación técnica, TDD, Green Software | ✅ Completo | `/docs/3. ejecucion/` · 5 documentos |
| Documentación fase seguimiento | Métricas ágiles, SonarQube, pruebas, análisis | ✅ Completo | `/docs/4. seguimiento_control/` · 6 documentos |
| Documentación fase cierre | Documentos de cierre PMBOK | ✅ Completo | `/docs/5.cierre/` |
| Formato Markdown | Todos los documentos en `.md` | ✅ Completo | Repositorio GitHub |
| Repositorio con Gitflow | Feature Branch + Pull Requests obligatorios | ✅ Completo | Historial de commits y PRs en GitHub |

---

## 3. Entregable Pendiente — Exclusión Justificada

| Entregable | Estado | Justificación | Plan |
|------------|--------|--------------|------|
| Exportación PDF/Excel (HU-09) | ❌ No entregado | Priorización técnica: se garantizó la estabilidad del motor CSP. La exportación no afecta la funcionalidad core del PMV. | Registrado en backlog de versión 2.0 con estimación T-09.1 (PDF) y T-09.2 (Excel) |

---

## 4. Verificación de Criterios de Aceptación del Contrato Académico

| Criterio | Evidencia de cumplimiento | Estado |
|----------|--------------------------|--------|
| Sistema funcional y demostrable | Video demostrativo disponible en el README | ✅ |
| Documentación técnica y de gestión completa | Carpeta `/docs` con 24+ documentos en todas las fases | ✅ |
| Repositorio público versionado | https://github.com/talitakeren/Repositorio_proyecto | ✅ |
| Pruebas automatizadas documentadas | 208 pruebas en `tests/` · 29/29 backend | ✅ |
| Aplicación de metodología Scrum | Backlogs, sprints, roles y eventos documentados | ✅ |
| Alineación con buenas prácticas PMBOK | Documentación por fases con trazabilidad | ✅ |

---

## 5. Declaración de Cierre

El equipo del proyecto SGOHA declara que el trabajo comprometido en el alcance del PMV ha sido completado de acuerdo con los criterios de aceptación definidos en el Project Charter, con la única excepción de la exportación PDF/Excel (HU-09), cuya postergación fue una decisión técnica documentada y aceptada por el equipo.

El repositorio está en condiciones de recibir iteraciones futuras, el sistema es operativo en el entorno de despliegue, y la documentación está completa y versionada.
