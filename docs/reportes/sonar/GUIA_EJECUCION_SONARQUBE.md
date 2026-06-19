# Guía de ejecución SonarQube — SGOHA

> Reproducible en macOS/Linux · SonarQube Community local o SonarCloud

## 1. Levantar SonarQube local

```bash
docker compose -f docker-compose.sonar.yml up -d
```

Esperar ~60 s y comprobar: http://localhost:9000 (usuario inicial `admin` / `admin` — cambiar contraseña).

## 2. Entrar al panel

1. Abrir http://localhost:9000
2. **Projects → Create project → Manually**
3. Project key: `sgoha` · Display name: `SGOHA`

## 3. Generar token

**My Account → Security → Generate Token** (tipo *User*, nombre `sgoha-scanner`). Guardar el token de forma segura.

## 4. Instalar SonarScanner

**macOS (Homebrew):**

```bash
brew install sonar-scanner
```

**Alternativa:** descargar desde [SonarScanner CLI](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/).

## 5. Preparar cobertura

```bash
cd /ruta/al/repositorio
npm ci
cd frontend && npm ci && cd ..
cd backend && npm ci && cd ..
npm run test:coverage
```

## 6. Ejecutar análisis

**SonarQube local:**

```bash
export SONAR_TOKEN=<tu-token>
sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONAR_TOKEN
```

**SonarCloud** (requiere secretos `SONAR_TOKEN`, `SONAR_ORGANIZATION` en GitHub):

```bash
sonar-scanner \
  -Dsonar.organization=<org> \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.token=$SONAR_TOKEN
```

## 7. Revisar Quality Gate

En el panel: **Project → Quality Gate**. Capturar:

| Código evidencia | Archivo sugerido |
| ---------------- | ---------------- |
| SON-01 | `docs/evidencias/sonarqube/01-quality-gate.png` |
| SON-02 | `docs/evidencias/sonarqube/02-issues.png` |
| SON-03 | `docs/evidencias/sonarqube/03-coverage.png` |

## 8. CI automatizado

Workflow: [`.github/workflows/sonar.yml`](../../../.github/workflows/sonar.yml) — se activa cuando `SONAR_TOKEN` está configurado en GitHub Secrets.

## 9. Configuración del proyecto

Archivo: [`sonar-project.properties`](../../../sonar-project.properties)

- Fuentes: `frontend/src`, `backend/src`
- Pruebas: `tests/`, `cypress/`
- LCOV: `tests/reports/coverage/*/lcov.info`

## 10. Actualizar informe

Tras cada análisis, registrar en [`INFORME_TECNICO_INTEGRAL_7_2.md`](../../INFORME_TECNICO_INTEGRAL_7_2.md) las métricas del panel y el commit evaluado.
