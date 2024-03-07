import { z, ZodRawShape } from "zod";
import { reduce, split, startsWith, test } from "ramda";
import { get } from "lodash-es";
import { SQL, or, ilike, asc, desc } from "drizzle-orm";
import { pipe } from "fp-ts/lib/function";
import { OPERATOR_MAP, OperatorKey } from "@constants";
import { PgColumn, PgTable } from "drizzle-orm/pg-core";

const envValidator = <T extends ZodRawShape>(shape: T) => {
  const parsed = z.object(shape).safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4)
    );

    throw new Error("Invalid / Missing environment variables");
  }

  return parsed.data;
};

const hasBinaryOperator = test(/^(eq|lt|lte|gt|gte|ne):/g);
const hasDescendingOperator = startsWith("-");
const isValidDate = test(/^\d{4}-\d{2}-\d{2}$/);

/**
 * Given a column and value predicate, returns a function
 * that takes a comma separated list with optional binary
 * operator foolowed by a colon and generates a SQL WHERE clause
 *
 * @example
 * createQueryFilter(column)("gt:2021-01-01,lt:2021-12-31")
 * => [gt(column, "2021-01-01"), lt(column, "2021-12-31")]
 * SQL output => column > '2021-01-01' AND column < '2021-12-31'
 *
 */
const createQueryFilter = (
  column: PgColumn,
  isValid: (v: string) => boolean
) => {
  const parseFilterString = (arr: SQL[], str: string) => {
    const [op, value] = hasBinaryOperator(str) ? str.split(":") : ["eq", str];

    if (isValid(value)) {
      const operatorFn = OPERATOR_MAP[op as OperatorKey];
      arr.push(operatorFn(column, value));
    } else {
      console.error(
        `Invalid filter value: ${value} for column: ${column.name}`
      );
    }

    return arr;
  };

  return (str: string) => pipe(str, split(","), reduce(parseFilterString, []));
};

/**
 * Given a table, returns a function that takes an array of columns
 * with optional minus prefix for descending order and
 * generates a SQL ORDER BY condition
 *
 * @example
 * createQueryOrder(table)(["-col1", "col2"])
 * => [desc(col1), asc(col2)]
 * SQL output => ORDER BY col1 DESC, col2 ASC
 *
 */
const createQueryOrder = (table: PgTable) => {
  return (stringArray: string[]) => {
    return stringArray.reduce((SQLArray: SQL[], item) => {
      const [sortBy, column] = hasDescendingOperator(item)
        ? [desc, item.slice(1)]
        : [asc, item];

      if (column in table) {
        SQLArray.push(sortBy(get(table, column)));
      }

      return SQLArray;
    }, []);
  };
};

/**
 * Given a list of columns, returns a function that takes a search term and
 * generates a SQL OR clause of case-insensitive LIKE comparisons
 *
 * @example
 * createQuerySearch([col1, col2])("term")
 * => or(ilike(col1, "%term%"), ilike(col2, "%term%"))
 * SQL output => col1 ILIKE '%term%' OR col2 ILIKE '%term%'
 *
 */
const createQuerySearch = (columns: PgColumn[]) => {
  return (str: string) => {
    const term = `%${str}%`;
    return or(...columns.map((column) => ilike(column, term)));
  };
};

export {
  envValidator,
  hasBinaryOperator,
  hasDescendingOperator,
  isValidDate,
  createQueryFilter,
  createQueryOrder,
  createQuerySearch,
};
