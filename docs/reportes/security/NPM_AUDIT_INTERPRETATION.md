# Interpretación npm audit — SGOHA

> **Fecha:** 2026-06-17 · **Evidencias:** [`frontend-npm-audit.json`](./frontend-npm-audit.json), [`backend-npm-audit.json`](./backend-npm-audit.json)

## Resumen ejecutivo

| Paquete | Ámbito | Severidad | Estado |
| ------- | ------ | --------- | ------ |
| `qs` (backend) | Transitiva vía `express` → `body-parser` | Moderada | ✅ Corregida (`6.15.2`) |
| `brace-expansion` (frontend) | Transitiva (dev) | Moderada | 🟡 `npm audit fix` disponible |
| `form-data` (frontend) | Transitiva | Alta | 🟠 Revisar cadena padre |
| `react-router` / `react-router-dom` | Directa | Baja (GHSA CSRF) | 🟡 Actualizar cuando haya parche estable |
| `vite` (frontend dev) | Directa dev | Alta (Windows) | 🔵 Riesgo bajo en Linux/macOS CI |

---

## Backend — `qs` (GHSA-q8mj-m7cp-5q26)

| Campo | Valor |
| ----- | ----- |
| **Paquete** | `qs@6.15.1` → corregido a `6.15.2` |
| **Dependencia** | Transitiva: `express@5.2.1` → `body-parser` → `qs` |
| **CVE/GHSA** | [GHSA-q8mj-m7cp-5q26](https://github.com/advisories/GHSA-q8mj-m7cp-5q26) |
| **Severidad** | Moderada (CVSS 5.3) |
| **Alcance SGOHA** | DoS en `qs.stringify` con arrays comma-format y `encodeValuesOnly`; Express usa `qs` para parsear query strings |
| **Explotación** | Requiere peticiones malformadas; impacto disponibilidad, no confidencialidad |
| **Corrección** | `npm audit fix` (sin `--force`) en `backend/` |
| **Pruebas post-fix** | `npm test` raíz — **208 pruebas OK** |
| **Decisión** | ✅ Aplicar fix compatible; documentado en commit de dependencias |

```bash
cd backend && npm ls qs
# qs@6.15.2 deduped
```

---

## Frontend — hallazgos

### `brace-expansion` (moderada)

- **Tipo:** transitiva (herramientas de empaquetado/lint).
- **Riesgo SGOHA:** Bajo en runtime de producción (no se incluye en bundle de usuario).
- **Acción:** Ejecutar `npm audit fix` en `frontend/` y validar `npm run build`.

### `form-data` (alta — CRLF injection)

- **Tipo:** transitiva (probablemente axios o dependencia de prueba).
- **Riesgo:** Bajo si el frontend no construye multipart con nombres no escapados desde entrada de usuario.
- **Acción:** Actualizar cadena cuando `npm audit fix` resuelva sin breaking changes; re-ejecutar pruebas.

### `react-router` (GHSA-84g9-w2xq-vcv6)

- **Tipo:** directa (`react-router-dom@7.15.0`).
- **Escenario:** CSRF vía peticiones document PUT/PATCH/DELETE en navegadores legacy.
- **Control SGOHA:** API usa JWT en cabecera `Authorization`, no cookies de sesión; mitigación parcial.
- **Acción:** Monitorear parche en 7.x; actualizar y ejecutar suite E2E.

### `vite` (alta — entorno Windows dev)

- **Tipo:** devDependency.
- **Riesgo en CI (ubuntu-latest):** Limitado; hallazgos referidos a rutas UNC Windows.
- **Acción:** Mantener Vite actualizado; no afecta despliegue estático en producción.

---

## Procedimiento de actualización segura

```bash
# Backend (ejecutado)
cd backend && npm audit fix && cd .. && npm test

# Frontend (recomendado antes de release)
cd frontend && npm audit fix
npm run lint && npm run build && cd .. && npm test
```

> ⚠️ **No usar** `npm audit fix --force` — puede introducir incompatibilidades en Express 5 / React 19.
