import { test, expect, describe } from "vitest";
import app from "../app";

const basePath = "/api/v1/patients";

describe("Patient endpoints", () => {
  describe("GET /api/v1/patients", () => {
    test("Get all patients", async () => {
      const res = await app.request(basePath);
      expect(res.status).toBe(200);
    });

    test("Filter patients by clinic", async () => {
      const res = await app.request(`${basePath}?limit=10&clinic_id=2`);
      const body = await res.json();
      console.log(body);
      expect(res.status).toBe(200);
      expect(body.data).toSatisfy((patients: any) =>
        patients.every((p: any) => p.clinic_id === 2)
      );
    });

    test("Filter patients by date of birth", async () => {
      const dateOfBirthEquals = await app.request(
        `${basePath}?date_of_birth=1985-01-08`
      );
      const dateOfBirthEqualsBody = await dateOfBirthEquals.json();

      expect(dateOfBirthEquals.status).toBe(200);
      expect(dateOfBirthEqualsBody.data).toSatisfy((patients: any) =>
        patients.every((p: any) => p.date_of_birth === "1985-01-08")
      );

      const dateOfBirthGreaterThan = await app.request(
        `${basePath}?date_of_birth=gt:1985-01-08`
      );
      const dateOfBirthGreaterThanBody = await dateOfBirthGreaterThan.json();

      expect(dateOfBirthGreaterThan.status).toBe(200);
      expect(dateOfBirthGreaterThanBody.data).toSatisfy((patients: any) =>
        patients.every((p: any) => p.date_of_birth > "1985-01-08")
      );

      const dateOfBirthLessThan = await app.request(
        `${basePath}?date_of_birth=lt:1985-01-08`
      );
      const dateOfBirthLessThanBody = await dateOfBirthLessThan.json();

      expect(dateOfBirthLessThan.status).toBe(200);
      expect(dateOfBirthLessThanBody.data).toSatisfy((patients: any) =>
        patients.every((p: any) => p.date_of_birth < "1985-01-08")
      );

      const dateOfBirthBetween = await app.request(
        `${basePath}?date_of_birth=gte:1980-01-01,lte:1990-01-01`
      );
      const dateOfBirthBetweenBody = await dateOfBirthBetween.json();

      expect(dateOfBirthBetween.status).toBe(200);
      expect(dateOfBirthBetweenBody.data).toSatisfy((patients: any) =>
        patients.every(
          (p: any) =>
            p.date_of_birth >= "1980-01-01" && p.date_of_birth <= "1990-01-01"
        )
      );
    });
  });
});
