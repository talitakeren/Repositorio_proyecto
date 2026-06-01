import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Error: MONGO_URI no está definida en .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    });
    console.log(
      `MongoDB conectado correctamente (${mongoose.connection.name})`
    );
  } catch (error) {
    console.error("Error al conectar MongoDB:", error.message);
    if (error.code === 13 || error.codeName === "Unauthorized") {
      console.error(
        "Usa credenciales en MONGO_URI, por ejemplo:\n" +
          "mongodb://USUARIO:CONTRASEÑA@127.0.0.1:27017/HorariosAcademicos?authSource=admin"
      );
    }
    process.exit(1);
  }
};

export default connectDB;
