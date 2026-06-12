# Evidencias de pruebas

| Suite | Comando | Resultado |
|-------|---------|-----------|
| Unit backend | `npm run test:unit:backend` | 61 tests |
| Unit frontend | `npm run test:unit:frontend` | 82 tests |
| Integración API | `npm run test:integration:api` | 38 tests |
| Integración frontend MSW | `npm run test:integration:frontend` | 27 tests |
| **Total Jest** | `npm test` | **208 tests** |
| Cobertura | `npm run test:coverage` | HTML + LCOV + resumen JSON |
| Cypress aceptación | `npm run test:acceptance` | Requiere `npm run dev` en frontend |
| Cypress E2E | `npm run test:e2e` | Requiere frontend activo |
| CO₂ | `npm run test:co2` | `tests/reports/coverage-summary/co2-impact.json` |

## Ubicación reportes

### Cobertura (Jest)

| Archivo | Descripción |
|---------|-------------|
| `tests/reports/coverage/index.html` | **Índice principal** — enlaces al reporte consolidado y por suite |
| `tests/reports/coverage/html/index.html` | **Reporte HTML consolidado** (backend + frontend, todas las suites) |
| `tests/reports/coverage/coverage-summary.json` | Resumen numérico global |
| `tests/reports/coverage/backend-unit/index.html` | Cobertura unit backend |
| `tests/reports/coverage/backend-integration/index.html` | Cobertura integración API |
| `tests/reports/coverage/frontend-unit/index.html` | Cobertura unit frontend |
| `tests/reports/coverage/frontend-integration/index.html` | Cobertura integración MSW |

Abrir en el navegador:

```bash
npm run test:coverage
npm run coverage:open
```

### Otros

- Logs: `docs/evidences/logs/`
- Cypress videos: `cypress/videos/`

## Escenario fallido controlado

```bash
npm run test:unit:backend -- --testNamePattern="no existe"
```

Debe reportar 0 tests o FAIL si se altera una assertion.
