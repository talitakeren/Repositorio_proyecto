# Análisis del Problema y Toma de Decisiones

## 1. Análisis del Problema

El problema abordado consiste en la generación automática de horarios académicos, considerando múltiples entidades (docentes, cursos, aulas y franjas horarias) y un conjunto de restricciones que deben cumplirse simultáneamente.

Este problema se clasifica como un problema complejo debido a:

- La naturaleza combinatoria del espacio de soluciones (gran cantidad de posibles asignaciones).
- La coexistencia de restricciones duras (obligatorias) y blandas (preferencias).
- La interdependencia entre variables (una asignación afecta a otras).
- La posibilidad de conflictos frecuentes entre recursos limitados.

Desde el punto de vista computacional, este tipo de problema es similar a problemas de satisfacción de restricciones (CSP), donde el objetivo es encontrar una asignación válida que cumpla todas las restricciones.

---

## 2. Modelado del Problema

El problema fue modelado como un sistema de asignación de recursos sujeto a restricciones.

### Variables del sistema:
- Cursos: unidades académicas a programar.
- Docentes: responsables de dictar cursos.
- Aulas: espacios físicos disponibles.
- Horarios: intervalos de tiempo disponibles.

### Dominio:
Cada curso puede asignarse a combinaciones posibles de (docente, aula, horario), siempre que cumplan las restricciones.

### Restricciones duras (hard constraints):
- Un docente no puede dictar dos cursos en el mismo horario.
- Un aula no puede ser utilizada simultáneamente por más de un curso.
- La capacidad del aula debe ser suficiente para el número de estudiantes.
- El docente debe estar disponible en el horario asignado.

### Restricciones blandas (soft constraints):
- Preferencias de horarios de docentes.
- Distribución equilibrada de carga académica.

### Implementación del modelo:
El modelo se implementó mediante validaciones en el archivo `ScheduleGenerator.js`, donde cada asignación es evaluada antes de ser aceptada, asegurando el cumplimiento de las restricciones.

---

## 3. Toma de Decisiones

Durante el desarrollo se tomaron decisiones clave que impactan directamente en la solución:

### 3.1 Enfoque de solución
Se optó por una estrategia basada en validaciones secuenciales en lugar de algoritmos avanzados de optimización (como backtracking completo o algoritmos evolutivos).

**Justificación:**
- Reduce la complejidad de implementación.
- Permite obtener resultados funcionales en menor tiempo.
- Facilita la comprensión del sistema.

---

### 3.2 Priorización de restricciones
Se decidió implementar primero las restricciones duras antes que las blandas.

**Justificación:**
- Garantiza la validez del horario generado.
- Evita soluciones inválidas desde etapas tempranas.

---

### 3.3 Diseño modular
Se estructuró el sistema en módulos separados (por ejemplo, scheduler, validaciones, pruebas).

**Justificación:**
- Mejora la mantenibilidad.
- Permite realizar pruebas unitarias.
- Facilita futuras extensiones.

---

## 4. Trade-offs Técnicos

El desarrollo implicó decisiones donde se sacrificaron ciertos aspectos para optimizar otros:

### 4.1 Precisión vs Tiempo de ejecución
Se priorizó la generación rápida de horarios mediante una lógica simplificada.

- Ventaja: menor tiempo de ejecución.
- Desventaja: no garantiza encontrar la solución óptima global.

---

### 4.2 Complejidad algorítmica vs Mantenibilidad
Se evitó el uso de algoritmos complejos de búsqueda o optimización.

- Ventaja: código más simple y fácil de mantener.
- Desventaja: menor eficiencia en escenarios grandes.

---

### 4.3 Flexibilidad vs Rendimiento
Se limitaron algunas restricciones avanzadas y configuraciones dinámicas.

- Ventaja: mejora del rendimiento general.
- Desventaja: menor capacidad de adaptación a casos específicos.

---

### 4.4 Escalabilidad vs Tiempo de desarrollo
No se implementaron soluciones altamente escalables.

- Ventaja: cumplimiento dentro del tiempo del proyecto.
- Desventaja: limitaciones ante crecimiento del sistema.

---

## 5. Propuestas de Mejora

A partir del análisis realizado, se proponen las siguientes mejoras:

- Implementar algoritmos de optimización (como backtracking, heurísticas o metaheurísticas).
- Incorporar mayor cantidad de restricciones blandas.
- Mejorar la eficiencia del algoritmo en escenarios con mayor volumen de datos.
- Desarrollar una interfaz para configurar restricciones dinámicamente.
- Implementar métricas automáticas de calidad del horario generado.

---

## 6. Evaluación de la Solución

La solución desarrollada logra:

- Generar horarios válidos respetando restricciones principales.
- Mantener una estructura de código clara y mantenible.
- Permitir pruebas mediante archivos de test.

Sin embargo, presenta limitaciones:

- No garantiza la optimalidad de la solución.
- Puede presentar conflictos en escenarios complejos.
- Tiene margen de mejora en rendimiento y flexibilidad.

En conclusión, la solución es adecuada para el alcance del proyecto, cumpliendo los requerimientos principales, aunque existen oportunidades claras de mejora en términos de optimización y escalabilidad.