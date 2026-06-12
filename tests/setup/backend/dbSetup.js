import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let mongoServer;

beforeAll(async () => {
  process.env.MONGOMS_DOWNLOAD_DIR = join(
    __dirname,
    "../../../tests/.cache/mongodb-binaries"
  );
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
}, 120000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const { collections } = mongoose.connection;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) await mongoServer.stop();
});
