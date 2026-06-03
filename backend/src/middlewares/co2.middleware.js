import { co2 } from "@tgwf/co2";

const swd = new co2({ model: "swd" });

let totalRequests = 0;
let totalBytes = 0;
let totalCO2 = 0;
const endpointStats = new Map();

export function co2Middleware(req, res, next) {
  let bytesSent = 0;

  const originalWrite = res.write.bind(res);
  res.write = function (chunk, encoding, callback) {
    if (chunk) {
      bytesSent += Buffer.isBuffer(chunk)
        ? chunk.length
        : Buffer.byteLength(chunk, typeof encoding === "string" ? encoding : "utf8");
    }
    return originalWrite(chunk, encoding, callback);
  };

  const originalEnd = res.end.bind(res);
  res.end = function (chunk, encoding, callback) {
    if (chunk && typeof chunk !== "function") {
      bytesSent += Buffer.isBuffer(chunk)
        ? chunk.length
        : Buffer.byteLength(chunk, typeof encoding === "string" ? encoding : "utf8");
    }

    const co2Grams = swd.perByte(bytesSent);
    const route = `${req.method} ${req.path}`;

    totalRequests++;
    totalBytes += bytesSent;
    totalCO2 += co2Grams;

    if (!endpointStats.has(route)) {
      endpointStats.set(route, { count: 0, bytes: 0, co2: 0 });
    }
    const ep = endpointStats.get(route);
    ep.count++;
    ep.bytes += bytesSent;
    ep.co2 += co2Grams;

    const fecha = new Date().toLocaleString("es-PE");
    console.log(
      `[CO2] ${fecha} | ${req.method.padEnd(6)} ${req.path.padEnd(38)} | HTTP ${res.statusCode} | ${bytesSent} B | ${co2Grams.toFixed(9)} g CO2`
    );

    return originalEnd(chunk, encoding, callback);
  };

  next();
}

export function printCO2Dashboard() {
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║         DASHBOARD GREEN SOFTWARE — SGOHA             ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Total solicitudes  : ${String(totalRequests).padEnd(30)}║`);
  console.log(`║  Total bytes        : ${String(totalBytes + " B").padEnd(30)}║`);
  console.log(`║  CO2 Total          : ${String(totalCO2.toFixed(9) + " g").padEnd(30)}║`);
  const avg = totalRequests > 0 ? (totalCO2 / totalRequests).toFixed(9) : "0";
  console.log(`║  CO2 Promedio/req   : ${String(avg + " g").padEnd(30)}║`);
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  DETALLE POR ENDPOINT                                ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  const sorted = [...endpointStats.entries()].sort((a, b) => b[1].co2 - a[1].co2);
  for (const [route, stats] of sorted) {
    const r = route.substring(0, 38).padEnd(38);
    console.log(`║  ${r}              ║`);
    console.log(`║    Reqs: ${String(stats.count).padEnd(4)} Bytes: ${String(stats.bytes + "B").padEnd(9)} CO2: ${stats.co2.toFixed(9)} g ║`);
  }
  console.log("╚══════════════════════════════════════════════════════╝\n");
}