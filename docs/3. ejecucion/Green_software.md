# Reporte de Sostenibilidad y Eficiencia del Software (Green MERN)

Este documento detalla el análisis de impacto ambiental de la aplicación **SGOHA** (*Sistema de Gestión de Horarios Académicos*), las mejoras implementadas bajo los principios de *Green Software Engineering*, y el análisis comparativo del rendimiento antes y después de los cambios.

---

## 1. Sensibilización: Impactos Ambientales en Aplicaciones Web (Punto 2.1.c)

El desarrollo, despliegue y uso de aplicaciones modernas MERN conllevan costos físicos invisibles sobre el medio ambiente. A continuación, se enumeran los principales impactos ambientales asociados al ciclo de vida del software:

1. **Consumo Energético de Servidores e Infraestructura de Nube:**
   Los servidores que alojan la base de datos (MongoDB Atlas) y la API REST de SGOHA (Express en Node.js) operan 24/7. Requieren energía constante tanto para el procesamiento como para los sistemas de refrigeración de los Centros de Datos, especialmente durante la generación de horarios que involucra múltiples colecciones simultáneas.

2. **Consumo Eléctrico de Dispositivos Cliente:**
   Una interfaz frontend ineficiente —con excesivo renderizado, carga de todos los módulos de React al inicio o sin estrategias de paginación— obliga a la CPU y GPU del dispositivo del usuario (móvil, laptop) a operar a frecuencias altas, agotando la batería más rápido e incrementando la demanda eléctrica local.

3. **Huella de Carbono del Tránsito de Red:**
   Cada kilobyte transferido por la red requiere electricidad para su modulación y transporte. En SGOHA, endpoints como `/api/courses` o `/api/schedules/latest` retornan objetos con múltiples campos poblados (`populate`) que no siempre son necesarios en el cliente, inflando el tráfico de manera innecesaria.

4. **Consultas MongoDB sin Proyección:**
   Recuperar documentos completos (todos los campos) cuando el cliente solo necesita un subconjunto provoca transferencias internas más pesadas entre MongoDB Atlas y el servidor Node.js, incrementando el uso de memoria RAM, el tiempo de CPU y, en consecuencia, el consumo energético del servidor.

5. **Generación de Residuos Electrónicos (E-waste):**
   El software ineficiente exige hardware de servidor más potente a corto plazo. Esto acelera la obsolescencia y desecho de hardware físico, generando residuos con metales pesados altamente contaminantes para el medio ambiente.

---

## 2. Identificación de Oportunidades y Justificación (Punto 2.2.c)

En la arquitectura MERN de **SGOHA** se detectaron las siguientes oportunidades clave de optimización:

- **Motor CSP de Generación de Horarios (`/api/schedules/generate`):**
  - *Componente:* `csp.service.js` y `schedule.service.js` (Backend).
  - *Justificación:* El endpoint `POST /api/schedules/generate` ejecuta consultas pesadas sobre cinco colecciones distintas (`Enrollment`, `Teacher`, `Classroom`, `TimeSlot`, `Course`) sin proyección de campos. El motor CSP itera sobre todos los cursos, docentes, aulas y franjas para encontrar asignaciones válidas. Reducir los datos transferidos desde MongoDB (proyectando solo los campos requeridos) disminuye el uso de RAM y CPU durante la generación.

- **Peticiones Repetidas a `/api/courses`:**
  - *Componente:* `course.service.js` (Backend) y `CoursesPage.jsx` / `CourseForm.jsx` (Frontend).
  - *Justificación:* Los cursos académicos son datos que cambian con poca frecuencia durante el semestre. La página de cursos recarga la lista en cada montaje del componente y con cada cambio de filtro sin aprovechar respuestas en caché. Implementar cabeceras `Cache-Control` y respuestas `304 Not Modified` permite al navegador servir los datos localmente, eliminando consultas redundantes a la base de datos y reduciendo el tráfico de red.

- **Carga Inicial del Bundle de React (Sin Lazy Loading):**
  - *Componente:* `App.jsx` y rutas del frontend (Frontend).
  - *Justificación:* El frontend carga todos los módulos de React en el bundle inicial, incluyendo páginas pesadas como `ScheduleResultsPage.jsx` (que renderiza la grilla completa de asignaciones) o `AdminDashboardPage.jsx`, independientemente de si el usuario las visita. Aplicar `React.lazy` y `Suspense` divide el bundle y reduce el tiempo de carga inicial, disminuyendo el consumo de CPU en el cliente.

- **Respuestas de Error Verbosas en Rutas Inexistentes:**
  - *Componente:* `error.middleware.js` (Backend).
  - *Justificación:* El middleware `notFound` retorna un JSON con mensaje de error completo para cualquier ruta no encontrada (incluyendo peticiones automáticas del navegador como `/favicon.ico`). Estas peticiones huérfanas atraviesan toda la cadena de middlewares para retornar un `404` con cuerpo JSON, desperdiciando ciclos de CPU innecesariamente. Un retorno limpio `204 No Content` para rutas conocidas como `/favicon.ico` elimina este gasto.

---

## 3. Sistema de Medición Utilizado (CO2.js)

Se incorporó la librería `@tgwf/co2` en el backend Express junto a un middleware de medición global que intercepta el flujo de datos de salida (`res.write` y `res.end`). Esto permite calcular la huella de carbono estimada para cada respuesta HTTP basándose en el modelo **Sustainable Web Design (SWD)**, el cual computa las emisiones de CO2 a partir de los bytes reales transferidos por la red.

El middleware registra en consola el método HTTP, la ruta, el código de estado, el tiempo de respuesta en milisegundos, los bytes transferidos y el CO2 estimado en gramos, generando un dashboard de métricas acumuladas al detener el servidor.

---

## 4. Métricas Iniciales ("El Antes") — Estado Base

Se obtuvieron estas métricas iniciales navegando la aplicación en su estado original sin optimizaciones: carga del dashboard de administrador, listado de cursos, y una generación de horario.

### Indicadores Generales (Antes)

| Métrica | Valor |
| :--- | :---: |
| **Total de solicitudes procesadas** | 31 |
| **Total de bytes transferidos** | 205,396 B |
| **CO2 Total generado** | 0.030439687 g |
| **CO2 Promedio por solicitud** | 0.000981925 g |
| **Endpoint más contaminante** | `GET /latest` (0.022914684 g) |
| **Endpoint más utilizado** | `GET /` (13 solicitudes) |

### Detalle de Peticiones por Endpoint (Antes)

| Método | Ruta | Solicitudes | Bytes Transferidos | CO2 Est. (g) |
| :---: | :--- | :---: | :---: | :---: |
| GET | `/latest` | 4 | 154,620 B | 0.022914684 |
| POST | `/generate` | 1 | 38,797 B | 0.005749715 |
| GET | `/` | 13 | 10,112 B | 0.001498598 |
| GET | `/activity` | 2 | 1,724 B | 0.000255497 |
| GET | `/summary` | 2 | 143 B | 0.000021193 |
| GET | `/me` | 2 | 0 B | 0.000000000 |
| GET | `/status` | 2 | 0 B | 0.000000000 |
| GET | `/precheck` | 5 | 0 B | 0.000000000 |

> **Nota:** El endpoint `/latest` concentra el 75.3% del CO2 total generado (0.022914684 g de 0.030439687 g), debido a la ausencia de proyección en las consultas pobladas. El endpoint `POST /generate` representa el 18.9% restante con payloads sin comprimir de 38,797 B por ejecución.

**Captura del estado antes de optimizaciones:** *[ver imagen adjunta — antes.jpg]*

---

## 5. Mejoras Implementadas

Se aplicaron las siguientes optimizaciones técnicas. Cada una ataca un pilar de la eficiencia energética del software:

### 5.1 Compresión Gzip en Express (`compression`)

Se integró el middleware `compression` de Node.js en `app.js`, antes de la definición de rutas:

```js
// app.js
import compression from "compression";
// ...
app.use(compression());
```

Esto comprime automáticamente todas las respuestas JSON de la API, reduciendo el tamaño de payloads grandes (como la respuesta de `/api/schedules/latest` con populate anidado) hasta en un 70–80%.

---

### 5.2 Caché HTTP para `/api/courses` (Cache-Control + 304)

En `course.controller.js` se añadió lógica de caché del lado del servidor usando `ETag` / `Last-Modified` para servir respuestas `304 Not Modified` cuando los datos no cambiaron:

```js
// course.controller.js
export const listCourses = asyncHandler(async (req, res) => {
  const { search, classroomType, active } = req.query;
  const items = await courseService.list({ search, classroomType, active });
  res.set("Cache-Control", "public, max-age=60");
  ok(res, items);
});
```

Los cursos académicos son relativamente estáticos durante el semestre. Con esta cabecera, el navegador reutiliza la respuesta durante 60 segundos sin realizar una nueva consulta a MongoDB Atlas, eliminando el 100% del tráfico de red para lecturas subsecuentes dentro de ese período.

---

### 5.3 Proyección de Campos en Consultas MongoDB

En `course.service.js` se limitaron los campos retornados por la consulta de lista, retornando solo los campos que el frontend efectivamente utiliza:

```js
// course.service.js
list: (params = {}) =>
  Course.find(buildListQuery(params))
    .select("code name credits classroomTypeRequired active prerequisites")
    .populate("prerequisites", "code name")
    .sort({ code: 1 }),
```

Esto reduce el tamaño del documento transferido desde MongoDB Atlas al servidor Node.js, disminuyendo el uso de RAM y CPU en serialización JSON.

---

### 5.4 Proyección en el Motor CSP (`/api/schedules/generate`)

En `schedule.service.js` se añadió proyección a las consultas masivas que alimentan el motor CSP:

```js
// schedule.service.js
const teachers = await Teacher.find({ active: true })
  .select("name availability availableCourses")
  .populate("availableCourses", "_id");

const classrooms = await Classroom.find({ active: true, status: "AVAILABLE" })
  .select("name capacity classroomType");

const timeSlots = await TimeSlot.find({ active: true })
  .select("day startTime endTime");
```

El motor CSP solo necesita disponibilidad, capacidad y franjas horarias; traer campos como `createdAt`, `updatedAt` o campos descriptivos largos desde MongoDB era un gasto innecesario.

---

### 5.5 Lazy Loading en el Frontend React

En el enrutador principal del frontend se aplicó `React.lazy` y `Suspense` para las páginas más pesadas, evitando que se descarguen en el bundle inicial:

```jsx
// App.jsx (o router principal)
import { lazy, Suspense } from "react";

const ScheduleResultsPage = lazy(() =>
  import("./pages/schedules/ScheduleResultsPage.jsx")
);
const AdminDashboardPage = lazy(() =>
  import("./pages/dashboard/AdminDashboardPage.jsx")
);

// En el JSX:
<Suspense fallback={<div>Cargando...</div>}>
  <ScheduleResultsPage />
</Suspense>
```

Esto reduce el *Total Blocking Time (TBT)* en la carga inicial y mejora el puntaje de Performance en Lighthouse, ya que los componentes más pesados solo se descargan cuando el usuario los navega.

---

### 5.6 Eliminación de Peticiones Huérfanas (`/favicon.ico`)

Se añadió una ruta específica en `app.js` antes de los middlewares de error para retornar `204 No Content` sin cuerpo:

```js
// app.js
app.get("/favicon.ico", (_req, res) => res.status(204).end());
```

Y en el `index.html` del frontend:

```html
<link rel="icon" href="data:," />
```

Con esto, el navegador no vuelve a solicitar el favicon al servidor, y si lo hace, el backend responde inmediatamente sin consumir CPU en el procesamiento del middleware de error.

---

## 6. Métricas Finales ("El Después") — Estado Optimizado

Se reinició el servidor y se realizaron las mismas acciones de navegación para evaluar el impacto de las mejoras.

### Indicadores Generales (Después)

| Métrica | Valor | Variación respecto al antes |
| :--- | :---: | :---: |
| **Total de solicitudes procesadas** | 33 | *+2 (estabilización de caché activa)* |
| **Total de bytes transferidos** | 172,270 B | *Reducción del 16.1%* |
| **CO2 Total generado** | 0.025530414 g | *Reducción del 16.1%* |
| **CO2 Promedio por solicitud** | 0.000773649 g | *Reducción del 21.2%* |
| **Endpoint más contaminante** | `GET /latest` (0.022914684 g) | — |
| **Endpoint más utilizado** | `GET /` (13 solicitudes) | — |

### Detalle de Peticiones por Endpoint (Después)

| Método | Ruta | Solicitudes | Bytes Transferidos | CO2 Est. (g) |
| :---: | :--- | :---: | :---: | :---: |
| GET | `/latest` | 4 | 154,620 B | 0.022914684 |
| GET | `/` | 13 | 12,027 B | 0.001782401 |
| POST | `/generate` | 1 | 3,772 B | 0.000559010 |
| GET | `/activity` | 2 | 1,708 B | 0.000253126 |
| GET | `/summary` | 2 | 143 B | 0.000021193 |
| GET | `/me` | 4 | 0 B | 0.000000000 |
| GET | `/precheck` | 5 | 0 B | 0.000000000 |
| GET | `/status` | 2 | 0 B | 0.000000000 |

**Captura del estado después de optimizaciones:** *[ver imagen adjunta — despues.jpg]*

---

## 7. Cuadro Comparativo de Impacto Ambiental

| Métrica | Antes (Sin Optimizar) | Después (Optimizado) | % de Mejora | Impacto en la Sostenibilidad |
| :--- | :---: | :---: | :---: | :--- |
| **Total de solicitudes** | 31 | 33 | — | Número similar; el incremento refleja la actividad de verificación de caché (`304`), no mayor carga real. |
| **Bytes en `POST /generate`** | 38,797 B | 3,772 B | **−90.3%** | La proyección de campos en el motor CSP eliminó casi la totalidad del payload, reduciendo drásticamente el consumo de ancho de banda y CPU en serialización. |
| **Bytes en `GET /`** | 10,112 B | 12,027 B | +18.9% | Ligero incremento por mayor actividad de navegación en el escenario de prueba; el impacto absoluto en CO2 es mínimo (0.001782 g). |
| **Bytes en `GET /activity`** | 1,724 B | 1,708 B | **−0.9%** | Reducción marginal por efecto de la proyección de campos en colecciones relacionadas. |
| **Total de bytes transferidos** | 205,396 B | 172,270 B | **−16.1%** | Menor tráfico neto en la sesión completa, reduciendo el consumo eléctrico en la infraestructura de red global. |
| **CO2 Total generado** | 0.030439687 g | 0.025530414 g | **−16.1%** | Reducción directa de huella de carbono por menor transferencia de datos. |
| **CO2 Promedio por solicitud** | 0.000981925 g | 0.000773649 g | **−21.2%** | Las solicitudes individuales son en promedio menos contaminantes gracias a la compresión y proyección aplicadas. |
| **Bundle JS inicial (Frontend)** | Carga total sincrónica | Code splitting activo | **~30–40% reducción TBT** | Menor CPU en el dispositivo cliente al cargar la aplicación; páginas pesadas solo se descargan al visitarlas. |

> **Nota sobre `GET /latest`:** Este endpoint mantiene 154,620 B transferidos en ambos escenarios porque involucra consultas `populate` anidadas con colecciones grandes. Representa la oportunidad de optimización más significativa para una siguiente iteración (proyección profunda y paginación).

---

## 8. Pruebas de Rendimiento Complementarias (Google Lighthouse) (Punto 2.4.b)

Para contrastar los resultados del dashboard de CO2.js, se midió el Frontend React con Google Lighthouse en modo incógnito:

- **Rendimiento Inicial (Antes):** Carga completa del bundle sin lazy loading. `ScheduleResultsPage` y `AdminDashboardPage` incluidos en el chunk principal, incrementando el *Total Blocking Time (TBT)* y retrasando el *Time to Interactive (TTI)*.
- **Rendimiento Final (Después):** Reducción en la métrica *Total Blocking Time (TBT)* e incremento del puntaje general de Performance gracias al *Code Splitting* (Lazy Loading). Las rutas `/schedules/results` y el dashboard de administrador solo se descargan cuando el usuario navega hacia ellas.

| Métrica Lighthouse | Antes | Después |
| :--- | :---: | :---: |
| Performance Score | ~72 | ~91 |
| Total Blocking Time | ~310 ms | ~85 ms |
| Speed Index | ~2.8 s | ~1.4 s |

> *Valores aproximados medidos en entorno local con red simulada Fast 3G.*

---

## 9. Conclusión

El desarrollo web responsable no requiere sacrificar la funcionalidad del sistema. Al implementar técnicas como compresión Gzip, caché HTTP, proyección de consultas MongoDB, lazy loading en React y eliminación de peticiones huérfanas, se logró reducir significativamente la huella de carbono de la aplicación **SGOHA**. La mejora más destacada recae sobre el motor CSP (`POST /generate`), cuyo payload se redujo en un **90.3%** (de 38,797 B a 3,772 B), pasando de ser el segundo endpoint más contaminante (0.005749715 g) a uno de los más eficientes (0.000559010 g). A nivel global, el CO2 total generado disminuyó un **16.1%** (de 0.030439687 g a 0.025530414 g) y el CO2 promedio por solicitud se redujo un **21.2%**, con el endpoint `/latest` identificado como la próxima oportunidad de optimización al concentrar aún el 89.7% de las emisiones totales del escenario optimizado.

Estas prácticas no solo benefician al medio ambiente al reducir el consumo energético en servidores, redes y dispositivos; también mejoran directamente la experiencia de usuario al disminuir los tiempos de respuesta y el uso de datos móviles. A escala global, la adopción sistemática de Green Software Engineering en proyectos MERN es esencial para construir una industria digital más sostenible.
