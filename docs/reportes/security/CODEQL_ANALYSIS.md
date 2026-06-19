# Análisis CodeQL — SGOHA

> **Workflow:** [`.github/workflows/codeql.yml`](../../../.github/workflows/codeql.yml)

## Configuración

| Parámetro | Valor |
| --------- | ----- |
| Lenguaje | `javascript-typescript` |
| Consultas | `security-extended` |
| Disparadores | `push`/`pull_request` en `main`, cron semanal (lunes 06:00 UTC), `workflow_dispatch` |
| Permisos | `contents: read`, `security-events: write` |
| Alcance | Monorepo (autobuild detecta JS en frontend, backend y raíz) |

## Resultados en entorno local

CodeQL **requiere ejecución en GitHub Actions** o CLI con base de datos compilada. En el repositorio local no se generan alertas sin ejecutar el analizador.

**Clasificación:** 🔵 Requiere ejecución en plataforma externa (pestaña *Security → Code scanning*).

## Interpretación esperada para SGOHA

| Tipo de alerta CodeQL | Relevancia SGOHA | Acción |
| --------------------- | ---------------- | ------ |
| `js/hardcoded-credentials` | Crítica si aparece | Rotar secreto; usar variables de entorno |
| `js/insufficient-password-hash` | Media | Verificar bcrypt en `User.js` |
| `js/xss-through-dom` | Alta en React | Revisar renderizado dinámico |
| `js/path-injection` | Baja | Validar rutas de archivos si se añaden uploads |

## Procedimiento de revisión

1. Abrir **GitHub → Security → Code scanning alerts**.
2. Filtrar por rama `main` y severidad *High/Critical*.
3. Registrar cada alerta en [`MATRIZ_HALLAZGOS.md`](../../plantillas/MATRIZ_HALLAZGOS.md) sección CI/CD.
4. Corregir o documentar falso positivo con comentario en PR.

## Relación con OWASP

CodeQL complementa el análisis manual de [`OWASP_ANALYSIS.md`](./OWASP_ANALYSIS.md) cubriendo patrones estáticos en JavaScript (inyección, credenciales, flujo de datos tainted).

## Evidencia

| Código | Descripción | Estado |
| ------ | ----------- | ------ |
| CQL-01 | Captura alertas GitHub Security | 📸 Evidencia externa requerida |
| CQL-02 | Log workflow `CodeQL` en Actions | ⚙️ Automatizado |
