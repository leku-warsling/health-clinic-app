import { z } from "zod";
import { parseEnvVariables } from "@util";

const env = parseEnvVariables({
  VITE_API_URL: z.string().default("http://localhost:3000/api/v1"),
});

export default {
  api: {
    url: env.VITE_API_URL,
  },
};
