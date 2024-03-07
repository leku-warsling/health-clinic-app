import { eq, lt, lte, gt, gte, ne } from "drizzle-orm";

export const OPERATOR_MAP = {
  eq,
  lt,
  lte,
  gt,
  gte,
  ne,
};

export type OperatorKey = keyof typeof OPERATOR_MAP;
