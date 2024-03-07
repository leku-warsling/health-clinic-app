import { Hono } from "hono";
import patients from "./patients";
import clinics from "./clinics";
import { StatusCode } from "hono/utils/http-status";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api/v1");

app.use(logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.route("/patients", patients);
app.route("/clinics", clinics);

app.onError((err, c) => {
  console.error(err);
  let statusCode: StatusCode = 500;
  let res = { error: err.message };
  //TODO: determine return status based on error/exception/instance
  return c.json(res, statusCode);
});

export default app;
