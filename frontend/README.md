# Frontend SGOHA

React + Vite con layout modular (sidebar, rutas protegidas, servicios axios).

## Configuración

```bash
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL=http://localhost:5000/api`

## Login (después de `npm run seed` en backend)

- Email: `admin@sgoha.local`
- Contraseña: `admin123`

## Estructura

- `src/routes/AppRouter.jsx` — rutas principales
- `src/pages/` — pantallas del PMV
- `src/services/` — llamadas al API
- `src/components/availability/AvailabilityGrid.jsx` — grilla docente

Las páginas antiguas en `src/pages/CourseList.jsx` etc. quedan como referencia; el router usa las nuevas carpetas.
