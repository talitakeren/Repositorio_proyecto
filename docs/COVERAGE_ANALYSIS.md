# Análisis de cobertura

> Ejecutar: `npm run test:coverage` desde la raíz.

## Reportes generados

| Archivo | Descripción |
|---------|-------------|
| `tests/reports/coverage/index.html` | Índice con enlaces a todos los reportes |
| `tests/reports/coverage/html/index.html` | **Reporte HTML consolidado** (todas las suites) |
| `tests/reports/coverage/coverage-summary.json` | Porcentajes globales en JSON |

Abrir en navegador: `npm run coverage:open`

## Meta consigna

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Cobertura global | ≥ 70% | En progreso — ampliar tests CSP y páginas |
| Lógica crítica | ≥ 85% | `course.service`, `auth.middleware`, `csp.service` parcial |

## Módulos cubiertos

- Backend: `apiResponse`, `auth.middleware`, `course.service`, `csp.service`, rutas vía Supertest
- Frontend: `authRedirect`, `settingsValidation`, `Button`, `Input`, `authService`, `courseService`

## Prioridad siguiente

1. `schedule.service.js` / `enrollment.service.js`
2. Páginas admin (`CoursesPage`, `SchedulesPage`)
3. E2E Cypress contra backend real con seed

## Exclusiones

- `backend/src/server.js` — arranque HTTP
- `frontend/src/main.jsx` — bootstrap
- Código legado PoC en `backend/routes/`
