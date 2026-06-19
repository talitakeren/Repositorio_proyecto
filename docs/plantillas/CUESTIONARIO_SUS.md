# Cuestionario SUS — SGOHA

## Propósito

Medir la usabilidad percibida del Sistema de Generación Óptima de Horarios Académicos (SGOHA) mediante la escala **System Usability Scale (SUS)**.

## Consentimiento

Participo de forma voluntaria. Mis respuestas se usarán solo con fines académicos, sin publicar mi nombre. Puedo abandonar la sesión en cualquier momento.

## Instrucciones

1. Complete las tareas asignadas a su rol (ADMIN, TEACHER o STUDENT).
2. Responda las 10 afirmaciones según su experiencia **inmediata**.
3. Use la escala del 1 al 5 (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo).
4. No hay respuestas correctas o incorrectas.

## Datos del participante (anonimizados)

| Campo | Valor |
| ----- | ----- |
| Código participante | P___ (ej. P001) |
| Rol | ADMIN / TEACHER / STUDENT |
| Fecha | ____/____/________ |
| Tareas realizadas | (marcar en hoja del moderador) |

## Escala 1–5

| 1 | 2 | 3 | 4 | 5 |
| - | - | - | - | - |
| Totalmente en desacuerdo | | Neutral | | Totalmente de acuerdo |

## Preguntas

| # | Afirmación | 1 | 2 | 3 | 4 | 5 |
| - | ---------- | - | - | - | - | - |
| 1 | Creo que usaría este sistema con frecuencia. | | | | | |
| 2 | Encontré el sistema innecesariamente complejo. | | | | | |
| 3 | Pensé que el sistema era fácil de usar. | | | | | |
| 4 | Creo que necesitaría apoyo técnico para usar este sistema. | | | | | |
| 5 | Consideré que las funciones estaban bien integradas. | | | | | |
| 6 | Pensé que había demasiada inconsistencia. | | | | | |
| 7 | Imagino que la mayoría aprendería rápidamente. | | | | | |
| 8 | Encontré el sistema incómodo o difícil. | | | | | |
| 9 | Me sentí seguro al utilizarlo. | | | | | |
| 10 | Necesité aprender muchas cosas antes de usarlo. | | | | | |

## Observaciones abiertas

¿Qué mejoraría del sistema? _______________________________________________

## Protección de datos

- No registrar nombres completos ni correos en el CSV público.
- Almacenar datos en `docs/reportes/usability/sus-responses.csv` solo con código anónimo.
- Calcular resultados: `npm run sus:calculate`

## Referencias

- Protocolo: [`SUS_EVALUATION_PROTOCOL.md`](../reportes/usability/SUS_EVALUATION_PROTOCOL.md)
- Plantilla CSV: [`sus-responses-template.csv`](../reportes/usability/sus-responses-template.csv)
