# Estrategias de Testing y Aseguramiento de Calidad — SGOHA

---

## 1. Pruebas Unitarias

**Objetivo:** Validar de forma aislada los servicios, controladores, middlewares, utilitarios y componentes del sistema, verificando reglas de negocio, manejo de excepciones y comportamientos límite.

**Lo que se cumple:**

- Pruebas sobre servicios del backend: `authService`, `courseService`, `classroomService`, `enrollmentService`, `settingsService`, `cspService` y lógica de `scheduleEnrollment`.
- Pruebas sobre middlewares: `auth.middleware` (verificación de token JWT y roles) y `error.middleware` (manejo de errores HTTP).
- Pruebas sobre utilitarios: `apiResponse` (formato estándar de respuestas) y `asyncHandler` (captura de errores en handlers async).
- Pruebas sobre controladores (`auth`, `classroom`, `course`, `student`) usando `jest.unstable_mockModule` para aislar dependencias de servicios; se verifica que los controladores responden con los códigos HTTP esperados sin tocar la base de datos.
- Uso de **mocks**, **stubs** y **spies** (`jest.fn()`, `jest.spyOn()`, `jest.unstable_mockModule()`).
- Validación de excepciones: errores con status 401, 403, 404 y 409 (duplicado MongoDB `code: 11000`).
- Casos límite: email con espacios y mayúsculas, usuario inactivo, ID inexistente, contraseña incorrecta.
- Pruebas sobre componentes React (`Button`, `Input`, `Badge`, `EnrollmentStatusBadge`): renderizado verificado con `screen.getByRole` / `screen.getByText`, interacción via `userEvent.click`, estado `disabled`. El módulo `lucide-react` está mockeado para evitar errores de ESM en jsdom.
- Pruebas sobre utilitarios frontend: `authRedirect`, `settingsValidation`, `availabilityHelpers`, `teacherFilters`, `getInitials`, `pageTitles`, `studentLabels`.
- MSW (`msw@2.14.6`) configurado con handlers para los endpoints de auth, cursos, horarios, enrollments, dashboard y settings.

**Archivos:**

```
tests/unit/backend/
  auth.service.test.js          (7 tests)
  auth.controller.test.js       (5 tests)
  auth.middleware.test.js
  classroom.service.test.js
  classroom.controller.test.js  (6 tests)
  course.service.test.js
  course.controller.test.js     (5 tests)
  enrollment.service.test.js
  student.controller.test.js    (4 tests)
  settings.service.test.js
  csp.service.test.js
  scheduleEnrollment.test.js
  error.middleware.test.js
  asyncHandler.test.js
  apiResponse.test.js
  co2Impact.test.js

tests/unit/frontend/
  Button.test.jsx
  Input.test.jsx
  Badge.test.jsx
  EnrollmentStatusBadge.test.jsx
  authRedirect.test.js
  settingsValidation.test.js
  availabilityHelpers.test.js
  teacherFilters.test.js
  getInitials.test.js
  pageTitles.test.js
  studentLabels.test.js

tests/setup/backend/
  dbSetup.js       (MongoDB Memory Server — levanta BD en memoria por suite)
  authHelpers.js   (seedAdmin, seedUser, seedTeacher, seedStudent)
  env.js
tests/setup/frontend/
  setupUnit.cjs
  handlers.js
  server.js
tests/mocks/
  lucide-react.jsx

jest.unit.backend.config.cjs
jest.unit.frontend.config.cjs
babel.config.cjs
```

**Comandos:**

```bash
npm run test:unit:backend   # unitarias backend
npm run test:unit:frontend  # unitarias frontend
npm run test:unit           # ambas
```

**Capturas:**
![alt text](image.png)

---

## 2. Pruebas de Integración

**Objetivo:** Validar la integración entre la API REST, los módulos del backend y la persistencia, así como la integración entre los servicios del frontend y la API mockeada.

**Lo que se cumple:**

**Integración API (Supertest + MongoDB Memory Server):**

- Endpoints cubiertos: `POST /api/auth/login`, `GET /api/auth/me`, `GET|POST|PUT|DELETE /api/courses`, `/api/classrooms`, `/api/schedules`, `/api/restrictions`, `/api/settings`, `/api/dashboard/summary`, `/api/health`.
- Se verifican códigos HTTP (200, 201, 400, 401, 403, 404) y estructura de respuestas JSON (`success`, `data`, `message`).
- Se prueba autenticación y autorización por rol: STUDENT no accede a rutas de ADMIN (403), TEACHER accede a su portal, sin token retorna 401.
- Cada test opera sobre una BD en memoria limpia, verificando que los datos se crean y recuperan correctamente.
- Escenarios: peticiones válidas e inválidas (campos faltantes), acceso no autorizado y manejo de errores del servidor.

**Integración Frontend (RTL + MSW):**

- Servicios cubiertos: `authService`, `courseService`, `enrollmentService`, `scheduleService`, `dashboardService`, `settingsService`.
- Se verifica que cada servicio construye correctamente las peticiones HTTP y procesa las respuestas del servidor mockeado.
- Se prueban errores de red: respuestas 401, 404 y fallos de red simulados con `server.use(errorHandlers.*)`.

**Archivos:**

```
tests/integration/api/
  auth.test.js          (12 tests)
  courses.test.js       (11 tests)
  classrooms.test.js    (7 tests)
  schedules.test.js     (6 tests)
  restrictions.test.js  (4 tests)
  settings.test.js      (6 tests)
  dashboard.test.js     (6 tests)
  health.test.js        (2 tests)

tests/integration/frontend/
  authService.integration.test.js       (5 tests)
  courseService.integration.test.js     (8 tests)
  enrollmentService.integration.test.js (5 tests)
  scheduleService.integration.test.js   (1 test)
  dashboardService.integration.test.js  (3 tests)
  settingsService.integration.test.js   (5 tests)

tests/setup/backend/
  dbSetup.js
  authHelpers.js
tests/setup/frontend/
  handlers.js
  server.js
  setupIntegration.js

jest.integration.api.config.cjs
jest.integration.frontend.config.cjs
```

**Comandos:**

```bash
npm run test:integration:api       # integración API
npm run test:integration:frontend  # integración frontend
npm run test:integration           # ambas
```

---

## 3. Pruebas de Aceptación

**Objetivo:** Validar los flujos funcionales completos del sistema desde la perspectiva del usuario, simulando interacción real sobre el navegador.

**Lo que se cumple:**

- Herramienta: Cypress (`cypress@15.17.0`).
- Escenarios implementados:
  - **Login:** muestra formulario, valida campos vacíos, login exitoso redirige a `/dashboard`, credenciales incorrectas muestra mensaje de error.
  - **Gestión de datos (CRUD):** creación, listado y eliminación de registros desde la interfaz.
  - **Navegación funcional:** acceso a secciones del sistema, redirección entre rutas protegidas y públicas.
  - **Validaciones funcionales:** formularios rechazan entradas inválidas y muestran mensajes descriptivos.
- Se usa `cy.intercept()` para mockear la API, permitiendo pruebas independientes del estado del backend.

**Archivos:**

```
cypress/e2e/acceptance/
  acceptance-login.cy.js       (5 escenarios)
  acceptance-crud.cy.js        (3 escenarios)
  acceptance-navigation.cy.js  (6 escenarios)
  acceptance-validation.cy.js  (3 escenarios)

cypress/support/
  commands.js
  e2e.js
cypress.config.js
cypress.env.json
```

**Comandos:**

```bash
# Requiere frontend activo: cd frontend && npm run dev
npm run test:acceptance   # headless
npm run cy:open           # modo interactivo
```

---

## 4. Pruebas End-to-End (E2E)

**Objetivo:** Validar flujos completos del sistema bajo escenarios reales de operación, cubriendo Golden Path, Happy Path y Unhappy Path.

**Lo que se cumple:**

- Herramienta: Cypress (misma instalación que en aceptación).
- **Golden Path** (`golden-path.cy.js`): flujo principal login → dashboard → listado de cursos → logout, sin errores.
- **Happy Path** (`happy-path.cy.js`): docente inicia sesión con rol TEACHER y accede correctamente a su portal.
- **Unhappy Path** (`unhappy-path.cy.js`): login con credenciales incorrectas permanece en `/login`; acceder a ruta protegida sin autenticación redirige a `/login`.
- **Seguridad** (`security-flow.cy.js`): rutas admin (`/dashboard`, `/users`, `/settings`) bloqueadas sin token; token inválido limpia sesión y redirige a login.
- **Persistencia** (`persistence-flow.cy.js`): datos creados durante un flujo se reflejan correctamente en la interfaz.

**Archivos:**

```
cypress/e2e/e2e/
  golden-path.cy.js       (4 escenarios)
  happy-path.cy.js        (2 escenarios)
  unhappy-path.cy.js      (4 escenarios)
  security-flow.cy.js     (4 escenarios)
  persistence-flow.cy.js  (4 escenarios)

cypress/support/
  commands.js
  e2e.js
```

**Comandos:**

```bash
# Requiere frontend activo: cd frontend && npm run dev
npm run test:e2e   # solo E2E
npm run cy:run     # todas las pruebas Cypress juntas
```

---

## 5. Análisis de Cobertura

**Objetivo:** Evaluar cuantitativamente la cobertura alcanzada, identificar módulos cubiertos y documentar exclusiones justificadas.

**Lo que se cumple:**

- Cobertura configurada en las cuatro suites Jest (`coverageDirectory`, `collectCoverageFrom`, `coverageReporters: ["text", "lcov", "html", "json"]`).
- Módulos incluidos: backend (`services/`, `middlewares/`, `utils/`, `controllers/`) y frontend (`components/`, `utils/`, `hooks/`).
- Script `scripts/generate-coverage-html.cjs` que consolida los cuatro reportes en un índice HTML unificado (`tests/reports/coverage/index.html`).
- Exclusiones justificadas documentadas en `docs/COVERAGE_ANALYSIS.md`:
  - `backend/src/server.js` — arranque HTTP, sin lógica de negocio.
  - `frontend/src/main.jsx` — bootstrap de React.
  - `backend/routes/` (legado PoC) — código descontinuado.

**Archivos:**

```
jest.unit.backend.config.cjs
jest.unit.frontend.config.cjs
jest.integration.api.config.cjs
jest.integration.frontend.config.cjs
scripts/generate-coverage-html.cjs
docs/COVERAGE_ANALYSIS.md
tests/reports/coverage/   (generado al ejecutar test:coverage)
```

**Comandos:**

```bash
npm run test:coverage   # genera todos los reportes
npm run coverage:open   # abre el reporte HTML consolidado
```

---

## Ejecución completa

```bash
npm install

# Unit + Integration (Jest)
npm test

# Cobertura
npm run test:coverage

# Aceptación y E2E (requiere: cd frontend && npm run dev)
npm run test:acceptance
npm run test:e2e

# Todo en secuencia
bash scripts/run-all-tests.sh
```

---

## Herramientas utilizadas

| Tipo de prueba       | Herramienta                               |
|----------------------|-------------------------------------------|
| Unitarias backend    | Jest                                      |
| Unitarias frontend   | Jest + React Testing Library              |
| Integración API      | Jest + Supertest + MongoDB Memory Server  |
| Integración frontend | Jest + MSW                                |
| Aceptación           | Cypress                                   |
| E2E                  | Cypress                                   |
| Cobertura            | Jest `--coverage` (HTML + LCOV + JSON)    |
