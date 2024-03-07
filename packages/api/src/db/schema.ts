import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const clinic = pgTable("clinic", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  contact_number: text("contact_number").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  clinic_id: integer("clinic_id")
    .notNull()
    .references(() => clinic.id),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  date_of_birth: date("date_of_birth").notNull(),
  contact_number: text("contact_number").notNull(),
  email: text("email").notNull().unique(),
  address: text("address").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const clinicRelations = relations(clinic, ({ many }) => ({
  patients: many(patient),
}));

export const patientRelations = relations(patient, ({ one }) => ({
  clinic: one(clinic, {
    fields: [patient.clinic_id],
    references: [clinic.id],
  }),
}));
