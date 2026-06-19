import { spawn } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { estimateCo2Impact, formatCo2Report } from "../tests/utils/co2Impact.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const reportsDir = join(__dirname, "../tests/reports/coverage-summary");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const child = spawn(cmd, args, { stdio: "inherit", cwd: join(__dirname, "..") });
    child.on("close", (code) => resolve({ code, durationMs: Date.now() - start }));
    child.on("error", reject);
  });
}

async function main() {
  console.log("\n🌱 SGOHA — Impacto CO₂ en ejecución de pruebas\n");
  const start = Date.now();
  await run("npm", ["run", "test:unit"]);
  await run("npm", ["run", "test:integration"]);
  const impact = estimateCo2Impact(Date.now() - start);

  mkdirSync(reportsDir, { recursive: true });
  const report = { suite: "full", timestamp: new Date().toISOString(), ...impact };
  writeFileSync(join(reportsDir, "co2-impact.json"), JSON.stringify(report, null, 2));

  console.log("\n── CO₂ estimado ──");
  console.log(formatCo2Report(impact));
  console.log(`Reporte: ${join(reportsDir, "co2-impact.json")}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
