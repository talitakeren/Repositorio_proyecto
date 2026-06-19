# Guía OWASP ZAP — SGOHA

## Objetivo

Ejecutar un escaneo **baseline** contra la interfaz web de SGOHA para detectar cabeceras, cookies, XSS reflejado y configuraciones inseguras.

## GitHub Actions

Workflow: [`.github/workflows/security.yml`](../../../.github/workflows/security.yml)

| Job | Cuándo | URL analizada |
| --- | ------ | ------------- |
| `zap-baseline-stack` | Sin `TARGET_URL` ni variable `ZAP_TARGET_URL` | Stack levantado en el runner (`:5173/login`) |
| `zap-baseline-external` | Con `target_url` (dispatch) o `vars.ZAP_TARGET_URL` | Staging/producción configurada |

### Artefactos

- `zap-report-stack` o `zap-report-external`
- `report_html.html`, `report_json.json`

Guardar copias en `docs/evidencias/owasp/` con prefijo `ZAP-01`, `ZAP-02`.

## Ejecución local (Docker)

```bash
# Terminal 1 — MongoDB
docker run -d --name sgoha-mongo -p 27017:27017 mongo:7

# Terminal 2 — Backend
cd backend && cp .env.example .env
npm ci && npm run seed && npm start

# Terminal 3 — Frontend
cd frontend && npm ci && npm run build && npm run preview -- --port 5173

# Terminal 4 — ZAP baseline
docker run --rm -v $(pwd):/zap/wrk:rw \
  -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://host.docker.internal:5173/login -r zap-report.html
```

En Linux usar `--network host` o la IP del host en lugar de `host.docker.internal`.

## Interpretación

| Hallazgo ZAP típico | Severidad habitual | Acción SGOHA |
| ------------------- | ------------------ | ------------ |
| Cabecera `X-Frame-Options` | Info/Baja | Cubierto por `helmet` en backend |
| CSP ausente en estáticos | Media | Vite preview — CSP en producción con reverse proxy |
| Cookie sin `HttpOnly` | Media | JWT en `localStorage` — riesgo XSS documentado |
| Tiempo de respuesta | Info | No bloqueante |

## Limitaciones del baseline

- No sustituye prueba de penetración manual.
- El stack en CI usa datos seed mínimos; rutas autenticadas requieren spider con sesión o URL de staging con credenciales de prueba.
