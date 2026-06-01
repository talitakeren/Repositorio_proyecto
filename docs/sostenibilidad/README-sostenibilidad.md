# Sostenibilidad y Eficiencia Web — SGOHA

## Propósito

Este documento resume las acciones tomadas en el proyecto SGOHA para reducir su impacto ambiental, mejorar su eficiencia y adoptar prácticas de desarrollo web responsable, en el marco del taller de Taller de Proyectos 2 – Ingeniería de Sistemas e Informática.

---

## ¿Por qué importa la sostenibilidad en software?

Cada petición HTTP, cada consulta a la base de datos y cada renderizado en el navegador consume energía eléctrica. A escala de miles de usuarios, las decisiones de diseño de una aplicación tienen un impacto acumulado real en el consumo energético de servidores, redes y dispositivos de usuario final.

Adoptar buenas prácticas de eficiencia no solo reduce ese impacto, sino que también mejora el rendimiento percibido por el usuario y reduce los costos operativos del sistema.

---

## Documentos de esta sección

| Documento | Contenido |
|-----------|-----------|
| [`impactos-ambientales.md`](sostenibilidad/impactos-ambientales.md) | 8 impactos ambientales identificados en el proyecto, con justificación técnica |
| [`oportunidades-mejora.md`](sostenibilidad/oportunidades-mejora.md) | 4 oportunidades de mejora con componentes específicos y criterios de sostenibilidad |
| [`mejoras-implementadas.md`](sostenibilidad/mejoras-implementadas.md) | Detalle técnico de cada mejora implementada con código antes/después |
| [`capturas/`](sostenibilidad/capturas/) | Evidencias visuales (Lighthouse) del antes y después de las mejoras |

---

## Resumen de lo implementado

### Backend (Express + MongoDB)

**Compresión HTTP**
Se agregó el middleware `compression` en `app.js`. Todas las respuestas JSON ahora se comprimen automáticamente con gzip, reduciendo su tamaño en promedio un 60-70%.

**Consultas optimizadas con `.lean()` y `.select()`**
En los servicios de listado se usa `.lean()` para obtener objetos JavaScript planos (menor memoria) y `.select()` para proyectar únicamente los campos necesarios (menor transferencia de datos desde MongoDB).

**`.limit()` en consultas del dashboard**
El dashboard limita explícitamente el número de registros por consulta (5 horarios, 6 matrículas, 4 estudiantes recientes), evitando traer el historial completo.

**Índices en modelos MongoDB**
Los modelos `Enrollment` y `TimeSlot` definen índices compuestos para acelerar las consultas de búsqueda y evitar recorridos completos de colección.

### Frontend (React)

**`useMemo` y `useCallback`**
Los componentes `StudentForm`, `SchedulesPage` y el hook `useMobileNav` utilizan `useMemo` para memorizar valores derivados y `useCallback` para estabilizar referencias a funciones, evitando renders y recálculos innecesarios.

---

## Evidencias de validación

Las capturas de Lighthouse y métricas de rendimiento se encuentran en la carpeta [`capturas/`](sostenibilidad/capturas/).

Para reproducir la validación:

```bash
# 1. Levantar el proyecto
cd backend && npm run dev
cd frontend && npm run dev

# 2. Abrir Chrome → DevTools → Lighthouse
# Generar reporte en http://localhost:5173
# Guardar captura del reporte generado
```

---

## Contribución a la sostenibilidad

| Técnica | Beneficio ambiental |
|---------|---------------------|
| Compresión gzip | Reduce ancho de banda y energía de red |
| `.lean()` en MongoDB | Reduce consumo de RAM del servidor |
| `.select()` en consultas | Reduce I/O de la base de datos |
| `.limit()` en listados | Evita transferencia de datos innecesaria |
| Índices MongoDB | Reduce CPU e I/O en consultas frecuentes |
| `useMemo`/`useCallback` | Reduce CPU del dispositivo del usuario |
