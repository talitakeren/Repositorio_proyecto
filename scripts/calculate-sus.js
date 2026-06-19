#!/usr/bin/env node
/**
 * Calcula puntuaciones SUS a partir de un CSV de respuestas.
 * Uso: node scripts/calculate-sus.js [ruta-al-csv]
 * Salida: docs/reportes/usability/sus-results.json y SUS_RESULTS.md
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DEFAULT_CSV = join(ROOT, "docs/reportes/usability/sus-responses.csv");
const OUT_DIR = join(ROOT, "docs/reportes/usability");

const ODD = [1, 3, 5, 7, 9];
const EVEN = [2, 4, 6, 8, 10];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error("El CSV debe incluir cabecera y al menos una fila de datos.");
  }
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line, idx) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    row._line = idx + 2;
    return row;
  });
}

function toNum(value, field, line) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    throw new Error(`Línea ${line}: ${field} debe ser entero 1–5 (recibido: ${value})`);
  }
  return n;
}

function susScore(answers) {
  let sum = 0;
  for (const i of ODD) sum += answers[`p${i}`] - 1;
  for (const i of EVEN) sum += 5 - answers[`p${i}`];
  return sum * 2.5;
}

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function interpret(score) {
  if (score >= 80.3) return "Excelente";
  if (score >= 68) return "Bueno";
  if (score >= 50) return "Aceptable";
  return "Deficiente";
}

function groupByRole(rows) {
  const map = {};
  for (const r of rows) {
    const role = r.role || "SIN_ROL";
    if (!map[role]) map[role] = [];
    map[role].push(r);
  }
  return map;
}

function stats(scores) {
  if (!scores.length) {
    return { count: 0, average: null, median: null, min: null, max: null };
  }
  return {
    count: scores.length,
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
    median: median(scores),
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

function main() {
  const csvPath = process.argv[2] || DEFAULT_CSV;
  const raw = readFileSync(csvPath, "utf8");
  const parsed = parseCsv(raw);

  const participants = parsed.map((row) => {
    const answers = {};
    for (let i = 1; i <= 10; i++) {
      answers[`p${i}`] = toNum(row[`p${i}`], `p${i}`, row._line);
    }
    const score = susScore(answers);
    return {
      participant_id: row.participant_id || `P${row._line}`,
      role: row.role || "",
      answers,
      sus_score: score,
      interpretation: interpret(score),
      comments: row.comments || "",
    };
  });

  const allScores = participants.map((p) => p.sus_score);
  const overall = { ...stats(allScores), interpretation: interpret(stats(allScores).average ?? 0) };

  const byRole = {};
  for (const [role, items] of Object.entries(groupByRole(participants))) {
    const scores = items.map((p) => p.sus_score);
    byRole[role] = { ...stats(scores), participants: items.length };
  }

  const result = {
    generated_at: new Date().toISOString(),
    source_csv: csvPath,
    formula: {
      odd: "aporte = respuesta - 1",
      even: "aporte = 5 - respuesta",
      sus: "suma_aportes × 2.5",
    },
    participants,
    overall,
    by_role: byRole,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = join(OUT_DIR, "sus-results.json");
  writeFileSync(jsonPath, JSON.stringify(result, null, 2), "utf8");

  const md = [
    "# Resultados SUS — SGOHA",
    "",
    `> Generado: ${result.generated_at}`,
    `> Origen: \`${csvPath}\``,
    "",
    "## Resumen global",
    "",
    "| Indicador | Valor |",
    "| --------- | ----: |",
    `| Participantes | ${overall.count} |`,
    `| Promedio SUS | ${overall.average != null ? overall.average.toFixed(1) : "—"} |`,
    `| Mediana | ${overall.median != null ? overall.median.toFixed(1) : "—"} |`,
    `| Mínimo | ${overall.min ?? "—"} |`,
    `| Máximo | ${overall.max ?? "—"} |`,
    `| Interpretación | ${overall.count ? overall.interpretation : "—"} |`,
    "",
    "## Por rol",
    "",
    "| Rol | N | Promedio | Mediana |",
    "| --- | -: | -------: | ------: |",
    ...Object.entries(byRole).map(
      ([role, s]) =>
        `| ${role} | ${s.participants} | ${s.average != null ? s.average.toFixed(1) : "—"} | ${s.median != null ? s.median.toFixed(1) : "—"} |`
    ),
    "",
    "## Detalle por participante",
    "",
    "| ID | Rol | SUS | Interpretación |",
    "| -- | --- | --: | -------------- |",
    ...participants.map(
      (p) =>
        `| ${p.participant_id} | ${p.role} | ${p.sus_score.toFixed(1)} | ${p.interpretation} |`
    ),
    "",
    "## Fórmula",
    "",
    "- Impares (1,3,5,7,9): `aporte = respuesta - 1`",
    "- Pares (2,4,6,8,10): `aporte = 5 - respuesta`",
    "- `SUS = suma_aportes × 2.5` (rango 0–100)",
    "",
  ].join("\n");

  writeFileSync(join(OUT_DIR, "SUS_RESULTS.md"), md, "utf8");
  console.log(`JSON: ${jsonPath}`);
  console.log(`Markdown: ${join(OUT_DIR, "SUS_RESULTS.md")}`);
  console.log(`Participantes: ${participants.length} | Promedio SUS: ${overall.average?.toFixed(1) ?? "—"}`);
}

main();
