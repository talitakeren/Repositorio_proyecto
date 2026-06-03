import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";
import { timeslotService } from "./services/timeslot.service.js";
import { printCO2Dashboard } from "./middlewares/co2.middleware.js";

const PORT = process.env.PORT || 5001;

await connectDB();

try {
  const sync = await timeslotService.syncOfficial();
  console.log(
    `Franjas HORALV sincronizadas: ${sync.total} total (${sync.created} nuevas, ${sync.removed} obsoletas eliminadas)`
  );
} catch (err) {
  console.warn(
    "Advertencia: no se pudo sincronizar franjas HORALV:",
    err.message
  );
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// ... al final del archivo:
process.on("SIGINT", () => { printCO2Dashboard(); process.exit(0); });