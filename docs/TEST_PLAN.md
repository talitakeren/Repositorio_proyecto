# Plan de Pruebas — SGOHA

Las pruebas viven **fuera** de `backend/` y `frontend/`, al mismo nivel, siguiendo la consigna académica.

## Estructura

```
tests/
  unit/backend/          → Jest (servicios, middlewares, utils, CSP)
  unit/frontend/         → Jest + React Testing Library
  integration/api/       → Jest + Supertest
  integration/frontend/  → Jest + MSW
  setup/ fixtures/ mocks/ utils/ reports/
cypress/e2e/
  acceptance/            → Pruebas de aceptación
  e2e/                   → End-to-end (golden/happy/unhappy path)
scripts/                 → run-all-tests.sh, run-e2e.sh, co2-impact.js
```

## Herramientas

| Tipo | Herramienta |
|------|-------------|
| Unitarias backend | Jest |
| Integración API | Jest + Supertest + MongoDB Memory Server |
| Unitarias / componentes frontend | Jest + React Testing Library |
| Integración frontend | Jest + MSW |
| Aceptación / E2E | Cypress |
| Impacto CO₂ | `tests/utils/co2Impact.js` + `npm run test:co2` |

## Comandos (desde la raíz del repo)

```bash
npm install
npm test                      # unit + integration
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:co2
npm run test:acceptance       # Cypress — requiere frontend :5173
npm run test:e2e
npm run cy:open
bash scripts/run-all-tests.sh
```

## Cypress

```bash
# Terminal 1
cd frontend && npm run dev

# Terminal 2 (raíz)
npm run test:e2e
```

Videos: `cypress/videos/` · Capturas: `cypress/screenshots/`

## Matriz de casos

| ID | Tipo | Rol | Módulo | Caso | Prioridad | Automatizada | Estado |
| -- | ---- | --- | ------ | ---- | --------- | ------------ | ------ |
| TP-001 | Unit | — | Auth | `auth.middleware` protege rutas | Alta | ✅ Jest | 🟢 61 tests backend unit |
| TP-002 | Integración | ADMIN | Cursos | CRUD API `/api/courses` | Alta | ✅ Supertest | 🟢 |
| TP-003 | Integración | STUDENT | Matrícula | Validación créditos 20–22 | Crítica | ✅ Supertest | 🟢 |
| TP-004 | Unit | — | CSP | `csp.service` backtracking | Crítica | ✅ Jest | 🟡 Parcial |
| TP-005 | Unit | — | Frontend | `authRedirect`, `Input` | Media | ✅ RTL | 🟢 |
| TP-006 | Integración | — | Frontend | MSW `courseService` | Media | ✅ Jest | 🟢 |
| TP-007 | E2E | ADMIN | Login | Golden path admin | Alta | Cypress | Caso definido — requiere backend |
| TP-008 | A11y | ALL | Login | axe WCAG login | Alta | ✅ Cypress | 🧪 `login.cy.js` |
| TP-009 | A11y | ADMIN | Dashboard | axe sin críticas | Alta | ✅ Cypress | 🧪 `admin-dashboard.cy.js` |
| TP-010 | A11y | ADMIN | Cursos | axe listado | Media | ✅ Cypress | 🧪 `courses.cy.js` |
| TP-011 | A11y | TEACHER | Disponibilidad | axe grilla | Alta | ✅ Cypress | 🧪 `teacher-availability.cy.js` |
| TP-012 | A11y | STUDENT | Matrícula | axe flujo | Alta | ✅ Cypress | 🧪 `student-enrollment.cy.js` |
| TP-013 | Seguridad | — | Deps | npm audit | Alta | ✅ CI | 🟢 backend 0 CVE |
| TP-014 | Seguridad | — | API | Rate limit login | Alta | ✅ Manual/CI | 🟢 |
| TP-015 | Usabilidad | ALL | Global | Cuestionario SUS | Media | Script CSV | 🧑‍💻 Validación humana |
| TP-016 | Regresión | ALL | CI | `npm test` 208 casos | Crítica | ✅ CI | 🟢 |

## Evidencias

- `docs/TEST_EVIDENCES.md`
- `docs/COVERAGE_ANALYSIS.md`
- `tests/reports/coverage/`
