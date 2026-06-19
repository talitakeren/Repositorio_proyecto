#!/usr/bin/env bash
# Genera reportes npm audit en docs/reportes/security/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/docs/reportes/security"
mkdir -p "$OUT"

echo "=== npm audit — frontend ==="
(cd "$ROOT/frontend" && npm audit --json > "$OUT/frontend-npm-audit.json" 2>/dev/null) || true
(cd "$ROOT/frontend" && npm audit 2>&1 | tee "$OUT/frontend-npm-audit.txt") || true

echo ""
echo "=== npm audit — backend ==="
(cd "$ROOT/backend" && npm audit --json > "$OUT/backend-npm-audit.json" 2>/dev/null) || true
(cd "$ROOT/backend" && npm audit 2>&1 | tee "$OUT/backend-npm-audit.txt") || true

echo ""
echo "Reportes guardados en: $OUT"
