# Evidencias de pruebas — SGOHA

> Trazabilidad entre prueba, reporte y commit · Actualizado: 2026-06-17

| Evidencia | Área | Caso | Ruta | Resultado | Commit |
| --------- | ---- | ---- | ---- | --------- | ------ |
| EV-TST-001 | Jest | Suite completa 208 tests | `npm test` | ✅ Pass | `fb539a2` |
| EV-TST-002 | Cobertura | LCOV consolidado | `tests/reports/coverage/html/index.html` | 30,3 % líneas | `fb539a2` |
| EV-TST-003 | ESLint | Frontend lint | `docs/reportes/sonar/frontend-quality.txt` | 0 errores | `fb539a2` |
| EV-TST-004 | Build | Vite production | `frontend/dist/` | ✅ Build OK | `fb539a2` |
| EV-TST-005 | API | Integración matrícula | `tests/integration/api/` | ✅ Pass | `fb539a2` |
| EV-TST-006 | A11y | Login axe | `cypress/e2e/accessibility/login.cy.js` | Caso definido — CI | `fb539a2` |
| EV-TST-007 | A11y | Dashboard axe | `cypress/e2e/accessibility/admin-dashboard.cy.js` | Caso definido — CI | `fb539a2` |
| EV-TST-008 | Seguridad | npm audit backend | `docs/reportes/security/backend-npm-audit.json` | 0 vulnerabilidades | `fb539a2` |
| EV-TST-009 | Seguridad | npm audit frontend | `docs/reportes/security/frontend-npm-audit.json` | 5 (dev/runtime) | `fb539a2` |
| EV-TST-010 | Sonar | Cobertura resumen | `docs/reportes/sonar/coverage-summary.md` | Documentado | `fb539a2` |
| EV-CYP-001 | E2E | Golden path | `cypress/e2e/e2e/` | Caso definido — requiere ejecución | — |
| EV-LHCI-001 | A11y | Lighthouse | `docs/reportes/accessibility/lighthouse/` | Requiere ejecución LHCI | — |

## Capturas manuales sugeridas

| Código | Módulo | Archivo destino |
| ------ | ------ | --------------- |
| CAP-01 | Login ADMIN | `docs/evidencias/pruebas/01-login-admin.png` |
| CAP-02 | Disponibilidad | `docs/evidencias/pruebas/02-disponibilidad.png` |
| CAP-03 | Matrícula | `docs/evidencias/pruebas/03-matricula.png` |
| CAP-04 | Horarios | `docs/evidencias/pruebas/04-horarios.png` |

## Comandos de reproducción

```bash
npm test
npm run test:coverage
cd frontend && npm run lint && npm run build
npm run test:a11y    # preview en :5173
npm run audit:security
```
