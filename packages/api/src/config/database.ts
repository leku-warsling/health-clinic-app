import { z } from "zod";
import { envValidator } from "../util";
import "dotenv/config";

const env = envValidator({
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.string().pipe(z.coerce.number().default(5432)),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("secret"),
  DB_NAME: z.string().default("clinic_db"),
});

export default {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
};
