# Resultados SUS — SGOHA

> ⚠️ **Ejemplo demostrativo de cálculo** — origen `sus-demo.csv`. **No representa evaluación con usuarios reales de SGOHA.** Para resultados reales, usar `sus-responses.csv` tras el protocolo publicado.

> Generado: 2026-06-17T22:55:32.142Z

## Resumen global

| Indicador | Valor |
| --------- | ----: |
| Participantes | 1 |
| Promedio SUS | 77.5 |
| Mediana | 77.5 |
| Mínimo | 77.5 |
| Máximo | 77.5 |
| Interpretación | Bueno |

## Por rol

| Rol | N | Promedio | Mediana |
| --- | -: | -------: | ------: |
| TEACHER | 1 | 77.5 | 77.5 |

## Detalle por participante

| ID | Rol | SUS | Interpretación |
| -- | --- | --: | -------------- |
| DEMO-01 | TEACHER | 77.5 | Bueno |

## Fórmula

- Impares (1,3,5,7,9): `aporte = respuesta - 1`
- Pares (2,4,6,8,10): `aporte = 5 - respuesta`
- `SUS = suma_aportes × 2.5` (rango 0–100)
