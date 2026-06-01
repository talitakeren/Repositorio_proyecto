# Impactos Ambientales — SGOHA

## Contexto

El desarrollo, despliegue y uso de aplicaciones web generan un consumo real de energía eléctrica y recursos computacionales. Aunque una aplicación como SGOHA opera a escala universitaria, sus patrones de diseño tienen un impacto directo en la eficiencia energética del sistema.

---

## Impactos identificados

### 1. Transferencia de datos excesiva por ausencia de paginación

**Descripción:** Los endpoints de listado (`GET /api/students`, `GET /api/teachers`, `GET /api/courses`) devuelven todos los documentos de la colección en una sola respuesta, sin límite ni paginación.

**Impacto ambiental:** Cada petición transfiere más datos de los necesarios para renderizar la vista. Esto implica mayor procesamiento en el servidor, mayor ancho de banda consumido y mayor carga de trabajo en el cliente.

**Relación con el proyecto:** El módulo de estudiantes y docentes puede contener decenas o cientos de registros en un entorno real universitario. Devolver todos sin filtro es ineficiente.

---

### 2. Consultas MongoDB sin proyección de campos

**Descripción:** Sin el uso de `.select()`, MongoDB devuelve todos los campos de cada documento, incluyendo campos que el cliente nunca utiliza en ciertas vistas.

**Impacto ambiental:** Se incrementa el volumen de datos transferidos entre la base de datos y el servidor, y entre el servidor y el cliente. Esto se traduce en mayor consumo de memoria RAM y CPU.

**Relación con el proyecto:** En consultas de listado donde solo se necesita nombre, código y estado de un curso o docente, devolver el documento completo es innecesario.

---

### 3. Carga del bundle JavaScript completo sin lazy loading de rutas

**Descripción:** Sin lazy loading, Vite agrupa todas las páginas en un único bundle que se descarga completo al primer acceso, independientemente de qué ruta visita el usuario.

**Impacto ambiental:** Un usuario que accede al login descarga código de módulos que nunca usará en esa sesión. Esto desperdicia ancho de banda y aumenta el tiempo de procesamiento del navegador.

---

### 4. Re-renders innecesarios en componentes React

**Descripción:** Sin `useMemo` y `useCallback`, los componentes recalculan valores derivados y recrean funciones en cada renderizado, aunque los datos no hayan cambiado.

**Impacto ambiental:** Mayor uso de CPU en el dispositivo del usuario, lo que impacta directamente en el consumo de batería en dispositivos móviles y laptops.

---

### 5. Respuestas HTTP sin compresión

**Descripción:** Sin el middleware `compression` en Express, las respuestas JSON se envían en texto plano sin comprimir.

**Impacto ambiental:** Las respuestas sin comprimir pueden ser 3 a 5 veces más grandes que sus equivalentes con gzip o brotli. Implica mayor ancho de banda y mayor energía consumida en la red.

---

### 6. Múltiples peticiones HTTP en la carga inicial del dashboard

**Descripción:** El dashboard realiza varias peticiones independientes al cargar (resumen, estado del sistema, actividad reciente).

**Impacto ambiental:** Cada petición HTTP implica overhead de conexión TCP, cabeceras y procesamiento en el servidor. Más peticiones equivalen a más ciclos de CPU y más energía consumida.

---

### 7. Documentos MongoDB completos en operaciones de solo lectura

**Descripción:** Algunas consultas no usan `.lean()`, generando objetos Mongoose completos aunque la operación solo requiera leer datos.

**Impacto ambiental:** Los objetos Mongoose consumen más memoria que objetos JavaScript planos. En listados masivos esto incrementa el uso de heap del proceso Node.js.

---

### 8. Ausencia de caché en respuestas de datos estáticos

**Descripción:** Datos que cambian poco (bloques horarios, tipos de aula) se consultan a MongoDB en cada petición sin ningún mecanismo de caché.

**Impacto ambiental:** Cada petición genera una consulta innecesaria a MongoDB, incrementando la carga de I/O y la energía del servidor de base de datos.

---

## Resumen

| # | Impacto | Componente afectado | Severidad |
|---|---------|---------------------|-----------|
| 1 | Transferencia excesiva sin paginación | API Backend | Alta |
| 2 | Consultas sin proyección de campos | MongoDB / Servicios | Media |
| 3 | Bundle sin lazy loading de rutas | Frontend React | Media |
| 4 | Re-renders innecesarios | Componentes React | Baja-Media |
| 5 | Respuestas HTTP sin compresión | Express | Alta |
| 6 | Múltiples peticiones en dashboard | Frontend / API | Baja |
| 7 | Objetos Mongoose en lugar de plain objects | Backend | Baja |
| 8 | Sin caché en datos estáticos | Backend / MongoDB | Media |
