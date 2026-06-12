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

## Evidencias

- `docs/TEST_EVIDENCES.md`
- `docs/COVERAGE_ANALYSIS.md`
- `tests/reports/coverage/`
