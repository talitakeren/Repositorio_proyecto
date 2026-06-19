# 🎓 SGOHA — Sistema de Generación Óptima de Horarios Académicos

> Plataforma web para gestionar entidades académicas, validar matrículas y generar horarios sin conflictos mediante un motor **CSP básico** (Constraint Satisfaction Problem).

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Version%20Control-Git-F05032?logo=git&logoColor=white)

---

## 📚 Tabla de contenido

1. [Descripción general](#-descripción-general)
2. [Integrantes del equipo](#-integrantes-del-equipo)
3. [Problemática abordada](#-problemática-abordada)
4. [Objetivo del proyecto](#-objetivo-del-proyecto)
5. [Justificación del PMV](#-justificación-del-pmv)
6. [Funcionalidades principales](#-funcionalidades-principales)
7. [Roles del sistema](#-roles-del-sistema)
8. [Flujo general del sistema](#-flujo-general-del-sistema)
9. [Modelo CSP / Timetabling](#-modelo-csp--timetabling)
10. [Restricciones del sistema](#-restricciones-del-sistema)
11. [Franjas horarias oficiales](#-franjas-horarias-oficiales)
12. [Tecnologías utilizadas](#️-tecnologías-utilizadas)
13. [Arquitectura del sistema](#️-arquitectura-del-sistema)
14. [Estructura del proyecto](#-estructura-del-proyecto)
15. [Variables de entorno](#-variables-de-entorno)
16. [Instalación local](#-instalación-local)
17. [MongoDB con Docker](#-mongodb-con-docker)
18. [Seed y usuarios demo](#-seed-y-usuarios-demo)
19. [Ejecución del proyecto](#️-ejecución-del-proyecto)
20. [Build](#-build)
21. [Rutas principales](#-rutas-principales)
22. [Módulos del sistema](#-módulos-principales)
23. [Capturas del sistema](#️-capturas-del-sistema)
24. [Video explicativo](#-video-explicativo)
25. [Gestión del proyecto](#-gestión-del-proyecto)
26. [Documentación](#-documentación)
27. [Requisitos no funcionales y métricas](#-requisitos-no-funcionales-y-métricas)
28. [Limitaciones](#️-limitaciones)
29. [Próximos pasos](#-próximos-pasos)
30. [Nota académica](#-nota-académica)

---

## 📌 Descripción general

**SGOHA** es un sistema web académico orientado a la **generación óptima de horarios**. Permite registrar cursos, docentes, aulas y estudiantes; validar matrículas según prerrequisitos y créditos; y generar horarios sin conflictos usando un motor **CSP básico por backtracking**.

El sistema trabaja con tres roles principales:

| Rol | Descripción breve |
|-----|-------------------|
| **Administrador** | Gestiona entidades, matrícula, restricciones, configuración y horarios |
| **Docente** | Registra disponibilidad y consulta cursos y horario |
| **Alumno** | Selecciona cursos, valida matrícula y consulta su horario |

La generación de horarios se basa en una **asignación general**:

```txt
Curso + Docente + Aula + Franja horaria + Estudiantes matriculados
```

Desde esa programación general, el sistema permite consultar horarios por:

- 👨‍🎓 **Estudiante**
- 👨‍🏫 **Docente**
- 🏫 **Aula**

> No se generan tres horarios separados: se construye **un horario global** y se filtra por perspectiva.

---

## 👥 Integrantes del equipo

- Contreras Infanzón Alexandra Mirella
- Espinoza Zarate Juan Carlos
- Huaman Raymundo Yenifer Nicole
- Olivera Paredes Talita Keren
- Vega Carhuallanqui Tatiana

---

## 📌 Problemática abordada

Las universidades con currículo flexible enfrentan dificultades en la generación de horarios académicos debido a múltiples factores:

- Alta variabilidad en la matrícula estudiantil
- Disponibilidad limitada de docentes y aulas
- Restricciones académicas (prerrequisitos, créditos)
- Conflictos de horarios entre cursos
- Necesidad de optimización multiobjetivo

Este problema es considerado un problema complejo de ingeniería (**NP-hard**), ya que involucra múltiples variables interdependientes y no posee una solución única o trivial.

---

## 🎯 Objetivo del proyecto

Desarrollar un **Producto Mínimo Viable (PMV)** que automatice la planificación de horarios universitarios, priorizando la **correctitud** (horarios libres de conflictos) sobre la velocidad de generación, y ofreciendo paneles diferenciados por rol para la operación académica diaria.

---

## ✅ Justificación del PMV

El desarrollo del PMV permite:

- Validar una solución inicial al problema de generación de horarios
- Reducir la complejidad mediante un enfoque incremental
- Evaluar la viabilidad técnica del sistema
- Obtener retroalimentación temprana de usuarios
- Implementar funcionalidades clave:
  - Registro de entidades (estudiantes, docentes, cursos, aulas)
  - Validación de restricciones duras y operativas
  - Generación automática de horarios con métricas de calidad

---

## ✅ Funcionalidades principales

### 🧑‍💼 Administrador (`ADMIN`)

| Módulo | Descripción |
|--------|-------------|
| 📊 Dashboard | Resumen operativo con datos reales del sistema |
| 👤 Usuarios | Gestión de cuentas y roles |
| 📘 Cursos | CRUD de cursos académicos |
| 👨‍🏫 Docentes | CRUD y disponibilidad horaria |
| 🏫 Aulas | CRUD de aulas y compatibilidad por tipo |
| 👨‍🎓 Estudiantes | CRUD de estudiantes |
| 🕒 Franjas horarias | Catálogo oficial HORALV (126 franjas semanales) |
| 📋 Matrícula | Consulta y gestión administrativa de matrículas |
| 📅 Horarios | Prevalidación, generación CSP y consulta por alumno/docente/aula |
| 🧩 Restricciones | Panel informativo de reglas del motor CSP |
| ⚙️ Configuración | Parámetros generales del sistema académico |
| 🔐 Mi cuenta | Perfil y credenciales del administrador |

> **Nota:** Las rutas antiguas `/schedules/generate` y `/schedules/results` redirigen al módulo unificado **`/schedules`**.

### 👨‍🏫 Docente (`TEACHER`)

| Módulo | Descripción |
|--------|-------------|
| 🏠 Portal docente | Inicio del portal |
| 📆 Mi disponibilidad | Registro de franjas disponibles (grilla HORALV) |
| 📚 Mis cursos | Cursos asignados |
| 📅 Mi horario | Horario generado del docente |
| 👤 Perfil | Datos del docente |
| 🔐 Mi cuenta | Cambio de contraseña |

### 👨‍🎓 Alumno (`STUDENT`)

| Módulo | Descripción |
|--------|-------------|
| 🏠 Portal del alumno | Inicio del portal |
| 📝 Mi matrícula | Selección de cursos y resumen de matrícula |
| ✅ Validación de matrícula | Prerrequisitos, créditos y confirmación |
| 📅 Mi horario | Horario generado del estudiante |
| 👤 Perfil académico | Datos del alumno |
| 🔐 Mi cuenta | Cambio de contraseña |

> La ruta `/student/courses` redirige a **Validación de matrícula**; la selección de cursos se realiza desde **Mi matrícula**.

---

## 👤 Roles del sistema

| Rol | Descripción | Funciones principales |
|-----|-------------|------------------------|
| `ADMIN` | Administrador del sistema | Gestiona entidades, matrícula, restricciones, configuración y horarios |
| `TEACHER` | Docente | Registra disponibilidad y consulta cursos/horarios |
| `STUDENT` | Alumno | Selecciona cursos, valida matrícula y consulta horario |

Las rutas del frontend están protegidas con **JWT** y el componente `RoleRoute`, que redirige a cada portal según el rol autenticado. Los endpoints del API aplican middleware `protect` + `authorizeRoles`.

---

## 🔄 Flujo general del sistema

```txt
1. Administrador registra cursos, docentes, aulas y estudiantes.
2. Docente registra su disponibilidad horaria (franjas HORALV).
3. Alumno selecciona cursos para matrícula.
4. Sistema valida prerrequisitos y créditos (20–22 por defecto).
5. Alumno confirma matrícula; el administrador consulta el estado.
6. Administrador ejecuta prevalidación y genera horarios (motor CSP).
7. Sistema permite consultar horarios por estudiante, docente y aula.
```

**Idea clave de asignación:**

```txt
Curso + Docente + Aula + Franja horaria + Estudiantes
```

El motor produce una **programación general**; las vistas por alumno, docente o aula son **filtros** sobre esa misma base.

---

## 🧠 Modelo CSP / Timetabling

El motor actual se implementa en:

- `backend/src/services/csp.service.js` — algoritmo CSP básico
- `backend/src/services/schedule.service.js` — orquestación, prevalidación y persistencia

### Variables

- Curso
- Docente
- Aula
- Franja horaria (día + `startTime` + `endTime`)
- Estudiantes matriculados

### Dominio

- Cursos activos
- Docentes activos con disponibilidad registrada
- Aulas activas y compatibles (`classroomTypeRequired`)
- Franjas horarias oficiales HORALV
- Matrículas elegibles para horarios (`CONFIRMED`, `VALIDATED`, `VALID`)

### Asignación

```txt
X = (curso, docente, aula, día, franja, estudiantes)
```

**Ejemplo de asignación:**

```json
{
  "course": "CS101",
  "teacher": "Docente Demo",
  "classroom": "LAB-1",
  "timeSlot": {
    "day": "MONDAY",
    "startTime": "07:00",
    "endTime": "07:44"
  },
  "students": ["AL2026001"]
}
```

### Función objetivo (referencia de diseño)

Documentada en [`AGENTS.md`](AGENTS.md):

```txt
ObjectiveScore =
  (+10 × preferenciasCumplidas)
  (-50 × conflictos)
  (-20 × cursosSinAsignar)
  (-5 × sobrecargaHoraria)
```

### Supuestos del PMV

- Dataset inicial orientado a demostración académica.
- Algoritmo **backtracking básico**; escenarios de gran escala pueden requerir metaheurísticas.
- La calidad depende de disponibilidad docente y matrículas confirmadas.
- Prerrequisitos se validan en **matrícula**; el CSP opera sobre cursos ya elegibles.

---

## 🧩 Restricciones del sistema

### Restricciones duras (obligatorias)

| Restricción | Validación |
|-------------|------------|
| No solapamiento de docentes | `teacher + day + startTime + endTime` único |
| No solapamiento de aulas | `classroom + day + startTime + endTime` único |
| No solapamiento de estudiantes | `student + day + startTime + endTime` único |
| Compatibilidad curso-aula | `course.classroomTypeRequired === classroom.type` |
| Capacidad del aula | `classroom.capacity >= estudiantes matriculados` |
| Matrículas elegibles | Solo matrículas confirmadas/validadas para horarios |
| Franjas oficiales | Solo bloques del catálogo HORALV |

**Ejemplos de tipos de aula:**

```txt
STANDARD      → Aula estándar
LAB           → Laboratorio
COMPUTER_ROOM → Sala de cómputo
```

### Restricciones operativas

| Restricción | Descripción |
|-------------|-------------|
| Disponibilidad docente | La franja debe existir en `teacher.availability` |
| Docente / curso / aula activos | Solo entidades con `active: true` |
| Aula disponible | `classroom.status === AVAILABLE` |
| Franjas activas en BD | Sincronización con catálogo HORALV |

El panel **Restricciones** (`/restrictions`) documenta estas reglas para el administrador. La configuración académica está en **Configuración** (`/settings`).

---

## 🕒 Franjas horarias oficiales

El sistema usa **18 franjas por día** y **126 franjas semanales** (7 días × 18 bloques), definidas en:

- `backend/src/constants/timeBlocks.js`
- `frontend/src/constants/timeBlocks.js`

| N.º | Franja | N.º | Franja |
|-----|--------|-----|--------|
| 1 | 07:00 - 07:44 | 10 | 14:45 - 15:29 |
| 2 | 07:45 - 08:29 | 11 | 15:40 - 16:24 |
| 3 | 08:40 - 09:24 | 12 | 16:25 - 17:09 |
| 4 | 09:25 - 10:09 | 13 | 17:20 - 18:04 |
| 5 | 10:20 - 11:04 | 14 | 18:05 - 18:49 |
| 6 | 11:05 - 11:49 | 15 | 19:00 - 19:44 |
| 7 | 12:00 - 12:44 | 16 | 19:45 - 20:29 |
| 8 | 12:45 - 13:29 | 17 | 20:30 - 21:14 |
| 9 | 14:00 - 14:44 | 18 | 21:15 - 21:59 |

### Agrupación por turnos (visualización)

| Turno | Rango horario |
|-------|----------------|
| ☀️ **Mañana** | 07:00 – 13:29 |
| 🌤️ **Tarde** | 14:00 – 17:09 |
| 🌙 **Noche** | 17:20 – 21:59 |

> Existe un **receso real** entre **13:29** y **14:00** (sin franja asignable).  
> No se usa turno “mediodía”. No se emplean bloques genéricos de 1 h 30 min (p. ej. 8–10, 10–12).

**Días activos:** Lunes, Martes, Miércoles, Jueves, Viernes, Sábado y Domingo.

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite 8 |
| Estilos | Tailwind CSS 4 |
| Enrutamiento | React Router 7 |
| HTTP cliente | Axios |
| Iconos | Lucide React |
| Backend | Node.js + Express 5 |
| ODM | Mongoose 8 |
| Autenticación | JWT + bcryptjs |
| Base de datos | MongoDB |
| Contenedores | Docker (MongoDB local) |
| Control de versiones | Git + GitHub |
| Gestión de proyecto | Scrum / Jira |
| IDE | Cursor |
| Testing | Jest + Supertest + RTL + MSW + Cypress (carpeta `tests/` en raíz) |

**Stack resumido:** MERN + Tailwind + Docker.

---

## 🏗️ Arquitectura del sistema

```txt
┌─────────────────────────────────────┐
│   Frontend — React + Vite (SPA)     │
│   Tailwind · React Router · Axios   │
└─────────────────┬───────────────────┘
                  │  REST + JWT
                  ▼
┌─────────────────────────────────────┐
│   Backend — Node.js + Express         │
│   Controllers · Services · Models     │
│   Motor CSP (csp.service.js)        │
└─────────────────┬───────────────────┘
                  │  Mongoose
                  ▼
┌─────────────────────────────────────┐
│   MongoDB (Docker / local / Atlas)  │
└─────────────────────────────────────┘
```

**Características:**

- Frontend **SPA** con layouts por rol (Admin, Docente, Alumno).
- Backend **API REST** bajo prefijo `/api`.
- Persistencia en **MongoDB**.
- **JWT** para autenticación stateless.
- **Roles** para autorización en rutas y endpoints.
- Motor **CSP** integrado en el servicio de horarios.

---

## 📁 Estructura del proyecto

```txt
Repositorio_proyecto/
├── AGENTS.md                 # Reglas del motor y restricciones (referencia)
├── SPEC.md                   # Especificación formal del sistema
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/           # DB, variables de entorno
│   │   ├── constants/        # timeBlocks, restricciones, settings
│   │   ├── controllers/
│   │   ├── middlewares/      # auth, errores
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/             # seedUsers.js, seed.js
│   │   ├── services/         # csp, schedule, enrollment, etc.
│   │   └── utils/
│   ├── tests/                # Pruebas Jest (legado PoC)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/          # AuthContext
│   │   ├── hooks/
│   │   ├── layouts/          # Admin, Teacher, Student
│   │   ├── pages/
│   │   ├── routes/           # AppRouter, RoleRoute
│   │   ├── services/
│   │   └── styles/
│   ├── .env.example
│   └── package.json
│
└── backend/routes/           # Rutas legadas (PoC anterior; no usar en producción)
```

---

## 🔐 Variables de entorno

> ⚠️ **Nunca subas archivos `.env` a GitHub.** Deben estar listados en `.gitignore`.  
> Copia las plantillas: `cp .env.example .env` en `backend/` y `frontend/`.

### Backend (`backend/.env`)

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/HorariosAcademicos
MONGO_DB_NAME=HorariosAcademicos
JWT_SECRET=change_this_secret_in_production
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5001/api
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del API (**5001** por defecto; en macOS el 5000 puede estar ocupado) |
| `MONGO_URI` | Cadena de conexión MongoDB **sin credenciales reales en el repo** |
| `JWT_SECRET` | Secreto de firma JWT — usar valor fuerte en producción |
| `VITE_API_URL` | URL base del API incluyendo `/api` |

---

## 🚀 Instalación local

### Requisitos previos

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) local o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- (Opcional) [MongoDB Compass](https://www.mongodb.com/products/compass)

### 1. Clonar el repositorio

```bash
git clone https://github.com/talitakeren/Repositorio_proyecto.git
cd Repositorio_proyecto
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env si es necesario
npm run seed
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Verificar

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:5001/api |
| Health check | http://localhost:5001/api/health |

> Ejecuta **MongoDB antes** de levantar el backend.

---

## 🐳 MongoDB con Docker

```bash
docker run -d \
  --name mongo-local \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7
```

**Conexión en MongoDB Compass:**

```txt
mongodb://127.0.0.1:27017
```

**Base de datos del proyecto:**

```txt
HorariosAcademicos
```

Las colecciones se crean al guardar documentos desde el backend o al ejecutar el seed.

| Comando | Acción |
|---------|--------|
| `docker ps` | Ver contenedor activo |
| `docker stop mongo-local` | Detener |
| `docker start mongo-local` | Reiniciar |

Si usas autenticación en Docker, ajusta `MONGO_URI` en `.env` según `backend/.env.example` (sin publicar credenciales reales).

---

## 🧪 Seed y usuarios demo

### Usuarios de desarrollo (`npm run seed`)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| ADMIN | admin@sgoha.edu | 123456 |
| DOCENTE | docente@sgoha.edu | 123456 |
| ALUMNO | alumno@sgoha.edu | 123456 |

> ⚠️ Credenciales **solo para entorno de desarrollo**. No usar en producción.

```bash
cd backend
npm run seed
```

Crea usuarios demo y vincula perfiles de **Teacher** y **Student**.

### Seed completo (`npm run seed:full`)

```bash
cd backend
npm run seed:full
```

⚠️ **Borra datos existentes** y carga un conjunto de prueba (cursos, docentes, aulas, estudiantes, franjas HORALV). Usar solo en desarrollo.

---

## ▶️ Ejecución del proyecto

| Terminal | Comando | Descripción |
|----------|---------|-------------|
| 1 — MongoDB | `docker start mongo-local` | Base de datos |
| 2 — Backend | `cd backend && npm run dev` | API con nodemon |
| 3 — Frontend | `cd frontend && npm run dev` | Interfaz Vite |

**Producción (backend):**

```bash
cd backend
npm start
```

**API principal de horarios (requiere token ADMIN):**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/schedules/precheck` | Prevalidación antes de generar |
| `POST` | `/api/schedules/generate` | Generación CSP |
| `GET` | `/api/schedules/latest` | Último horario generado |

---

## 📦 Build

### Frontend

```bash
cd frontend
npm run build
npm run preview   # vista previa del build
```

### Backend

El backend no requiere paso de compilación; usa Node directamente:

```bash
cd backend
npm install
npm start
```

---

## 📍 Rutas principales (frontend)

### Administrador

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/dashboard` | Dashboard administrativo |
| `/users` | Gestión de usuarios |
| `/courses` | Gestión de cursos |
| `/teachers` | Gestión de docentes |
| `/teachers/:id/availability` | Disponibilidad de un docente |
| `/classrooms` | Gestión de aulas |
| `/students` | Gestión de estudiantes |
| `/timeslots` | Franjas horarias HORALV |
| `/enrollments` | Matrícula administrativa |
| `/schedules` | Horarios (generación + consulta) |
| `/restrictions` | Restricciones del motor CSP |
| `/settings` | Configuración del sistema |
| `/account` | Mi cuenta |

### Docente

| Ruta | Descripción |
|------|-------------|
| `/teacher/home` | Portal docente |
| `/teacher/availability` | Mi disponibilidad |
| `/teacher/courses` | Mis cursos |
| `/teacher/schedule` | Mi horario |
| `/teacher/profile` | Perfil |
| `/teacher/account` | Mi cuenta |

### Alumno

| Ruta | Descripción |
|------|-------------|
| `/student/home` | Portal del alumno |
| `/student/enrollment` | Mi matrícula |
| `/student/enrollment-validation` | Validación de matrícula |
| `/student/schedule` | Mi horario |
| `/student/profile` | Perfil académico |
| `/student/account` | Mi cuenta |

---

## 📦 Módulos principales

### 🧑‍💼 Administración

Dashboard · Usuarios · Cursos · Docentes · Aulas · Estudiantes · Franjas · Matrícula · Horarios · Restricciones · Configuración

### 👨‍🏫 Portal docente

Disponibilidad · Mis cursos · Mi horario · Perfil

### 👨‍🎓 Portal alumno

Mi matrícula · Validación · Mi horario · Perfil académico

---

## 🖼️ Capturas del sistema

Evidencias del PMV (Google Drive):

| Vista | Enlace |
|-------|--------|
| Creación de docentes | [Ver captura](https://drive.google.com/file/d/1TT5bOOA8B4vi1hdPfbJakkToT5Fv050A/view?usp=drive_link) |
| Lista de docentes con disponibilidad | [Ver captura](https://drive.google.com/file/d/110XmGiZK9hy5ce0CH1epHJqXsCdrN66z/view?usp=drive_link) |
| Creación de cursos | [Ver captura](https://drive.google.com/file/d/10Ka4CBzEKVrPu9HD74ybbbvbwDcM-c_T/view?usp=drive_link) |
| Lista de cursos | [Ver captura](https://drive.google.com/file/d/1lW_Tq0pRWrliOYP6tAMILaatGI1Um8F_/view?usp=drive_link) |

**Módulos actuales adicionales** (capturas pendientes de actualizar):

- Login · Dashboard · Matrícula · Horarios · Restricciones · Configuración · Portales docente y alumno

```txt
Las capturas actualizadas pueden agregarse en una carpeta docs/screenshots/
o mediante enlaces externos en este README.
```

---

## 📹 Video explicativo

🔗 [Ver video del proyecto (máx. 5 minutos)](https://drive.google.com/drive/folders/18SfcJ2oTlMpRmi4TxZT1MkCI7XLY6kbR?usp=drive_link)

---

## 📌 Gestión del proyecto

El seguimiento se realizó con **Scrum** y tablero **Jira**:

🔗 [Tablero Jira — Proyecto SGOHA](https://continental-team-qdanr7dh.atlassian.net/jira/software/projects/SGOHA/summary)

La gestión se organizó por módulos funcionales: autenticación, entidades académicas, matrícula, horarios y portales por rol.

---

## 📄 Documentación

| Recurso | Ubicación |
|---------|-----------|
| **Informe técnico 7.2** | [`docs/INFORME_TECNICO_INTEGRAL_7_2.md`](docs/INFORME_TECNICO_INTEGRAL_7_2.md) |
| Índice expediente técnico | [`docs/README.md`](docs/README.md) |
| SonarQube | [`docs/reportes/sonar/GUIA_EJECUCION_SONARQUBE.md`](docs/reportes/sonar/GUIA_EJECUCION_SONARQUBE.md) |
| OWASP / seguridad | [`docs/reportes/security/OWASP_ANALYSIS.md`](docs/reportes/security/OWASP_ANALYSIS.md) |
| WCAG 2.2 | [`docs/reportes/accessibility/WCAG_2_2_VALIDATION.md`](docs/reportes/accessibility/WCAG_2_2_VALIDATION.md) |
| SUS | [`docs/reportes/usability/SUS_ANALYSIS.md`](docs/reportes/usability/SUS_ANALYSIS.md) |
| CI/CD | [`docs/CI_CD_GITHUB_ACTIONS.md`](docs/CI_CD_GITHUB_ACTIONS.md) |
| Evidencias | [`docs/evidencias/README.md`](docs/evidencias/README.md) |
| Reglas del motor y restricciones | [`AGENTS.md`](AGENTS.md) |
| Especificación formal | [`SPEC.md`](SPEC.md) |
| Plantillas de entorno | `backend/.env.example`, `frontend/.env.example` |

## 🛡️ Calidad, seguridad, accesibilidad y usabilidad

El punto **7.2** del informe técnico integral documenta SonarQube, métricas, OWASP, WCAG 2.2, SUS y CI/CD con evidencias reproducibles.

| Área | Enlace rápido |
| ---- | ------------- |
| Informe principal | [docs/INFORME_TECNICO_INTEGRAL_7_2.md](docs/INFORME_TECNICO_INTEGRAL_7_2.md) |
| Cobertura y métricas | [docs/COVERAGE_ANALYSIS.md](docs/COVERAGE_ANALYSIS.md) |
| Plan de pruebas | [docs/TEST_PLAN.md](docs/TEST_PLAN.md) |

```bash
npm test && npm run test:coverage   # 208 pruebas + LCOV
npm run audit:security              # npm audit JSON
npm run test:a11y                   # Cypress + axe (preview :5173)
```

---

## 📊 Requisitos no funcionales y métricas

### Requisitos no funcionales considerados

| Área | Descripción |
|------|-------------|
| Usabilidad | Paneles por rol, Tailwind, navegación lateral |
| Modularidad | Separación frontend / backend / servicios |
| Seguridad | JWT, rutas protegidas, `.env` fuera del repo |
| Persistencia | MongoDB + Mongoose |
| Responsive | Layout adaptable (sidebar móvil) |
| Correctitud | Prioridad a horarios sin conflictos |

### Resultados de validación experimental (PoC)

> Métricas obtenidas en fase de prueba de concepto. Los endpoints actuales usan **`/api/schedules/*`** en el puerto **5001** y requieren autenticación JWT.

| ID | Métrica | Umbral | Resultado medido | Estado |
|----|---------|--------|------------------|--------|
| RNF-01 | Tiempo de generación (~30 cursos) | ≤ 10 000 ms | **≈ 1 ms** | ✅ |
| RNF-02 | Tiempo de respuesta API | ≤ 2 000 ms | **< 200 ms** | ✅ |
| RNF-05 | Cobertura de líneas (Jest) | ≥ 70 % | **100 %** (PoC) | ✅ |
| RNF-06 | Escalabilidad sin error | ≥ 20 cursos | **30 cursos** | ✅ |
| — | Conflictos en escenario máximo | 0 | **0** | ✅ |
| — | Tests automatizados | — | **29 / 29** (PoC) | ✅ |

### Reproducir pruebas

```bash
# Desde la raíz del repositorio (NO dentro de backend/frontend)
npm install
npm test
npm run test:coverage
npm run test:co2
```

Ver [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) para Cypress, aceptación y E2E.

Para probar generación con la API actual:

1. Iniciar sesión como `admin@sgoha.edu` y obtener el token JWT.
2. Ejecutar prevalidación: `GET /api/schedules/precheck`
3. Generar horario: `POST /api/schedules/generate`

### Escenario de validación (referencia PoC)

```txt
Entorno de prueba:
  Cursos: 30 | Docentes: 15 | Aulas: 10 | Franjas: 126 (HORALV)

Resultado de referencia:
  Tiempo:         ~1 ms
  Asignados:      30 / 30
  Conflictos:     0
```

---

## ⚠️ Limitaciones

- **PMV académico** con alcance acotado al curso/proyecto.
- Motor **CSP básico** (backtracking); sin optimización multiobjetivo avanzada.
- **Dataset inicial** de demostración; no representa escala institucional real.
- **Reportes avanzados** y exportación masiva pendientes.
- **Despliegue en producción** no documentado como entregable final.
- Pruebas E2E y cobertura completa del frontend **pendientes**.
- Código legado en `backend/routes/` y `backend/services/scheduler.js` (PoC anterior); la implementación vigente está en `backend/src/`.

---

## 🚧 Próximos pasos

- [ ] Mejorar el motor CSP (heurísticas, restricciones blandas SC1–SC4).
- [ ] Reportes y exportación de horarios (PDF / Excel).
- [ ] Pruebas automatizadas E2E (Playwright / Cypress).
- [ ] Despliegue (Docker Compose completo o cloud).
- [ ] Experiencia móvil refinada en portales docente y alumno.
- [ ] Auditoría de cambios y historial de generaciones.
- [ ] Panel de métricas en tiempo real post-generación.
- [ ] Actualizar capturas y video con la UI actual (Restricciones, Configuración, Horarios unificado).

---

## 📄 Nota académica

Proyecto desarrollado en el marco de un curso de **Ingeniería de Software** / gestión de proyectos tecnológicos.  
El código se distribuye con fines **educativos**. Consulte con el equipo docente las políticas de uso, licencia y entrega formal del producto.

---

<p align="center">
  <strong>SGOHA</strong> — Generando horarios académicos con rigor, claridad y enfoque en la experiencia institucional.
  <br />
  🎓 📅 ⚙️ 🧠
</p>
