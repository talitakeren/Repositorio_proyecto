# Registro de Supuestos (Assumption Log) — Cierre
## Sistema de Generación Óptima de Horarios Académicos (SGOHA)

**Versión:** 2.0.0 (actualización de cierre)  
**Fecha:** Junio 2026  
**Proyecto:** SGOHA — Taller de Proyectos 2

---

## Propósito

Este registro documenta los supuestos definidos al inicio del proyecto, su validación durante la ejecución y su estado final al cierre. Sirve como referencia para proyectos futuros que aborden problemáticas similares.

---

## 1. Supuestos del Proyecto — Evaluación Final

| ID | Categoría | Supuesto original | Justificación inicial | Validado durante ejecución | Estado final | Impacto real | Observaciones de cierre |
|----|-----------|-------------------|----------------------|--------------------------|-------------|-------------|------------------------|
| S01 | Datos | Cada docente tiene una disponibilidad horaria registrada y estática durante el semestre | Simplifica el modelo CSP al eliminar variaciones dinámicas de disponibilidad | ✅ Sí | ✅ Válido | Ninguno | El módulo HU-07 implementó correctamente la disponibilidad estática. No se presentaron casos de disponibilidad dinámica durante las pruebas |
| S02 | Datos | Los prerrequisitos de cada curso son conocidos y no cambian durante el semestre | Permite modelar restricciones de precedencia sin lógica dinámica | ✅ Sí | ✅ Válido | Ninguno | Los prerrequisitos se gestionaron correctamente como grafos de dependencia. No se registraron cambios durante el ciclo de desarrollo |
| S03 | Modelo | El límite de créditos por semestre es uniforme (20 a 22 créditos para todos los estudiantes) | Reduce la variabilidad del modelo; casos especiales fuera del alcance | ✅ Sí | ✅ Válido | Ninguno | El motor de validación de matrícula (HU-06) implementó correctamente este rango. No se solicitaron excepciones individuales |
| S04 | Infraestructura | La capacidad de cada aula es un dato fijo registrado en el sistema | Permite validar asignaciones sin depender de fuentes externas | ✅ Sí | ✅ Válido | Ninguno | El CRUD de aulas captura correctamente la capacidad como atributo. La validación capacidad vs. tamaño de grupo funciona en todos los tests |
| S05 | Técnico | El equipo tiene acceso a internet y puede usar servicios gratuitos en la nube (MongoDB Atlas, Render, Vercel) | Elimina la necesidad de infraestructura propia | ✅ Sí | ✅ Válido | Menor | Se registró latencia alta en conexiones a MongoDB Atlas desde Perú (IMP-03), resuelta con reconfiguración del cluster. Los servicios gratuitos no tuvieron interrupciones significativas |
| S06 | Equipo | Todos los integrantes tienen conocimientos básicos de JavaScript y pueden aprender el stack MERN durante el Sprint 0 | Reduce riesgo técnico al usar un lenguaje unificado | ✅ Parcial | ⚠️ Parcialmente válido | Medio | El conocimiento de JavaScript fue correcto. Sin embargo, el aprendizaje del algoritmo CSP/backtracking requirió tiempo adicional no previsto, contribuyendo al retraso del Sprint 1 |
| S07 | Negocio | Los coordinadores académicos son los usuarios principales del sistema; los estudiantes solo consultan información | Define claramente los roles del sistema para el diseño UX | ✅ Sí | ✅ Válido | Ninguno | La implementación de roles diferenciados (Admin = coordinador, Visualizador = estudiante/docente) fue coherente con este supuesto. La autenticación JWT con roles se implementó en Sprint 5 |

---

## 2. Supuestos Técnicos Implícitos — Identificados durante la ejecución

Los siguientes supuestos no fueron documentados formalmente al inicio pero surgieron durante la implementación y afectaron decisiones de diseño:

| ID | Supuesto emergente | Sprint en que surgió | Impacto | Decisión tomada |
|----|-------------------|---------------------|---------|----------------|
| SE-01 | El algoritmo backtracking básico (sin heurísticas) sería suficiente para el escenario PMV (≤ 30 cursos) | Sprint 1 | Alto | Se implementó backtracking + AC-3. Las heurísticas MRV/LCV fueron pospuestas a v2.0 dado que el tiempo de respuesta fue aceptable dentro del escenario PMV |
| SE-02 | Los módulos CSP y UI podrían integrarse sin contratos de datos formales | Sprint 1 | Alto | Generó bloqueos (IMP-02). Se resolvió mediante acuerdo ad hoc de interfaces. Lección: documentar contratos desde Sprint 0 |
| SE-03 | El pipeline CI podría ejecutar SonarQube sin secretos configurados | Sprint 2 | Bajo | SonarQube se configuró en entorno local con Docker. El CI quedó preparado pero no activo sin `SONAR_TOKEN` |
| SE-04 | Una cobertura de pruebas del 100% era alcanzable en todas las capas | Sprint 1 | Medio | La cobertura real fue 30,3% líneas globales. El 100% se alcanzó solo en el backend crítico (29/29 tests). Se ajustó la métrica de aceptación |

---

## 3. Análisis de Supuestos al Cierre

| Categoría | Cantidad | Válidos | Parcialmente válidos | Inválidos |
|-----------|----------|---------|---------------------|-----------|
| Supuestos iniciales (S01–S07) | 7 | 6 (86%) | 1 (14%) | 0 |
| Supuestos emergentes (SE-01–SE-04) | 4 | 0 | 2 (50%) | 2 (50%) |

**Conclusión:** Los supuestos formales del proyecto demostraron ser sólidos. Las principales desviaciones ocurrieron en supuestos técnicos implícitos no documentados al inicio, lo que refuerza la importancia de explicitar todos los supuestos técnicos en el registro desde Sprint 0.

---

## 4. Recomendaciones para proyectos futuros

1. Incluir supuestos técnicos sobre el algoritmo o enfoque de solución en el Registro de Supuestos desde Sprint 0.
2. Documentar explícitamente los supuestos de integración entre módulos como contratos.
3. Revisar y validar los supuestos en cada retrospectiva de sprint, no solo al cierre.
4. Establecer mecanismos de alerta cuando un supuesto muestre señales de no cumplirse (ej. latencia alta en servicios cloud, curva de aprendizaje mayor a la prevista).

---

*Documento generado en la fase de cierre del proyecto — Taller de Proyectos 2, Ingeniería de Sistemas e Informática, Universidad Continental.*
