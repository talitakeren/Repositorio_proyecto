# Registro de pruebas — SGOHA

> Plantilla operativa · Fecha de carga: 2026-06-17

| ID | Tipo | Módulo | Caso | Ejecutor | Fecha | Entorno | Resultado | Evidencia |
| -- | ---- | ------ | ---- | -------- | ----- | ------- | --------- | --------- |
| REG-001 | Unit | Auth | Middleware `protect` rechaza sin token | CI GitHub | 2026-06-17 | ubuntu-latest | ✅ Pass | EV-TST-001 |
| REG-002 | Integración | Matrícula | Créditos fuera de rango rechazados | CI GitHub | 2026-06-17 | Memory Server | ✅ Pass | tests/integration/api |
| REG-003 | Unit | CSP | Asignación sin conflicto docente | Local | 2026-06-17 | Jest | ✅ Pass | csp.service.test.js |
| REG-004 | Lint | Frontend | ESLint sin errores | Local | 2026-06-17 | Node 20 | ✅ Pass | frontend-quality.txt |
| REG-005 | Build | Frontend | `vite build` | Local | 2026-06-17 | Node 20 | ✅ Pass | frontend/dist |
| REG-006 | A11y | Login | axe WCAG | CI | 2026-06-17 | Cypress | Caso definido — requiere ejecución | login.cy.js |
| REG-007 | Seguridad | Deps | npm audit backend 0 CVE | Local | 2026-06-17 | npm 10 | ✅ Pass | backend-npm-audit.json |
| REG-008 | E2E | Horarios | Generación feliz con seed | Manual | — | Local Docker | Caso definido — requiere ejecución | — |
| REG-009 | Manual | WCAG | Navegación solo teclado dashboard | UX | — | Chrome | 🧑‍💻 Validación humana | WCAG_MANUAL_CHECKLIST M-04 |
| REG-010 | SUS | Usabilidad | Cuestionario 10 ítems | Moderador | — | Sala piloto | 🧑‍💻 Validación humana | CUESTIONARIO_SUS.md |

## Notas

- Los casos **Caso definido — requiere ejecución** tienen automatización o procedimiento listo pero no se forzó resultado falso en este registro.
- Relacionar nuevas filas con [`TEST_EVIDENCES.md`](../TEST_EVIDENCES.md).
