# Informe Final del Proyecto
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)
---

## 1. Resumen Ejecutivo

El proyecto SGOHA desarrolló un Producto Mínimo Viable (PMV) de una aplicación web basada en el stack MERN capaz de generar horarios académicos válidos aplicando un modelo de Satisfacción de Restricciones (CSP). El sistema fue construido bajo metodología Scrum en un periodo de 12 semanas académicas, logrando implementar el núcleo funcional del algoritmo de generación y los módulos de gestión de entidades académicas.

El resultado final es un sistema operativo que resuelve el problema de planificación automática de horarios con restricciones duras verificadas, 208 pruebas ejecutadas y Quality Gate aprobado en SonarQube.

---

## 2. Descripción del Proyecto

| Campo | Detalle |
|-------|---------|
| Nombre | Sistema de Generación Óptima de Horarios Académicos |
| Sigla | SGOHA |
| Metodología | Scrum + Feature Branch Workflow (Gitflow) |
| Stack tecnológico | React.js 18 · Node.js + Express.js · MongoDB Atlas |
| Repositorio | https://github.com/talitakeren/Repositorio_proyecto |
| Duración | 12 semanas (Sprint 0, Sprint 1, Sprint 2) |

---

## 3. Desempeño del Alcance

### 3.1 Funcionalidades comprometidas vs. entregadas

| Funcionalidad | Comprometida | Entregada | Estado |
|---------------|-------------|-----------|--------|
| Gestión de estudiantes (CRUD) | Sí | Sí | ✅ Completo |
| Gestión de docentes (CRUD) | Sí | Sí | ✅ Completo |
| Gestión de cursos (CRUD) | Sí | Sí | ✅ Completo |
| Gestión de aulas (CRUD) | Sí | Sí | ✅ Completo |
| Motor CSP con backtracking + AC-3 | Sí | Sí | ✅ Completo |
| Restricciones duras (no solapamiento) | Sí | Sí | ✅ Completo |
| Restricciones blandas (preferencias docentes) | Sí | Parcial | ⚠️ Parcial |
| Validación de matrícula (prerrequisitos + créditos) | Sí | Sí | ✅ Completo |
| Visualización de horarios por usuario | Sí | Sí | ✅ Completo |
| Autenticación JWT con roles | Sí | Sí | ✅ Completo |
| Exportación PDF / Excel | Sí | No entregado | ❌ Fuera de PMV |
| Integración con sistemas externos (SIS/ERP) | Excluido | — | — |

### 3.2 Exclusiones formales del alcance
- Integración con sistemas universitarios existentes (SIS, ERP).
- Módulo de notificaciones (correo electrónico o SMS).
- Algoritmos avanzados de optimización (genéticos o metaheurísticos).
- Exportación de reportes en PDF o Excel (pospuesto a versión futura).

---

## 4. Desempeño de Calidad

| Métrica | Valor obtenido | Umbral aceptable | Estado |
|---------|---------------|-----------------|--------|
| Pruebas unitarias ejecutadas | 208 | ≥ 100 | ✅ |
| Cobertura de líneas (Jest) | 30,3 % | — | 🟠 Riesgo medio |
| Cobertura (SonarQube efectivo) | 15,5 % | — | 🟠 Riesgo alto |
| Quality Gate SonarQube | OK | OK | ✅ |
| Bugs detectados (Sonar) | 4 | 0 ideal | 🟡 Observación |
| Vulnerabilidades (Sonar) | 3 | 0 ideal | 🟠 Riesgo medio |
| Code Smells | 777 | < 200 ideal | 🟠 Deuda técnica |
| ESLint errores frontend | 0 | 0 | ✅ |
| Audit backend vulnerabilidades | 0 | 0 | ✅ |
| Tiempo generación de horarios | < 10 s | < 10 s | ✅ |
| Conflictos en horarios generados | 0 | 0 | ✅ |

---

## 5. Desempeño del Cronograma

| Sprint | Periodo planificado | Periodo real | Puntos comprometidos | Puntos completados |
|--------|--------------------|--------------|--------------------|-------------------|
| Sprint 0 | Semanas 1–3 | Semanas 1–3 | — | ✅ Documentación inicial |
| Sprint 1 | Semanas 4–7 | Semanas 4–8 | ~90 pts | ~72 pts (80 %) |
| Sprint 2 | Semanas 8–12 | Semanas 9–12 | — | ✅ Motor CSP + documentación |

---

## 6. Desempeño de Costos

El proyecto operó bajo restricción de presupuesto cero. Todos los recursos utilizados correspondieron a servicios gratuitos o de uso académico:

| Recurso | Costo | Proveedor |
|---------|-------|-----------|
| Base de datos | $0 | MongoDB Atlas (free tier) |
| Hosting frontend | $0 | Vercel (free tier) |
| Hosting backend | $0 | Render (free tier) |
| Repositorio y CI/CD | $0 | GitHub (cuenta estudiante) |
| Análisis estático | $0 | SonarQube Community (local) |
| **Total** | **$0** | — |

---

## 7. Resumen de Riesgos Materializados

| ID | Descripción | Impacto real | Respuesta aplicada | Estado final |
|----|-------------|-------------|-------------------|-------------|
| 240409a | Datos inválidos en CRUD afectan calidad del horario | Alto | Validaciones en API REST implementadas (T-01.2, T-02.2, T-03.2) | ✅ Mitigado |
| 240409b | Conflictos de solapamiento en horarios | Muy alto | T-04.2 implementado: restricciones duras en CSP | ✅ Mitigado |
| 240409c | Retrasos por complejidad del CSP | Alto | Backtracking básico + AC-3; heurísticas pospuestas | ✅ Cerrado |
| 240409f | Falta de experiencia en CSP/backtracking | Medio | Distribución de tareas por especialidad; capacitación interna | ✅ Mitigado |
| 4.2 | Sprint 2 con 76 puntos; riesgo de no completar | Alto | Repriorización del backlog; entrega incremental | ⚠️ Parcial |

---

## 8. Incidencias Principales

| ID | Descripción | Impacto | Estado final |
|----|-------------|---------|-------------|
| INC-01 | Audit frontend con vulnerabilidades vigentes en dependencias | Riesgo de seguridad en seguimiento | Pendiente de actualización |
| INC-02 | Cobertura de pruebas por debajo del objetivo (30,3 % vs. 100 % ideal) | Riesgo de regresión en módulos CSP | En plan de mejora |
| INC-03 | Exportación PDF/Excel no entregada | Funcionalidad postergada | Registrada para v2.0 |

---

## 9. Criterios de Éxito — Evaluación Final

| Criterio | Resultado | ¿Cumplido? |
|----------|-----------|-----------|
| Sistema genera horarios válidos sin conflictos | 0 conflictos en todos los escenarios probados | ✅ Sí |
| Tiempo de respuesta < 10 segundos | Cumplido en escenario PMV (≤ 30 cursos, 15 docentes, 10 aulas) | ✅ Sí |
| Pruebas unitarias documentadas y ejecutadas | 208 pruebas, 29/29 tests pasados en backend | ✅ Sí |
| Documentación PMBOK completa | Documentación en todas las fases (inicio, planificación, ejecución, seguimiento, cierre) | ✅ Sí |
| Repositorio versionado con Gitflow | Feature Branch Workflow + Pull Requests en GitHub | ✅ Sí |
| Entrega en 12 semanas | Entregado con extensión de 8 días en sprint 1 | ⚠️ Parcial |

---

## 10. Conclusiones y Recomendaciones Estratégicas

El equipo logró construir un PMV funcional de un sistema de optimización de complejidad inherentemente alta (NP-hard), utilizando tecnologías modernas, metodología ágil y buenas prácticas de ingeniería de software. Los resultados técnicos son sólidos: el algoritmo CSP opera correctamente, las pruebas validan los flujos críticos y el sistema está documentado end-to-end.

Las principales brechas identificadas para versiones futuras son:

1. Aumentar la cobertura de pruebas a un mínimo del 70 % en módulos CSP y matrícula.
2. Resolver las 3 vulnerabilidades y 4 bugs reportados por SonarQube antes de producción.
3. Implementar exportación PDF/Excel (HU-09).
4. Refinar las restricciones blandas (preferencias de docentes) para mejorar la calidad de los horarios generados.
5. Planificar sprints futuros con scope de ~70 puntos y descomposición más granular de historias complejas.
