# Backend SGOHA (MERN)

Arquitectura por capas: **routes → controllers → services → models** (Mongoose).

## Estructura

```
src/
  server.js, app.js
  config/db.js, env.js
  models/
  routes/
  controllers/
  services/   (incluye csp.service.js)
  middlewares/
  utils/
  seed/seed.js
```

Código legado en `routes/`, `db/`, `services/scheduler.js` (driver nativo MongoDB) — ya no es el punto de entrada.

## Configuración

```bash
cp .env.example .env
# Si Docker usa auth (ej. dev/dev):
# MONGO_URI=mongodb://dev:dev@127.0.0.1:27017/HorariosAcademicos?authSource=admin
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000/api`  
Health: `GET /api/health`  
Login seed: `admin@sgoha.local` / `admin123`
