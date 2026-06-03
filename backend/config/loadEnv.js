import dotenv from "dotenv";
import { existsSync } from "fs";

if (existsSync(".env")) {
  dotenv.config();
} else if (existsSync("config.env")) {
  dotenv.config({ path: "config.env" });
}
