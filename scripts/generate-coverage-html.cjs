/**
 * Fusiona los coverage-final.json de cada suite Jest y genera
 * un reporte HTML consolidado en tests/reports/coverage/html/index.html
 * más un índice en tests/reports/coverage/index.html.
 */
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const libCoverage = require("istanbul-lib-coverage");
const libReport = require("istanbul-lib-report");
const reports = require("istanbul-reports");

const ROOT = join(__dirname, "..");
const COV_ROOT = join(ROOT, "tests/reports/coverage");

const SUITE_DIRS = [
  { dir: "backend-unit", label: "Backend — unitarias" },
  { dir: "backend-integration", label: "Backend — integración API" },
  { dir: "frontend-unit", label: "Frontend — unitarias" },
  { dir: "frontend-integration", label: "Frontend — integración MSW" },
];

const map = libCoverage.createCoverageMap({});

for (const { dir } of SUITE_DIRS) {
  const jsonPath = join(COV_ROOT, dir, "coverage-final.json");
  if (existsSync(jsonPath)) {
    map.merge(JSON.parse(readFileSync(jsonPath, "utf8")));
  }
}

if (map.files().length === 0) {
  console.warn(
    "No se encontraron coverage-final.json. Ejecuta primero: npm run test:coverage"
  );
  process.exit(1);
}

const htmlDir = join(COV_ROOT, "html");
mkdirSync(htmlDir, { recursive: true });

const htmlContext = libReport.createContext({ dir: htmlDir, coverageMap: map });
reports.create("html", { subdir: "." }).execute(htmlContext);

const summaryContext = libReport.createContext({ dir: COV_ROOT, coverageMap: map });
reports.create("json-summary", { subdir: "." }).execute(summaryContext);

const suiteLinks = SUITE_DIRS.filter(({ dir }) =>
  existsSync(join(COV_ROOT, dir, "index.html"))
)
  .map(
    ({ dir, label }) =>
      `    <li><a href="${dir}/index.html">${label}</a></li>`
  )
  .join("\n");

const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=html/index.html" />
  <title>SGOHA — Cobertura de pruebas</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
    a { color: #2563eb; }
    ul { line-height: 1.8; }
  </style>
</head>
<body>
  <h1>SGOHA — Reportes de cobertura</h1>
  <p><a href="html/index.html"><strong>Abrir reporte HTML consolidado</strong></a></p>
  <h2>Reportes por suite</h2>
  <ul>
${suiteLinks}
  </ul>
  <p><small>Generado: ${new Date().toISOString()}</small></p>
</body>
</html>
`;

writeFileSync(join(COV_ROOT, "index.html"), indexHtml, "utf8");

console.log(`Reporte HTML consolidado: ${join(COV_ROOT, "html/index.html")}`);
console.log(`Índice de cobertura:       ${join(COV_ROOT, "index.html")}`);
