import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import config from "@config";

export const pool = new Pool(config.database);

const db = drizzle(pool);

async function main() {
  console.log("migrations started...");
  await migrate(db, { migrationsFolder: "./migrations" });
  console.log("migrations completed...");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});
