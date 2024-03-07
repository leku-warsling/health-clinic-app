import { z } from "zod";

const ClinicSchema = z.object({
  id: z.number(),
  name: z.string(),
  contact_number: z.string(),
  email: z.string().email(),
  address: z.string(),
  created_at: z.string().pipe(z.coerce.date()),
  updated_at: z.string().pipe(z.coerce.date()),
});

const PatientSchema = z.object({
  id: z.number(),
  clinic_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string().pipe(z.coerce.date()),
  contact_number: z.string(),
  email: z.string().email(),
  address: z.string(),
  created_at: z.string().pipe(z.coerce.date()),
  updated_at: z.string().pipe(z.coerce.date()),
});

const PatientListSchema = z.object({
  total: z.number(),
  data: z.array(PatientSchema),
});

const PatientParamsSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  sort: z
    .object({
      column: z.string(),
      order: z.enum(["asc", "desc"]),
    })
    .transform((sort) => {
      if (sort.order === "desc") {
        return `-${sort.column}`;
      }
      return sort.column;
    })
    .optional(),
  q: z.string().optional(),
  date_of_birth: z
    .object({
      gte: z.string().optional(),
      lte: z.string().optional(),
    })
    .transform((dob) => {
      return Object.entries(dob)
        .map(([op, value]) => `${op}:${value}`)
        .join(",");
    })
    .optional(),
  clinic_id: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;
export { ClinicSchema, PatientSchema, PatientListSchema, PatientParamsSchema };
