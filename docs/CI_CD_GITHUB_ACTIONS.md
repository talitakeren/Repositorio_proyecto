# CI/CD con GitHub Actions — SGOHA

Documentación de pipelines, secretos y operación del flujo de integración y despliegue continuo.

## Workflows creados

| Archivo | Propósito | Activación |
|---------|-----------|------------|
| `.github/workflows/ci.yml` | Integración continua | push/PR a `main`/`develop`, manual |
| `.github/workflows/codeql.yml` | Análisis estático de seguridad (GitHub) | push/PR `main`, semanal lunes 06:00 UTC |
| `.github/workflows/sonar.yml` | SonarCloud o SonarQube self-hosted | push/PR `main`, manual (requiere token) |
| `.github/workflows/security.yml` | npm audit, escaneo secretos, ZAP opcional | push/PR `main`, semanal, manual |
| `.github/workflows/cd-template.yml` | Plantilla CD (inactiva) | Solo manual — sin despliegue real |
| `.github/dependabot.yml` | Actualizaciones semanales de dependencias | Automático |

## Jobs del pipeline CI (`ci.yml`)

1. **frontend-quality** — `npm ci`, `lint`, `build` en `frontend/`
2. **backend-quality** — `npm ci`, `lint` (verificación sintaxis) en `backend/`
3. **tests** — `npm test` + `npm run test:coverage` en raíz; artifact `coverage-report`
4. **dependency-audit** — `npm audit --audit-level=high`; artifact `npm-audit-reports`
5. **accessibility** — build + preview frontend + `npm run test:a11y` (Cypress + axe)

## Workflow Security (`security.yml`)

| Job | Descripción |
| --- | ----------- |
| `npm-audit` | Ejecuta `scripts/run-security-audit.sh`; sube JSON |
| `secret-scan` | `git grep` patrones JWT/MONGO/password |
| `zap-baseline-stack` | Mongo + backend + preview + ZAP en `:5173/login` (por defecto) |
| `zap-baseline-external` | ZAP contra `TARGET_URL` o variable `ZAP_TARGET_URL` |

Ver [`reportes/security/OWASP_ZAP_GUIDE.md`](reportes/security/OWASP_ZAP_GUIDE.md).

## Secretos requeridos

### SonarCloud (opción A)

| Secreto | Descripción |
|---------|-------------|
| `SONAR_TOKEN` | Token de SonarCloud |
| `SONAR_ORGANIZATION` | Clave de organización SonarCloud |

### SonarQube self-hosted (opción B)

| Secreto | Descripción |
|---------|-------------|
| `SONAR_TOKEN` | Token de usuario SonarQube |
| `SONAR_HOST_URL` | URL del servidor (ej. `http://localhost:9000` o URL interna) |

Si **ningún** secreto Sonar está configurado, el workflow `sonar.yml` omite el análisis con aviso.

### Despliegue continuo (futuro — `cd.yml`)

| Secreto | Plataforma |
|---------|------------|
| `VERCEL_TOKEN` | Frontend en Vercel |
| `VERCEL_ORG_ID` | Vercel |
| `VERCEL_PROJECT_ID` | Vercel |
| `RENDER_DEPLOY_HOOK_URL` | Backend en Render |

**Estado actual:** no existe `vercel.json` ni `render.yaml`. Usar `cd-template.yml` como referencia.

### OWASP ZAP (opcional)

| Variable / input | Descripción |
|------------------|-------------|
| `ZAP_TARGET_URL` (repository variable) | URL pública de staging |
| `target_url` (workflow_dispatch input) | URL para escaneo manual |

## Configurar secretos en GitHub

1. Repositorio → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** para cada valor
3. Nunca commitear secretos en el código

## Ejecución manual (`workflow_dispatch`)

1. Pestaña **Actions** en GitHub
2. Seleccionar workflow (ej. **CI SGOHA**)
3. **Run workflow** → elegir rama

## Interpretar un pipeline fallido

| Job fallido | Acción |
|-------------|--------|
| frontend-quality | Revisar `npm run lint` y `npm run build` localmente en `frontend/` |
| backend-quality | Revisar `npm run lint` en `backend/` |
| tests | Ejecutar `npm test` en raíz; revisar logs de Jest |
| dependency-audit | Revisar artifact `npm-audit-reports`; evaluar CVEs high/critical |
| accessibility | Revisar artifact `a11y-screenshots`; ejecutar `npm run test:a11y` con frontend en :5173 |

## Descargar artifacts

1. Actions → ejecución del workflow → sección **Artifacts**
2. Descargar `coverage-report`, `npm-audit-reports`, etc.

## Cobertura local (para Sonar)

```bash
npm run test:coverage
npm run coverage:open
# HTML: tests/reports/coverage/html/index.html
```

## SonarQube local (Docker)

```bash
docker compose -f docker-compose.sonar.yml up -d
# http://localhost:9000 — cambiar contraseña admin
npm run test:coverage
sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=<TOKEN>
```

## Estrategia de ramas

| Rama | Uso |
|------|-----|
| `main` | Producción — CI obligatorio |
| `develop` | Integración — CI en push/PR |
| `feature/*` | Desarrollo — PR hacia `develop` o `main` |

### Protección recomendada de `main`

- Pull request obligatorio antes de merge
- Status checks requeridos: **CI SGOHA**, **CodeQL**
- Revisión mínima: 1 aprobación
- Bloquear force push
- Conversaciones resueltas antes de merge
- Quality Gate Sonar cuando esté activo

## Desactivar CD temporalmente

El CD no está activo (`cd-template.yml`). Cuando se active `cd.yml`, deshabilitar con:

- Eliminar secretos de despliegue, o
- Deshabilitar el workflow en GitHub Actions

## Buenas prácticas

- No usar `npm audit fix --force` en CI
- No imprimir secretos en logs (`::add-mask::` si es necesario)
- Rotar `JWT_SECRET` y tokens Sonar periódicamente
- Mantener `.env` fuera del repositorio (ya en `.gitignore`)
