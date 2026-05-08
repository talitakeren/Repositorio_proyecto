# Sistema de Generación Óptima de Horarios Académicos

## Tabla de Contenido
1. [Integrantes del equipo](#integrantes-del-equipo)
2. [Problemática abordada](#problemática-abordada)
3. [Justificación del PMV](#justificación-del-pmv)
4. [Modelo de Timetabling](#modelo-de-timetabling)
5. [Tecnologías utilizadas](#tecnologías-utilizadas)
6. [Arquitectura del sistema](#arquitectura-del-sistema)
7. [Capturas del sistema](#capturas-del-sistema)
8. [Video explicativo](#video-explicativo)
9. [Gestión del proyecto (Jira)](#gestión-del-proyecto-jira)
10. [Instrucciones de instalación](#instrucciones-de-instalación)
11. [Instrucciones de build](#instrucciones-de-build)
12. [Instrucciones de despliegue](#instrucciones-de-despliegue)
13. [Documentación](#documentación)
14. [Requisitos No Funcionales y Métricas](#requisitos-no-funcionales-y-métricas)
---

## Integrantes del equipo
- Contreras Infanzón Alexandra Mirella
- Espinoza Zarate Juan Carlos
- Huaman Raymundo Yenifer Nicole
- Olivera Paredes Talita Keren
- Vega Carhuallanqui Tatiana

---

## Problemática abordada

Las universidades con currículo flexible enfrentan dificultades en la generación de horarios académicos debido a múltiples factores como:

- Alta variabilidad en la matrícula estudiantil
- Disponibilidad limitada de docentes y aulas
- Restricciones académicas (prerrequisitos, créditos)
- Conflictos de horarios entre cursos
- Necesidad de optimización multiobjetivo

Este problema es considerado un problema complejo de ingeniería (NP-hard), ya que involucra múltiples variables interdependientes y no posee una solución única o trivial.

---

## Justificación del PMV

El desarrollo de un Producto Mínimo Viable (PMV) permitirá:

- Validar una solución inicial al problema de generación de horarios
- Reducir la complejidad mediante un enfoque incremental
- Evaluar la viabilidad técnica del sistema
- Obtener retroalimentación temprana de usuarios
- Implementar funcionalidades clave como:
  - Registro de entidades (estudiantes, docentes, cursos, aulas)
  - Validación de restricciones duras y blandas
  - Generación automática de horarios con función objetivo medible

---

## Modelo de Timetabling

Esta sección documenta formalmente el modelo de optimización implementado en `backend/services/scheduler.js`.

### Variables de decisión

```
X(curso, docente, aula, día, bloque) ∈ {0, 1}
```

Donde `X = 1` indica que el `curso` fue asignado al `docente`, en el `aula`, durante el `día` y `bloque` especificados.

### Dominio

| Elemento | Valores posibles |
|----------|-----------------|
| **Días** | Lunes, Martes, Miércoles, Jueves, Viernes |
| **Bloques horarios** | 8-10, 10-12, 14-16, 16-18 |
| **Docentes** | Registrados en la base de datos con `availability[]` |
| **Aulas** | Registradas en la base de datos con `code` y `capacity` |

### Restricciones DURAS (Hard Constraints)

Son restricciones que **deben cumplirse obligatoriamente**. Una solución que las viole no es válida.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| **HC1** | Sin solapamiento de docente | Un docente no puede estar asignado a dos cursos distintos en el mismo día y bloque. |
| **HC2** | Sin solapamiento de aula | Un aula no puede ser usada por dos cursos distintos en el mismo día y bloque. |
| **HC3** | Disponibilidad del docente | Solo se asigna un docente en bloques que pertenezcan a su `availability[]`. |

**Implementación en código:**
```js
// HC1 — control por clave "docente|día|bloque"
const teacherKey = `${teacher.name}|${day}|${block}`;
if (busyTeacher[teacherKey]) continue;

// HC2 — control por clave "aula|día|bloque"
const classroomKey = `${classroom.code}|${day}|${block}`;
if (busyClassroom[classroomKey]) continue;

// HC3 — verificación de availability
const isAvailable = teacher.availability.includes(`${day}-${block}`);
if (!isAvailable) continue;
```

### Restricciones BLANDAS (Soft Constraints)

Son restricciones que se **maximizan sin ser obligatorias**. Su cumplimiento mejora la calidad de la solución.

| ID | Restricción | Descripción |
|----|-------------|-------------|
| **SC1** | Preferencias del docente | Se priorizan bloques que figuren en `preferences[]` del docente (subconjunto de `availability[]`). Representa la preferencia horaria del stakeholder. |
| **SC2** | Distribución uniforme | Los cursos se distribuyen equitativamente entre los días de la semana para evitar sobrecarga en un solo día. |

**Distinción importante respecto al contexto del proyecto:**

> Las restricciones HC1, HC2 y HC3 son **restricciones del modelo de optimización** (propias del problema de timetabling: disponibilidad, no solapamiento, prioridades).
>
> Las restricciones de **alcance del proyecto** (tiempo de entrega, recursos del equipo, tamaño del dataset) son externas al modelo y se gestionan como supuestos y limitaciones de la PoC.

### Función Objetivo

La función objetivo combina dos métricas para obtener un puntaje de calidad entre 0 y 1:

```
objectiveScore = 0.7 × (cursosAsignados / totalCursos)
              + 0.3 × (preferencesMet / cursosAsignados)
```

| Componente | Peso | Significado |
|-----------|------|-------------|
| Tasa de asignación | 70% | Minimizar cursos sin horario (conflictos) |
| Tasa de preferencias | 30% | Maximizar satisfacción de preferencias del docente |
| **objectiveScore** | — | Rango `[0, 1]` — valor `1.0` = solución óptima perfecta |

**Ejemplo de respuesta del endpoint `/schedule/generate`:**
```json
{
  "schedule": [
    {
      "course": "Cálculo I",
      "courseCode": "MAT101",
      "teacher": "Juan Pérez",
      "classroom": "A1",
      "day": "Lunes",
      "block": "8-10",
      "meetsPreference": true
    }
  ],
  "metrics": {
    "totalAssigned": 5,
    "conflicts": 0,
    "unassigned": [],
    "preferencesMet": 3,
    "objectiveScore": 0.88
  }
}
```

### Supuestos y limitaciones de la PoC

- El dataset utilizado es de carácter exploratorio y puede no representar la escala real de la universidad.
- El algoritmo implementado es **backtracking con heurística greedy** (orden por menor carga diaria). Para mayor escala se podría usar algoritmos genéticos o programación entera.
- La calidad de los resultados depende directamente de la completitud del campo `availability[]` de cada docente.
- No se modelan restricciones de prerrequisitos entre cursos en la generación del horario (sí se validan en la matrícula).

---

## Tecnologías utilizadas

El proyecto se desarrolla utilizando el stack MERN:

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Base de datos:** MongoDB
- **Control de versiones:** Git y GitHub
- **Metodología:** Scrum
- **Testing:** Jest (con cobertura ≥ 70%)

---

## Arquitectura del sistema

El sistema implementa una arquitectura basada en el stack **MERN (MongoDB, Express, React, Node.js)**, combinada con el patrón **SPA (Single Page Application)** en el frontend y una **API REST** para la comunicación entre cliente y servidor.

### Capas del sistema

- **Frontend (React.js)**  
  Implementado como una SPA, permite la interacción del usuario con el sistema, incluyendo la gestión de cursos y la visualización de horarios generados.

- **Backend (Node.js + Express.js)**  
  Expone una API REST y gestiona la lógica de negocio, incluyendo el algoritmo de optimización para la generación de horarios académicos.

- **Base de datos (MongoDB)**  
  Responsable de la persistencia de datos, como cursos, docentes, horarios y restricciones.

### Flujo de interacción

Usuario → Frontend (React SPA) → API REST (Node.js/Express) → Base de datos (MongoDB)

### Características de la arquitectura

- **Separación de responsabilidades**: Cada capa cumple una función específica.
- **Escalabilidad horizontal**: Permite ampliar el sistema fácilmente.
- **Mantenibilidad**: Facilita la evolución y mejora del sistema.

---

## Capturas del sistema

A continuación se muestran algunas vistas del sistema en funcionamiento:

[Creación de docentes](https://drive.google.com/file/d/1TT5bOOA8B4vi1hdPfbJakkToT5Fv050A/view?usp=drive_link)

[Lista de docentes con disponibilidad](https://drive.google.com/file/d/110XmGiZK9hy5ce0CH1epHJqXsCdrN66z/view?usp=drive_link)

[Creación de cursos](https://drive.google.com/file/d/10Ka4CBzEKVrPu9HD74ybbbvbwDcM-c_T/view?usp=drive_link)

[Lista de cursos](https://drive.google.com/file/d/1lW_Tq0pRWrliOYP6tAMILaatGI1Um8F_/view?usp=drive_link)

---

## Video explicativo

🔗 [Ver video del proyecto (máx. 5 minutos)](https://drive.google.com/drive/folders/18SfcJ2oTlMpRmi4TxZT1MkCI7XLY6kbR?usp=drive_link)

---

## Gestión del proyecto (Jira)

El seguimiento del proyecto se realiza mediante Jira:

🔗 [Ver tablero Jira](https://continental-team-qdanr7dh.atlassian.net/jira/software/projects/SGOHA/summary)

---

## Instrucciones de instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/talitakeren/Repositorio_proyecto.git
cd Repositorio_proyecto
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

---

## Instrucciones de build

### Backend
```bash
cd backend
npm install mongodb express cors
```

### Frontend
```bash
cd frontend
npm run build
```

---

## Instrucciones de despliegue

### Backend
```bash
cd backend
node --env-file=config.env server
```

### Frontend
```bash
cd frontend
npm run dev
```

El sistema estará disponible en:
```
http://localhost:5050   ← API Backend
http://localhost:5173   ← Frontend React
```

---


## Documentación

La documentación completa del proyecto se encuentra en la carpeta `/docs`.

**Estructura:**
- `docs/inicio/` — Acta de constitución, stakeholders
- `docs/planeación/` — Backlog, cronograma, modelo de timetabling
- `docs/ejecución/` — Sprints, evidencias de desarrollo
- `docs/seguimiento/` — Métricas, resultados de pruebas
- `docs/cierre/` — Lecciones aprendidas, entregable final

🔗 Repositorio: https://github.com/talitakeren/Repositorio_proyecto.git

---

## Requisitos No Funcionales y Métricas

Referencia completa: [`/docs/metrics/requisitos-no-funcionales-y-metricas.md`](docs/4.seguimiento_control/RNF-Metricas-Validacion.md)

### Resultados de validación experimental

| ID     | Métrica                              | Umbral         | Resultado medido         | Estado  |
|--------|--------------------------------------|----------------|--------------------------|---------|
| RNF-01 | Tiempo de generación (30 cursos)     | ≤ 10 000 ms    | **1 ms**                 | ✅ PASS |
| RNF-02 | Tiempo de respuesta por endpoint     | ≤ 2 000 ms     | **< 200 ms**             | ✅ PASS |
| RNF-05 | Cobertura de líneas (Jest)           | ≥ 70 %         | **100 %**                | ✅ PASS |
| RNF-06 | Escalabilidad (cursos sin error)     | ≥ 20 cursos    | **30 cursos**            | ✅ PASS |
| —      | objectiveScore (función objetivo)    | ≥ 0.70         | **0.72**                 | ✅ PASS |
| —      | Conflictos en escenario máximo       | 0              | **0**                    | ✅ PASS |
| —      | Tests automatizados                  | 29 / 29 pasan  | **29 / 29**              | ✅ PASS |

### Cómo reproducir la validación

```bash
1. Ejecutar tests con cobertura
cd backend && npm test
 -Esperado: 29 passed, 100% líneas

2. Generar horario y verificar métricas
curl http://localhost:5050/schedule/generate
 -Esperado: { "conflicts": 0, "objectiveScore": >= 0.70, ... }

3. Medir tiempo de respuesta
curl -w "Tiempo: %{time_total}s\n" -o /dev/null -s http://localhost:5050/schedule/generate
 -Esperado: < 2.000s
```

### Escenario de validación ejecutado

```
Entorno de prueba:
  Cursos:    30 | Docentes: 15 | Aulas: 10 | Bloques: 20

Resultado:
  Tiempo:         1 ms
  Asignados:     30 / 30 (100%)
  Conflictos:     0
  objectiveScore: 0.72  (0.7 × 1.0 + 0.3 × 0.067)
```

> **Limitación PoC:** El dataset es sintético y exploratorio. El backtracking es óptimo
> para ≤ 30 cursos; escenarios de mayor escala requerirían algoritmos genéticos o
> programación entera mixta.


### Resumen de resultados obtenidos

| Requisito | Métrica | Umbral | Resultado obtenido | Estado |
|-----------|---------|--------|--------------------|--------|
| RNF-01 Tiempo de generación | ms para 30 cursos, 15 doc., 10 aulas | ≤ 10 000 ms | **0.67 ms** | ✅ |
| RNF-02 Tiempo de respuesta API | ms por endpoint REST | ≤ 2 000 ms | **< 50 ms** | ✅ |
| RNF-05 Cobertura de tests | % líneas cubiertas (Jest) | ≥ 70 % | **100 %** | ✅ |
| RNF-06 Escalabilidad | Cursos procesados sin error | ≥ 20 cursos | **30 cursos, 0 conflictos** | ✅ |
| Función Objetivo | objectiveScore (escenario máx.) | ≥ 0.70 | **0.76** | ✅ |

### Reproducir validación experimental

```bash
1. Verificar cobertura de tests
cd backend && npm test

2. Medir tiempo del algoritmo (escenario máximo: 30 cursos)
curl -o /dev/null -s -w "Tiempo: %{time_total}s\n" http://localhost:5050/schedule/generate

3. Ver resultado completo con métricas
curl http://localhost:5050/schedule/generate
Respuesta esperada:
{
  "schedule": [...],
  "totalAssigned": 30,
  "conflicts": 0,
  "preferencesMet": 6,
  "objectiveScore": 0.76
 }
```

### Limitaciones reconocidas de la PoC

- Dataset exploratorio: los datos de prueba no representan la escala real de la institución.
- La calidad del `objectiveScore` depende de que los docentes tengan `availability[]` configurada.
- El algoritmo (backtracking + greedy) es adecuado para ≤ 30 cursos; escala mayor requeriría algoritmo genético.
- `preferences[]` de docentes modeladas como SC1 pero aún no validadas con usuarios reales.

---

