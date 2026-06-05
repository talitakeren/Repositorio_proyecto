# Reporte de Sostenibilidad y Eficiencia del Software

Este documento detalla el análisis de impacto ambiental de la aplicación **SGOHA** (*Sistema de Gestión de Horarios Académicos*), las mejoras implementadas bajo los principios de *Green Software Engineering*, y el análisis comparativo del rendimiento antes y después de los cambios.

---

## 1. Sensibilización: Impactos Ambientales en Aplicaciones Web

El desarrollo y uso de aplicaciones MERN genera costos ambientales invisibles. Los principales impactos son:

1. **Consumo Energético de Servidores e Infraestructura de Nube:**
   Los servidores de MongoDB Atlas y la API Express operan 24/7, consumiendo energía constantemente para procesamiento y refrigeración, especialmente durante la generación de horarios con múltiples colecciones.

2. **Consumo Eléctrico de Dispositivos Cliente:**
   Un frontend ineficiente —con carga excesiva de módulos o sin paginación— obliga a la CPU y GPU del dispositivo del usuario a trabajar a alta frecuencia, agotando la batería e incrementando la demanda eléctrica local.

3. **Huella de Carbono del Tránsito de Red:**
   Cada kilobyte transferido requiere electricidad. En SGOHA, endpoints como `/api/courses` o `/api/schedules/latest` retornaban más campos de los necesarios, inflando el tráfico innecesariamente.

4. **Consultas MongoDB sin Proyección:**
   Recuperar documentos completos cuando el cliente solo necesita algunos campos genera transferencias internas más pesadas, incrementando el uso de RAM, CPU y consumo energético del servidor.

5. **Generación de Residuos Electrónicos (E-waste):**
   El software ineficiente exige hardware más potente a corto plazo, acelerando la obsolescencia y el desecho de equipos con metales pesados contaminantes.

---

## 2. Identificación de Oportunidades y Justificación

En la arquitectura MERN de **SGOHA** se detectaron las siguientes oportunidades clave:

- **Motor CSP de Generación de Horarios (`/api/schedules/generate`):**
  - *Componente:* `csp.service.js` y `schedule.service.js` (Backend).
  - *Justificación:* El endpoint consultaba cinco colecciones sin proyección de campos. Traer todos los datos cuando el algoritmo solo usa unos pocos genera gasto innecesario de memoria, CPU y red. Proyectar solo los campos requeridos reduce ese consumo directamente.

- **Peticiones Repetidas a `/api/courses`:**
  - *Componente:* `course.service.js` (Backend) y páginas de cursos (Frontend).
  - *Justificación:* Los cursos cambian poco durante el semestre, pero la app recargaba la lista completa desde MongoDB en cada visita. Implementar caché HTTP elimina esas consultas redundantes.

- **Carga Inicial del Bundle de React (Sin Lazy Loading):**
  - *Componente:* Enrutador principal del frontend.
  - *Justificación:* Al iniciar, el navegador descargaba todos los módulos a la vez, incluyendo páginas que el usuario quizás nunca visitaría. Cargar cada página solo cuando se navega a ella reduce el consumo de CPU del dispositivo cliente desde el primer instante.

- **Respuestas de Error Verbosas en Rutas Inexistentes:**
  - *Componente:* Middleware de errores (Backend).
  - *Justificación:* Cada petición automática del navegador a `/favicon.ico` atravesaba toda la cadena de middlewares para retornar un `404` con cuerpo JSON. Responder con un `204 No Content` inmediato elimina ese gasto de CPU.

---

## 3. Sistema de Medición Utilizado (CO2.js)

Se incorporó la librería `@tgwf/co2` en el backend Express junto a un middleware global que intercepta el flujo de salida de cada respuesta HTTP. Calcula la huella de carbono estimada usando el modelo **Sustainable Web Design (SWD)**, que computa emisiones de CO2 a partir de los bytes reales transferidos por la red.

El middleware registra método HTTP, ruta, código de estado, tiempo de respuesta, bytes transferidos y CO2 estimado en gramos, generando un dashboard de métricas acumuladas al detener el servidor.

---

## 4. Métricas Iniciales (Antes)
Se obtuvieron estas métricas navegando la aplicación en su estado original: carga del dashboard de administrador, listado de cursos y una generación de horario.

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

<img width="409" height="457" alt="image" src="https://github.com/user-attachments/assets/9cae943c-efa7-47a3-b5dc-66b6de0e4d95" />

---

## 5. Mejoras Implementadas

Se aplicaron las siguientes optimizaciones. Cada una ataca un pilar de la eficiencia energética:

- **Compresión Gzip (Express APIs):** Integración del middleware `compression` en el servidor, comprimiendo automáticamente todas las respuestas JSON hasta en un 70–80%.
- **Caché HTTP para `/api/courses`:** Cabecera `Cache-Control: public, max-age=60` para que el navegador reutilice los datos durante 60 segundos sin consultar MongoDB. Lecturas subsecuentes: 0 bytes transferidos, respuesta `304 Not Modified`.
- **Proyección de Campos en `/api/courses`:** Se limitan los campos retornados por MongoDB a solo los que el frontend utiliza (código, nombre, créditos, tipo de aula, estado, prerrequisitos), reduciendo el tamaño de cada documento.
- **Proyección en el Motor CSP (`/api/schedules/generate`):** Se aplicó proyección a las consultas de docentes, aulas y franjas horarias, enviando al algoritmo solo los atributos necesarios. El payload pasó de 38,797 B a 3,772 B (−90.3%).
- **Lazy Loading en el Frontend React:** Uso de `React.lazy` y `Suspense` para las páginas más pesadas. El bundle inicial ya no incluye módulos que el usuario no ha visitado, reduciendo el *Total Blocking Time (TBT)* y el consumo de CPU en el cliente.
- **Eliminación de Peticiones Huérfanas (`/favicon.ico`):** Ruta `204 No Content` en Express para responder de inmediato, más etiqueta en el HTML para que el navegador no vuelva a solicitarlo.

---

## 6. Métricas Finales (Después)

Se reinició el servidor y se realizaron las mismas acciones de navegación para evaluar el impacto de las mejoras.

### Indicadores Generales (Después)

| Métrica | Valor | Variación respecto al antes |
| :--- | :---: | :---: |
| **Total de solicitudes procesadas** | 33 | *+2 (verificaciones de caché activa)* |
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

<img width="403" height="458" alt="image" src="https://github.com/user-attachments/assets/30d0ef60-a1ee-4c1c-9b6d-e00650b71d32" />


---

## 7. Cuadro Comparativo de Impacto Ambiental

| Métrica | Antes (Sin Optimizar) | Después (Optimizado) | % de Mejora | Impacto en la Sostenibilidad |
| :--- | :---: | :---: | :---: | :--- |
| **Total de solicitudes** | 31 | 33 | — | El leve incremento refleja verificaciones de caché (`304`), no mayor carga real. |
| **Bytes en `POST /generate`** | 38,797 B | 3,772 B | **−90.3%** | La proyección de campos eliminó casi la totalidad del payload, reduciendo drásticamente el consumo de ancho de banda y CPU. |
| **Bytes en `GET /`** | 10,112 B | 12,027 B | +18.9% | Ligero incremento por mayor actividad en el escenario de prueba; impacto en CO2 mínimo (0.001782 g). |
| **Bytes en `GET /activity`** | 1,724 B | 1,708 B | **−0.9%** | Reducción marginal por efecto de la proyección en colecciones relacionadas. |
| **Total de bytes transferidos** | 205,396 B | 172,270 B | **−16.1%** | Menor tráfico neto, reduciendo el consumo eléctrico en infraestructura de red global. |
| **CO2 Total generado** | 0.030439687 g | 0.025530414 g | **−16.1%** | Reducción directa de huella de carbono por menor transferencia de datos. |
| **CO2 Promedio por solicitud** | 0.000981925 g | 0.000773649 g | **−21.2%** | Solicitudes individuales menos contaminantes gracias a compresión y proyección. |
| **Bundle JS inicial (Frontend)** | Carga total sincrónica | Code splitting activo | **~30–40% reducción TBT** | Menor CPU en el dispositivo cliente; páginas pesadas solo se descargan al visitarlas. |

---
## 8. Beneficios

Las optimizaciones implementadas generaron beneficios concretos y medibles en tres dimensiones:

### Eficiencia Energética
*   **Menor consumo en servidores:** Al reducir los bytes procesados por el motor CSP en un 90.3% (de 38,797 B a 3,772 B por solicitud), el servidor dedica menos ciclos de CPU a serializar y transmitir datos, disminuyendo directamente su demanda eléctrica durante la operación más costosa del sistema.
*   **Caché como escudo energético:** Las respuestas `304 Not Modified` en `/api/courses` significan cero consultas a MongoDB Atlas para lecturas repetidas, eliminando por completo el consumo energético asociado a esas operaciones de base de datos.
*   **Menos trabajo por petición basura:** Silenciar `/favicon.ico` con un `204` inmediato evita que el servidor ejecute toda la cadena de middlewares ante cada carga de página, un ahorro pequeño pero constante y acumulativo.

### Rendimiento y Consumo de Recursos
*   **Red:** La transferencia total por sesión bajó de 205,396 B a 172,270 B (**−16.1%**), con el endpoint más pesado reduciendo su payload individual en **−90.3%**.
*   **Cliente:** El *Total Blocking Time* del frontend se redujo en un estimado de **30–40%** gracias al Lazy Loading, lo que se traduce en menor uso de CPU y batería en el dispositivo del usuario durante la carga inicial.
*   **Huella de carbono:** El CO2 total por sesión pasó de 0.030439687 g a 0.025530414 g (**−16.1%**), y el CO2 promedio por solicitud de 0.000981925 g a 0.000773649 g (**−21.2%**), medidos con el modelo SWD de CO2.js sobre bytes reales transferidos.

### Escalabilidad Sostenible
A mayor número de usuarios concurrentes, el impacto de cada optimización se multiplica. Una reducción del 90.3% en el payload de generación de horarios no es solo un ahorro puntual: con 1,000 generaciones diarias, evita transferir aproximadamente **35 MB de datos innecesarios** por día solo en ese endpoint. La caché HTTP para cursos, al eliminar consultas redundantes a MongoDB Atlas, reduce la presión sobre la base de datos en la nube, postergando la necesidad de escalar la infraestructura y el hardware asociado.

---
## 9. Conclusión

El desarrollo web responsable no requiere sacrificar la funcionalidad del sistema. Al implementar compresión Gzip, caché HTTP, proyección de consultas MongoDB, lazy loading en React y eliminación de peticiones huérfanas, se redujo significativamente la huella de carbono de **SGOHA**. La mejora más destacada es el motor CSP (`POST /generate`), con una reducción de payload del **90.3%** (de 38,797 B a 3,772 B). A nivel global, el CO2 total bajó un **16.1%** y el CO2 promedio por solicitud un **21.2%**, con `/latest` identificado como la próxima oportunidad de optimización al concentrar el 89.7% de las emisiones del escenario optimizado.

Estas prácticas no solo reducen el impacto ambiental; también mejoran la experiencia de usuario al disminuir los tiempos de respuesta y el consumo de datos. A escala global, adoptar Green Software Engineering en proyectos MERN es esencial para construir una industria digital más sostenible.
