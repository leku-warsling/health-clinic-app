import { Hono } from "hono";
import { db, schema } from "@db";
import { zValidator } from "@hono/zod-validator";
import { SQL, and, asc, sql } from "drizzle-orm";
import { querySchema } from "./patients.schema";

const { patient } = schema;

const app = new Hono();

app.get("/", zValidator("query", querySchema), async (c) => {
  const { limit, offset, sort, q, date_of_birth, clinic_id } =
    c.req.valid("query");

  const clauses: SQL[] = [];

  if (q) {
    clauses.push(q);
  }

  if (date_of_birth) {
    clauses.push(...date_of_birth);
  }

  if (clinic_id) {
    clauses.push(clinic_id);
  }

  const conditions = and(...clauses);

  const [total] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as("count"),
    })
    .from(patient)
    .where(conditions);

  const data = await db.query.patient.findMany({
    where: conditions,
    orderBy: sort && sort.length ? sort : asc(patient.id),
    limit,
    offset,
  });

  return c.json({
    total: total.count,
    data,
  });
});

export default app;
