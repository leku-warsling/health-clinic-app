import { Hono } from "hono";
import { db } from "../db";

const app = new Hono();

app.get("/", async (c) => {
  const clinics = await db.query.clinic.findMany();
  return c.json(clinics);
});

app.get("/:id{[0-9]+}/patients", async (c) => {
  const { id } = c.req.param();
  const clinics = await db.query.clinic.findFirst({
    with: {
      patients: true,
    },
    where: (c, { eq }) => eq(c.id, Number(id)),
  });
  return c.json(clinics);
});

export default app;
