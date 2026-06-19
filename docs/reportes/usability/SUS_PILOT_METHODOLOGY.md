# Metodología piloto SUS — SGOHA

> Evaluación piloto **metodológica** — instrumento y cálculo verificados; no constituye evaluación con usuarios reales del sistema.

## Objetivo del piloto

Validar que el cuestionario, la plantilla CSV y el script `scripts/calculate-sus.js` producen puntuaciones SUS correctas antes de aplicar el protocolo con participantes.

## Ejemplo demostrativo (no representa usuarios reales)

**Participante ficticio:** `DEMO-01` · **Rol:** TEACHER · **Respuestas:** 4,2,4,1,4,2,4,2,4,2

| Pregunta | Tipo | Respuesta | Aporte |
| -------- | ---- | --------: | -----: |
| p1 | Impar | 4 | 3 |
| p2 | Par | 2 | 3 |
| p3 | Impar | 4 | 3 |
| p4 | Par | 1 | 4 |
| p5 | Impar | 4 | 3 |
| p6 | Par | 2 | 3 |
| p7 | Impar | 4 | 3 |
| p8 | Par | 2 | 3 |
| p9 | Impar | 4 | 3 |
| p10 | Par | 2 | 3 |

**Suma aportes:** 31 · **SUS:** 31 × 2,5 = **77,5** → interpretación *Bueno* (≥ 68).

> ⚠️ Este ejemplo es **únicamente matemático** para verificar la fórmula documentada en [`SUS_ANALYSIS.md`](./SUS_ANALYSIS.md).

## Verificación del script

```bash
# Crear CSV de prueba con una fila completada (valores del ejemplo anterior)
npm run sus:calculate -- docs/reportes/usability/sus-demo.csv
```

Salida esperada: `sus-results.json` y `SUS_RESULTS.md` con SUS 77,5 para esa fila.

## Criterios de éxito del piloto

- [x] Cuestionario de 10 ítems en escala 1–5
- [x] Plantilla CSV con columnas estándar
- [x] Script valida rango 1–5 y calcula promedio/mediana por rol
- [ ] Aplicación con ≥ 5 participantes reales — 🧑‍💻 Validación humana posterior
