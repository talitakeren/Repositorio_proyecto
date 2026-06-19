# Protocolo de evaluación SUS — SGOHA

## Objetivo

Medir la usabilidad percibida del SGOHA mediante el **System Usability Scale (SUS)** con participantes de los tres roles académicos.

## Muestra recomendada

| Parámetro | Valor |
| --------- | ----- |
| Tamaño mínimo | 5 participantes |
| Perfiles | ≥ 1 ADMIN, ≥ 2 TEACHER, ≥ 2 STUDENT |
| Reclutamiento | Usuarios con experiencia académica (no del equipo de desarrollo) |
| Anonimización | Código `P001`…`P00N` sin nombres en CSV |

## Tareas por rol (antes del cuestionario)

### ADMIN
1. Iniciar sesión
2. Registrar curso
3. Registrar docente y aula
4. Revisar matrícula
5. Generar y consultar horario

### TEACHER
1. Iniciar sesión
2. Registrar disponibilidad
3. Consultar cursos y horario

### STUDENT
1. Iniciar sesión
2. Consultar y seleccionar cursos
3. Validar matrícula
4. Consultar horario

## Sesión (≈ 25–35 min)

1. Consentimiento informado ([`CUESTIONARIO_SUS.md`](../../plantillas/CUESTIONARIO_SUS.md))
2. Contexto neutral — sin ayuda del moderador salvo bloqueo
3. Ejecución de tareas del rol
4. Cuestionario SUS (10 preguntas, escala 1–5)
5. Comentarios abiertos opcionales

## Tratamiento de datos

1. Registrar respuestas en `docs/reportes/usability/sus-responses.csv` (copiar desde [`sus-responses-template.csv`](./sus-responses-template.csv))
2. Ejecutar: `npm run sus:calculate`
3. Archivar JSON/MD generados como evidencia `SUS-01`
4. Eliminar datos personales de comentarios antes de commit

## Fórmula

- Impares: `aporte = respuesta - 1`
- Pares: `aporte = 5 - respuesta`
- `SUS = suma_aportes × 2.5` (0–100)

## Interpretación

| Rango SUS | Significado |
| --------- | ----------- |
| ≥ 80,3 | Excelente |
| 68 – 80,2 | Bueno |
| 50 – 67,9 | Aceptable |
| < 50 | Deficiente |

## Evidencia

| Código | Artefacto |
| ------ | --------- |
| SUS-01 | `sus-results.json` |
| SUS-02 | `SUS_RESULTS.md` |
| SUS-03 | CSV anonimizado |
| SUS-04 | Notas del moderador (fuera del repo si contienen PII) |
