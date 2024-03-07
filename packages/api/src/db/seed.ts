import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import path from "path";
import { parse } from "csv-parse";
import { clinic, patient } from "./schema";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import config from "@config";

const pool = new Pool(config.database);

const db = drizzle(pool);

function CSVMapper<T, U>(path: string, fn: (value: T) => U): Promise<U[]> {
  return new Promise((resolve, reject) => {
    const arr: U[] = [];
    const stream = fs.createReadStream(path).pipe(parse({ columns: true }));
    stream.on("data", (row) => arr.push(fn(row)));
    stream.on("end", () => {
      resolve(arr);
    });
    stream.on("error", (error) => reject(error));
  });
}

const createClinic = (value: any) => ({
  name: value.name,
  contact_number: faker.helpers.replaceSymbols("0## #### ####"),
  email: `info@${value.name.toLowerCase().replace(/\s+/g, "-")}.com`,
  address: faker.location.streetAddress(),
});

const createPatient = (value: any) => ({
  clinic_id: value.clinic_id,
  first_name: value.first_name,
  last_name: value.last_name,
  date_of_birth: value.date_of_birth,
  contact_number: faker.helpers.replaceSymbols("0## #### ####"),
  email: `${value.first_name}.${value.last_name}@gmail.com`
    .toLowerCase()
    .replaceAll(/[\s+'"_\-&<>+=]/g, ""),
  address: faker.location.streetAddress(),
});

const clinicCSVPath = path.join(__dirname, "/resources/clinics.csv");

const patientCSVPaths = [
  path.join(__dirname, "/resources/patients-1.csv"),
  path.join(__dirname, "/resources/patients-2.csv"),
];

const resetTable = (...tableNames: string[]) => {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${tableNames.join(", ")} RESTART IDENTITY`),
  );
};

async function main() {
  console.log("seeding started!");

  await resetTable("clinic", "patient");

  const clinics = await CSVMapper(clinicCSVPath, createClinic);

  await db.insert(clinic).values(clinics);

  const promises = patientCSVPaths.map(async (path) => {
    const patients = await CSVMapper(path, createPatient);
    return await db.insert(patient).values(patients);
  });

  await Promise.all(promises);
  console.log("seeding finished!");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
