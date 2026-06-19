#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== SGOHA — Suite completa de pruebas ==="
npm run test:unit
npm run test:integration
echo ""
echo "=== Cobertura (opcional) ==="
echo "Ejecutar: npm run test:coverage"
echo ""
echo "=== Cypress (requiere frontend en :5173) ==="
echo "Terminal 1: cd frontend && npm run dev"
echo "Terminal 2: npm run test:e2e"
