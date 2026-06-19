# Resumen de cobertura — SGOHA

> **Generado:** 2026-06-17 · **Comando:** `npm run test:coverage` · **Commit:** `fb539a2`

## Consolidado (4 suites Jest)

| Métrica | Total | Cubierto | Porcentaje |
| ------- | ----: | -------: | ---------: |
| Líneas | 2171 | 658 | **30,3 %** |
| Sentencias | 2420 | 702 | **29,0 %** |
| Funciones | 669 | 149 | **22,3 %** |
| Ramas | 1788 | 252 | **14,1 %** |

## Suites ejecutadas

| Suite | Archivo LCOV | Pruebas |
| ----- | ------------ | -------: |
| Backend unitarias | `tests/reports/coverage/backend-unit/lcov.info` | 61 |
| Backend integración API | `tests/reports/coverage/backend-integration/lcov.info` | 38 |
| Frontend unitarias | `tests/reports/coverage/frontend-unit/lcov.info` | 82 |
| Frontend integración MSW | `tests/reports/coverage/frontend-integration/lcov.info` | 27 |
| **Total Jest** | — | **208** |

## Interpretación rápida

| Área | Cobertura relativa | Riesgo SGOHA |
| ---- | ------------------ | ------------ |
| `authService`, `dashboardService`, `settingsService` | Alta en unitarias | 🟢 Controles de autenticación parcialmente cubiertos |
| `enrollmentService` (frontend) | Media (~53 %) | 🟡 Validación de créditos/prerrequisitos en UI |
| `csp.service`, `scheduleService`, portales | Baja o 0 % | 🟠 Motor CSP y horarios con huecos críticos |
| Páginas React administrativas | Baja | 🟡 Regresiones visuales no detectadas solo con Jest |

## Reportes HTML

- Índice: [`tests/reports/coverage/index.html`](../../../tests/reports/coverage/index.html)
- Consolidado: [`tests/reports/coverage/html/index.html`](../../../tests/reports/coverage/html/index.html)

## SonarQube

Los archivos LCOV anteriores se referencian en `sonar-project.properties`. Las métricas de Quality Gate (bugs, smells, duplicación) **requieren ejecución de SonarQube** — ver [GUIA_EJECUCION_SONARQUBE.md](./GUIA_EJECUCION_SONARQUBE.md).
