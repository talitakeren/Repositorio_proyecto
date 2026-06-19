# Ejecución local SonarQube — SGOHA

## Contexto

Ejecución real del análisis SonarQube en entorno local Docker para el proyecto `sgoha`.

## Comandos ejecutados

```bash
docker compose -f docker-compose.sonar.yml up -d
docker compose -f docker-compose.sonar.yml ps
curl -sf http://localhost:9000/api/system/status
docker run --rm -v "$PWD:/usr/src" -w /usr/src \
  sonarsource/sonar-scanner-cli:latest \
  sonar-scanner -Dsonar.host.url=http://host.docker.internal:9000 -Dsonar.token=<TOKEN_TEMPORAL>
curl -u "<TOKEN_TEMPORAL>:" \
  "http://localhost:9000/api/qualitygates/project_status?projectKey=sgoha"
```

> El token utilizado fue temporal y se revocó al finalizar la ejecución.

## Resultado de ejecución

| Verificación | Resultado |
| ------------ | --------- |
| Estado API Sonar | `UP` |
| Scanner | `ANALYSIS SUCCESSFUL` |
| Proyecto | `sgoha` |
| Quality Gate | `OK` |
| Issues reportadas | `784` |

## Métricas consultadas (API `measures`)

| Métrica | Valor |
| ------- | ----- |
| Bugs | 4 |
| Vulnerabilities | 3 |
| Security Hotspots | 7 |
| Code Smells | 777 |
| Duplicated Lines Density | 1.4 % |
| Coverage | 15.5 % |
| Reliability Rating | 4.0 (D) |
| Security Rating | 5.0 (E) |
| Maintainability Rating | 1.0 (A) |
| Technical Debt (`sqale_index`) | 3794 |
| Cognitive Complexity | 1555 |
| LOC (`ncloc`) | 19750 |

## Interpretación técnica rápida

- El Quality Gate en `OK` indica que el proyecto cumple el criterio activo en instancia.
- Existen hallazgos de seguridad y confiabilidad que requieren plan de remediación.
- La cobertura reportada por Sonar (15.5 %) difiere de Jest consolidado (30.3 %) por alcance de fuentes y forma de cómputo en plataforma.

## Relación con el informe principal

Resultados incorporados en:

- `docs/INFORME_TECNICO_INTEGRAL_7_2.md` (apartado 7.2.a)
- `docs/plantillas/MATRIZ_HALLAZGOS.md` (hallazgos Sonar y métricas)
