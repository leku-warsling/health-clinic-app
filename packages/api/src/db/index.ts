import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "@config";
import * as schema from "./schema";

const client = new Client(config.database);

client.connect();

const db = drizzle(client, { schema });

export { db, schema };
