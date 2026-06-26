# Registro de Impedimentos (Impediment Log)
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

---

## Definición

Un impedimento es un obstáculo externo o interno al equipo que frena el progreso del trabajo y que no puede ser resuelto autónomamente por el desarrollador responsable sin intervención del Scrum Master u otras partes.

| Campo | Valores |
|-------|---------|
| Impacto | Alto · Medio · Bajo |
| Estado | Activo · En resolución · Eliminado |

---

## Registro

| ID | Fecha | Sprint | Descripción del impedimento | Impacto en el proyecto | Responsable de resolución | Acción de mitigación | Fecha resolución | Estado |
|----|-------|--------|-----------------------------|----------------------|--------------------------|---------------------|-----------------|--------|
| IMP-01 | 10 Abr 2026 | Sprint 1 | Ningún miembro del equipo tenía experiencia previa en algoritmos CSP y backtracking. El aprendizaje self-directed retrasó el inicio de la implementación del motor. | Alto — Bloqueó el inicio de T-04.1 durante ~2 semanas | Juan Carlos (SM) | Distribución de responsabilidades de aprendizaje: Juan Carlos lideró el modelado CSP, Yenifer el motor backtracking. Se utilizaron recursos académicos y documentación oficial como referencia. Spike no formalizado pero ejecutado en los primeros días del sprint. | 27 Abr 2026 | Eliminado |
| IMP-02 | 13 Abr 2026 | Sprint 1 | Falta de definición formal de interfaces entre el módulo CSP y los modelos de datos (Aula, Docente, Curso). El responsable del motor CSP no podía avanzar sin conocer la estructura exacta de los datos. | Alto — Bloqueó T-04.1 hasta resolver contratos de datos | Juan Carlos (SM) | Sesión técnica de alineación entre Juan Carlos (CSP) y Alexandra/Yenifer (modelos de datos). Se acordó un esquema de datos provisional y se documentó como contrato interno. | 16 Abr 2026 | Eliminado |
| IMP-03 | 20 Abr 2026 | Sprint 1 | Entorno local de MongoDB Atlas con latencia alta en conexiones desde Perú, afectando el tiempo de respuesta de las pruebas de integración. | Medio — Aumentó el tiempo de ejecución de tests de integración | Tatiana (QA) | Se configuró conexión directa a cluster más cercano en Atlas. Se añadió timeout explícito en los tests de integración. Tests unitarios continuaron sin impacto. | 22 Abr 2026 | Eliminado |
| IMP-04 | 25 Abr 2026 | Sprint 1 | Las historias de usuario de alta complejidad técnica (HU-04, HU-05) no podían marcarse como completadas en el tablero aunque el trabajo técnico avanzaba, generando un burndown artificialmente plano. | Medio — Distorsionó la visibilidad del avance real del sprint | Juan Carlos (SM) | Se descompusieron HU-04 y HU-05 en subtareas técnicas explícitas (T-04.1, T-04.2, T-04.3, T-05.1, T-05.2, T-05.3) permitiendo registrar avance parcial. | 27 Abr 2026 | Eliminado |
| IMP-05 | 28 Abr 2026 | Sprint 1 | Conflictos de merge frecuentes en la rama `main` al integrar el módulo CSP con el frontend de visualización de horarios. | Medio — Ralentizó la integración entre frontend y backend | Talita (Frontend) / Juan Carlos | Se reforzó el uso de Feature Branch Workflow: cada módulo en rama separada, integración solo mediante Pull Requests con revisión obligatoria. Se estableció convención de nombres de rama. | 2 May 2026 | Eliminado |
| IMP-06 | 5 May 2026 | Sprint 2 | SonarQube no disponible en el pipeline CI de GitHub Actions por ausencia de `SONAR_TOKEN` en los secretos del repositorio. | Bajo — Análisis estático solo ejecutable localmente | Alexandra | Se configuró el análisis SonarQube en entorno local con Docker (`docker-compose.sonar.yml`). El workflow `sonar.yml` se dejó preparado para activarse cuando el secreto esté configurado. | 8 May 2026 | Eliminado |
| IMP-07 | 10 May 2026 | Sprint 2 | Vulnerabilidades en dependencias frontend (`npm audit`) no corregibles sin actualizar librerías que rompen compatibilidad con la versión de React utilizada. | Bajo — Riesgo de seguridad documentado, no crítico en producción | Tatiana (QA) | Se documentó el hallazgo en el Registro de Incidentes (INC-01). Las dependencias afectadas son de desarrollo (devDependencies). Se planificó actualización para v2.0. | Pospuesto | En resolución |

---

## Análisis de Impedimentos

| Categoría | Cantidad | Porcentaje |
|-----------|----------|-----------|
| Técnicos (algoritmo, integración) | 3 | 43% |
| De proceso (visibilidad, Scrum) | 2 | 29% |
| De infraestructura (CI/CD, cloud) | 2 | 29% |
| **Total** | **7** | 100% |

**Tiempo promedio de resolución:** 3,5 días hábiles.  
**Impedimentos eliminados:** 6 de 7 (86%).  
**Impedimentos en resolución:** 1 (pospuesto a v2.0).

---

## Lección principal

La mayoría de los impedimentos (5 de 7) tuvieron origen en la falta de definición previa de contratos técnicos y la ausencia de spikes formales. La resolución fue siempre interna al equipo, sin necesidad de escalamiento externo.
