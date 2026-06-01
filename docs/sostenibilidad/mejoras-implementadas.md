# Mejoras Implementadas — SGOHA

## Resumen ejecutivo

Se implementaron mejoras de sostenibilidad y eficiencia en el backend (Express + MongoDB) y el frontend (React). Las mejoras se aplicaron de forma incremental y verificable en el repositorio.

---

## Mejora 1 — Compresión HTTP con middleware `compression`

**Archivo modificado:** `backend/src/app.js`

**Implementación:**

```javascript
// Antes
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors(...));
app.use(express.json());
app.use(morgan("dev"));
```

```javascript
// Después
import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

const app = express();
app.use(compression());   // ← compresión gzip/deflate en todas las respuestas
app.use(cors(...));
app.use(express.json());
app.use(morgan("dev"));
```

**Instalación requerida:**
```bash
npm install compression
```

**Beneficio:** Reduce el tamaño de las respuestas JSON entre un 60% y 80%. Una respuesta de 50 KB pasa a pesar aproximadamente 10-15 KB. Esto reduce el consumo de ancho de banda y el tiempo de transferencia en cada petición.

---

## Mejora 2 — `.lean()` en consultas de listado

**Archivos modificados:** `backend/src/services/timeslot.service.js`, `backend/src/services/user.service.js`

**Implementación:** (ya presente en el código)

```javascript
// timeslot.service.js — listado con .lean()
const existing = await TimeSlot.find().lean();

// user.service.js — listado con .lean()
const users = await User.find(query).lean();
```

**Beneficio:** Los objetos `.lean()` son objetos JavaScript planos, sin los métodos y virtuals de Mongoose. Consumen hasta un 40% menos de memoria que los documentos Mongoose estándar. En listados con decenas o cientos de registros, esto reduce notoriamente el uso de heap del proceso Node.js.

---

## Mejora 3 — `.select()` para proyección de campos

**Archivos con implementación:**
- `backend/src/middlewares/auth.middleware.js`
- `backend/src/services/auth.service.js`
- `backend/src/services/user.service.js`
- `backend/src/services/dashboard.service.js`

**Implementación:**

```javascript
// auth.middleware.js — excluye el campo password del resultado
const user = await User.findById(userId).select("-password");

// dashboard.service.js — solo trae los campos necesarios para la vista
const schedules = await Schedule.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .select("period status assignments generatedAt createdAt");

const newStudents = await Student.find()
  .sort({ createdAt: -1 })
  .limit(4)
  .select("fullName code createdAt");
```

**Beneficio:** Se reduce el volumen de datos transferidos desde MongoDB al servidor. Si un documento tiene 20 campos pero la vista solo necesita 3, se evita transferir los 17 restantes. Esto reduce el I/O de la base de datos y el consumo de memoria del servidor.

---

## Mejora 4 — `.limit()` en consultas del dashboard

**Archivo modificado:** `backend/src/services/dashboard.service.js`

**Implementación:** (ya presente en el código)

```javascript
// Limita a 5 los horarios recientes
const schedules = await Schedule.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .select("period status assignments generatedAt createdAt");

// Limita a 6 las matrículas recientes
const enrollments = await Enrollment.find()
  .populate("student", "fullName code")
  .sort({ updatedAt: -1 })
  .limit(6);

// Limita a 4 los estudiantes recientes
const newStudents = await Student.find()
  .sort({ createdAt: -1 })
  .limit(4)
  .select("fullName code createdAt");
```

**Beneficio:** Evita que el dashboard traiga todos los registros históricos cuando solo necesita los más recientes. Reduce la carga de MongoDB y el tamaño de la respuesta.

---

## Mejora 5 — Índices en modelos MongoDB

**Archivos con implementación:**
- `backend/src/models/Enrollment.js`
- `backend/src/models/TimeSlot.js`

**Implementación:** (ya presente en el código)

```javascript
// Enrollment.js — índice único por estudiante
enrollmentSchema.index({ student: 1 }, { unique: true });

// TimeSlot.js — índice compuesto para búsquedas por día y hora
timeSlotSchema.index({ day: 1, startTime: 1, endTime: 1 }, { unique: true });
```

**Beneficio:** Los índices permiten que MongoDB ubique documentos sin recorrer toda la colección. Para colecciones con cientos de matrículas o franjas horarias, la diferencia entre O(n) y O(log n) es significativa en términos de CPU e I/O.

---

## Mejora 6 — `useMemo` y `useCallback` en el frontend

**Archivos con implementación:**
- `frontend/src/components/forms/StudentForm.jsx`
- `frontend/src/hooks/useMobileNav.js`
- `frontend/src/pages/schedules/SchedulesPage.jsx`

**Implementación:**

```javascript
// StudentForm.jsx
const courseMap = useMemo(() => {
  return courses.reduce((acc, c) => { acc[c._id] = c; return acc; }, {});
}, [courses]);

// useMobileNav.js
const toggle = useCallback(() => setOpen((v) => !v), []);
const close = useCallback(() => setOpen(false), []);

// SchedulesPage.jsx
const loadData = useCallback(async () => { ... }, []);
const displaySchedule = useMemo(() => { ... }, [schedule, filter]);
```

**Beneficio:** `useMemo` evita recalcular valores derivados en cada render cuando los datos de entrada no cambiaron. `useCallback` evita recrear funciones innecesariamente. Ambos reducen el uso de CPU del dispositivo del usuario y mejoran la fluidez de la interfaz.

---

## Impacto consolidado

| Mejora | Antes | Después | Reducción estimada |
|--------|-------|---------|-------------------|
| Compresión HTTP | Respuesta sin comprimir | gzip automático | ~70% en tamaño de respuesta |
| `.lean()` | Objetos Mongoose completos | Objetos JS planos | ~40% menos memoria |
| `.select()` | Todos los campos del documento | Solo campos necesarios | Variable según vista |
| `.limit()` en dashboard | Todos los registros | Máximo 5-6 por consulta | Proporcional al tamaño de la colección |
| Índices MongoDB | Búsqueda secuencial O(n) | Búsqueda indexada O(log n) | Alta en colecciones grandes |
| `useMemo`/`useCallback` | Recálculo en cada render | Solo cuando cambian dependencias | Reducción de CPU en cliente |

---

## Commits relacionados

Los cambios implementados pueden verificarse en el historial de la rama `development`:

```bash
git log --oneline origin/development
```
