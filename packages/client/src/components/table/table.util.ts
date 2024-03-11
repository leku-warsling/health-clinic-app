import type { Column } from "./table.types";
import { get, isString } from "lodash-es";
import { omit } from "ramda";

const getHeaderProps = omit(["title", "accessor", "render", "isSortable"]);

const getCell = <D extends object>(
  { accessor, render }: Column<D>,
  row: D,
  index: number,
) => {
  const value = isString(accessor) ? get(row, accessor) : accessor(row);
  return render ? render(value, row, index) : value;
};

export { getCell, getHeaderProps };
