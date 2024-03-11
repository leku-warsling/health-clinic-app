import { SortableColumn } from "./components";
import type { TableProps } from "./table.types";
import { getCell, getHeaderProps } from "./table.util";
import { ReactNode } from "react";
import {
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Thead,
  Td,
  Th,
  Tr,
  Text,
} from "@chakra-ui/react";

const getOrder = (current?: "asc" | "desc") => {
  if (!current) return "asc";
  return current === "asc" ? "desc" : undefined;
};

export const Table = <D extends object>({
  columns,
  data,
  size = "md",
  sortBy,
  onSort,
  ...props
}: TableProps<D>) => {
  const headers = columns.map((col, idx: number) => {
    const id = col.id || String(col.accessor);

    let title: ReactNode = (
      <Text as="span" py={4}>
        {col.title}
      </Text>
    );

    if (col.isSortable && onSort) {
      title = (
        <SortableColumn
          isSorted={col.accessor === sortBy?.column}
          orderBy={sortBy?.order}
          onClick={() => onSort(id)}
        >
          {title}
        </SortableColumn>
      );
    }

    return (
      <Th
        key={`${col.title}-${idx}`}
        fontSize="sm"
        py={0}
        color="white"
        {...getHeaderProps(col)}
      >
        {title}
      </Th>
    );
  });

  const rows = data.map((row, rowIdx) => {
    const cells = columns.map((cell, cellIdx) => (
      <Td key={`${cell.title}-${rowIdx}-${cellIdx}`}>
        {getCell(cell, row, rowIdx)}
      </Td>
    ));
    return <Tr key={rowIdx}>{cells}</Tr>;
  });

  return (
    <TableContainer width="100%" {...props}>
      <ChakraTable size={size}>
        <Thead bg="primary">
          <Tr>{headers}</Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </ChakraTable>
    </TableContainer>
  );
};
