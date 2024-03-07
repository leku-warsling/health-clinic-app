import { client } from "@api";
import { AxiosRequestConfig } from "axios";
import { ClinicSchema, PatientListSchema } from "./patients.schema";
import { z } from "zod";

export const getPatients = async (config: AxiosRequestConfig = {}) => {
  const res = await client.get("/patients", config);
  return PatientListSchema.parse(res.data);
};

export const getClinics = async (config: AxiosRequestConfig = {}) => {
  const res = await client.get("/clinics", config);
  return z.array(ClinicSchema).parse(res.data);
};
