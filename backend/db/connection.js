import "../config/loadEnv.js";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || process.env.ATLAS_URI || "";
const dbName = process.env.MONGO_DB_NAME || "HorariosAcademicos";

if (!uri) {
  console.error(
    "Error: no hay URI de MongoDB. Define MONGO_URI en .env (copia desde .env.example)."
  );
  process.exit(1);
}

const client = new MongoClient(uri);

let db;

try {
  await client.connect();
  db = client.db(dbName);
  await db.command({ ping: 1 });

  // Comprueba permiso de escritura (insert sin auth falla aunque ping funcione)
  const probe = await db.collection("_connection_probe").insertOne({
    checkedAt: new Date(),
  });
  await db.collection("_connection_probe").deleteOne({ _id: probe.insertedId });

  console.log(`MongoDB conectado correctamente (base de datos: "${dbName}")`);
} catch (error) {
  console.error("Error al conectar con MongoDB:", error.message);
  if (error.code === 13 || error.codeName === "Unauthorized") {
    console.error(
      "MongoDB exige autenticación. En .env usa por ejemplo:\n" +
        "MONGO_URI=mongodb://USUARIO:CONTRASEÑA@127.0.0.1:27017/HorariosAcademicos?authSource=admin"
    );
  } else {
    console.error(
      "Verifica que el contenedor Docker esté activo (mongo-local) y que MONGO_URI sea correcta."
    );
  }
  process.exit(1);
}

export default db;
