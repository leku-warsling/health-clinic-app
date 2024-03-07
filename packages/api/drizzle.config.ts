import type { Config } from "drizzle-kit";
import config from "@/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: config.database,
} satisfies Config;
