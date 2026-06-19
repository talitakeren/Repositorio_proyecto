# Matriz general de hallazgos — SGOHA

> Actualizado: 2026-06-17 · Informe: [INFORME_TECNICO_INTEGRAL_7_2.md](../INFORME_TECNICO_INTEGRAL_7_2.md)

## SonarQube

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| SON-001 | quality gate | Proyecto `sgoha` | — | Info | Ejecución Sonar local realizada; gate en `OK` | Control de calidad habilitado | Mantener ejecución en CI | ✅ Corregido | `reportes/sonar/SONARQUBE_LOCAL_EXECUTION.md` |
| SON-004 | seguridad/fiabilidad | Proyecto `sgoha` | — | Alta | Sonar reporta 3 vulnerabilidades y 4 bugs | Riesgo técnico acumulado | Plan de remediación por severidad | 🟠 Riesgo medio | `reportes/sonar/SONARQUBE_LOCAL_EXECUTION.md` |
| SON-002 | cobertura | `csp.service.js` | — | Media | Cobertura baja en motor CSP | Horarios con regresiones | Ampliar tests unitarios | 🟡 Observación | `coverage-summary.md` |
| SON-003 | eslint | `frontend/` | — | Baja | 3 warnings `exhaustive-deps` | Re-renders menores | Revisar dependencias hooks | 🟡 | `frontend-quality.txt` |

## Métricas

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| MET-001 | cobertura | Global | — | Media | 30,3 % líneas | Matrícula/CSP poco probados | +tests integración | 🟡 | COVERAGE_ANALYSIS.md |
| MET-002 | tests | `tests/` | — | Info | 208 tests OK | — | Mantener CI | 🟢 | `npm test` |

## OWASP

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| OW-001 | misconfig | `app.js` | — | Media | Sin helmet (histórico) | Cabeceras inseguras | `securityHeaders` | ✅ Corregido | security.middleware.js |
| OW-002 | auth | `auth.routes.js` | — | Alta | Sin rate limit login | Fuerza bruta | `loginRateLimiter` | ✅ Corregido | security.middleware.js |
| OW-003 | supply chain | `backend/qs` | — | Moderada | GHSA-q8mj-m7cp-5q26 | DoS query parse | `npm audit fix` → 6.15.2 | ✅ Corregido | backend-npm-audit.json |
| OW-004 | crypto | `api.js` | — | Media | JWT en localStorage | Robo vía XSS | Documentado; CSP | 🟠 Riesgo medio | OWASP_ANALYSIS.md |
| OW-005 | supply chain | `frontend/` | — | Alta dev | vite/form-data | Dev/CI | Monitorear audit fix | 🟡 | frontend-npm-audit.json |

## WCAG

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| WC-001 | 3.1.1 | `index.html` | — | Baja | `lang` incorrecto | Lector pantalla | `lang="es"` | ✅ Corregido | index.html |
| WC-002 | 3.3.1 | `Input.jsx` | — | Media | Errores sin ARIA | Formularios | aria-describedby | ✅ Corregido | Input.jsx |
| WC-003 | 4.1.2 | `Modal.jsx` | — | Media | Foco modal | Teclado | role dialog | ✅ Corregido | Modal.jsx |
| WC-004 | — | Pantallas admin | — | Media | Checklist manual incompleto | AA parcial | Sesión manual | 🧑‍💻 Validación humana | WCAG_MANUAL_CHECKLIST.md |

## SUS

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| SUS-001 | protocolo | Global | — | Info | Sin CSV de participantes | Sin puntuación UX | Aplicar protocolo | 🧑‍💻 Validación humana | SUS_EVALUATION_PROTOCOL.md |
| SUS-002 | tooling | `calculate-sus.js` | — | Info | — | — | Script implementado | ✅ | scripts/calculate-sus.js |

## CI/CD

| ID | Regla | Archivo | Línea | Severidad | Hallazgo | Impacto | Corrección | Estado | Evidencia |
| -- | ----- | ------- | ----: | --------- | -------- | ------- | ---------- | ------ | --------- |
| CI-001 | eslint | `ci.yml` | — | Media | Lint con continue-on-error | CI verde con errores | Eliminado continue-on-error | ✅ Corregido | ci.yml |
| CI-002 | deploy | `cd-template.yml` | — | Baja | Sin plataforma CD | Sin despliegue auto | Activar plantilla | 🔵 Plantilla profesional | CI_CD_GITHUB_ACTIONS.md |
| CI-003 | zap | `security.yml` | — | Info | ZAP requiere stack/URL | DAST | Job stack local | ⚙️ Automatizado | OWASP_ZAP_GUIDE.md |
| CI-004 | sonar | `sonar.yml` | — | Info | Sin SONAR_TOKEN | Sin gate Sonar | Configurar secretos | 🔵 Requiere credencial | sonar.yml |
