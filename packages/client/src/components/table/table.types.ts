import {
  TableContainerProps,
  TableColumnHeaderProps,
  FlexProps,
} from "@chakra-ui/react";

type Column<D extends object> = TableColumnHeaderProps & {
  id?: string;
  title: React.ReactNode;
  accessor: string | ((record: D) => any);
  isSortable?: boolean;
  render?: (value: any, record: D, index: number) => React.ReactNode;
};

type SortBy = {
  column: string;
  order: "asc" | "desc";
};

type TableProps<D extends object> = TableContainerProps & {
  onSort?: (column: string) => void;
  size?: "sm" | "md" | "lg";
  columns: Column<D>[];
  data: D[];
  sortBy?: {
    column?: string;
    order?: "asc" | "desc";
  };
};

type SortableColumnProps = FlexProps & {
  isSorted?: boolean;
  orderBy?: "asc" | "desc";
};

export type { Column, SortBy, TableProps, SortableColumnProps };
