# Índice de evidencias — SGOHA

> Relacionar capturas con el [Informe 7.2](../INFORME_TECNICO_INTEGRAL_7_2.md). No incluir secretos ni PII.

## 🔍 SonarQube

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| SON-01 | `sonarqube/01-quality-gate.png` | Quality Gate en panel | 📸 Requiere ejecución SonarQube |
| SON-02 | `sonarqube/02-issues.png` | Issues (bugs/smells) | 📸 Requiere ejecución SonarQube |
| SON-03 | `sonarqube/03-coverage.png` | Cobertura importada LCOV | 📸 Requiere ejecución SonarQube |
| SON-04 | `../reportes/sonar/frontend-quality.txt` | Salida ESLint | ✅ Generado |
| SON-05 | `../reportes/sonar/coverage-summary.md` | Resumen Jest | ✅ Generado |

## 🔐 OWASP

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| SEC-01 | `../reportes/security/backend-npm-audit.json` | Audit backend | ✅ 0 CVE |
| SEC-02 | `../reportes/security/frontend-npm-audit.json` | Audit frontend | ✅ Generado |
| SEC-03 | `owasp/04-zap-baseline.html` | Reporte ZAP | ⚙️ Artefacto CI |
| SEC-04 | `owasp/03-codeql.png` | CodeQL GitHub | 📸 Pestaña Security |

## ♿ WCAG

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| A11Y-01 | `wcag/01-lighthouse-login.png` | Lighthouse login | 📸 Ejecutar LHCI |
| A11Y-02 | `cypress/screenshots/` | Fallos axe | Solo si CI falla |
| A11Y-03 | `wcag/03-keyboard.png` | Navegación teclado | 🧑‍💻 Manual |

## 🧑‍💻 SUS

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| SUS-01 | `../reportes/usability/sus-results.json` | Resultados calculados | Tras CSV real |
| SUS-02 | `sus/01-cuestionarios.png` | Formularios anonimizados | 🧑‍💻 Sesión |

## ⚙️ CI/CD

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| CI-01 | `ci-cd/01-ci-success.png` | Workflow CI verde | 📸 GitHub Actions |
| CI-02 | `ci-cd/02-codeql.png` | CodeQL | ⚙️ Automatizado |
| CI-03 | `ci-cd/03-sonar.png` | Sonar (si token) | Requiere credencial |

## 🧪 Pruebas

| Código | Evidencia | Descripción | Estado |
| ------ | --------- | ----------- | ------ |
| TST-01 | `../TEST_EVIDENCES.md` | Tabla de trazabilidad | ✅ |
| TST-02 | `pruebas/04-generacion-horarios.png` | Captura manual | Opcional |

## Reportes JSON/HTML (sin captura)

```bash
npm run audit:security
npm run test:coverage
```

Ver [`docs/reportes/`](../reportes/) y [`docs/evidencias/README.md`](./README.md).
