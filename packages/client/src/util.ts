import { z, ZodRawShape } from "zod";

export const parseEnvVariables = <T extends ZodRawShape>(shape: T) => {
  const parsed = z.object(shape).safeParse(import.meta.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4),
    );

    throw new Error("Invalid / Missing environment variables");
  }

  return parsed.data;
};
