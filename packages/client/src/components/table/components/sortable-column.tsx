import { SortableColumnProps } from "../table.types";
import { Flex, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";

export const SortableColumn: FC<SortableColumnProps> = ({
  isSorted,
  orderBy,
  children,
  ...props
}) => (
  <Flex
    _hover={{ cursor: "pointer" }}
    align="center"
    as="span"
    gap={2}
    {...props}
  >
    {children}
    <Flex align="center" direction="column" fontSize="20px" gap={0}>
      <Icon
        as={RiArrowDropUpFill}
        opacity={isSorted && orderBy === "asc" ? 1 : 0.5}
        mb="-12px"
      />
      <Icon
        as={RiArrowDropDownFill}
        opacity={isSorted && orderBy == "desc" ? 1 : 0.5}
      />
    </Flex>
  </Flex>
);
