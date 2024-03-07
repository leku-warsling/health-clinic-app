import { split } from "ramda";
import { schema } from "@db";
import z from "zod";
import { eq } from "drizzle-orm";
import {
  isValidDate,
  createQueryFilter,
  createQuerySearch,
  createQueryOrder,
} from "@util";

const { patient } = schema;

// Validates URL query parameters and transforms them into SQL clauses
const querySchema = z.object({
  limit: z.string().pipe(z.coerce.number()).default("10"),
  offset: z.string().pipe(z.coerce.number()).default("0"),
  sort: z
    .string()
    .transform(split(","))
    .pipe(z.array(z.string()))
    .transform(createQueryOrder(patient))
    .optional(),
  q: z
    .string()
    .transform(
      createQuerySearch([patient.first_name, patient.last_name, patient.email])
    )
    .optional(),
  date_of_birth: z
    .string()
    .transform(createQueryFilter(patient.date_of_birth, isValidDate))
    .optional(),
  clinic_id: z
    .string()
    .pipe(z.coerce.number())
    .transform((id) => eq(patient.clinic_id, id))
    .optional(),
});

export { querySchema };
