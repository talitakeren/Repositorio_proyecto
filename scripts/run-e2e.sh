#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! curl -sf http://localhost:5173 >/dev/null 2>&1; then
  echo "⚠️  Levanta el frontend: cd frontend && npm run dev"
  exit 1
fi

npm run test:acceptance
npm run test:e2e
