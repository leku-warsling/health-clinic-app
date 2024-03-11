import { Icon } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import BeatLoader from "react-spinners/BeatLoader";
import { usePagination, UsePaginationState } from "@hooks";
import {
  Flex,
  FlexProps,
  Text,
  ButtonGroup,
  ButtonGroupProps,
  IconButton,
  Input,
  chakra,
  Select,
  Spacer,
} from "@chakra-ui/react";

export type PaginationOwnProps = {
  onSizeChange?: (value: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
};

export type PaginationProps = UsePaginationState &
  PaginationOwnProps &
  Omit<FlexProps, "onChange"> &
  Omit<ButtonGroupProps, "onChange" | "isAttached">;

export const Pagination = ({
  pageSizeOptions = [10, 25, 50, 100],
  showSizeChanger = false,
  isCompact = false,
  isLoading = false,
  pageSize = 10,
  size = "md",
  onSizeChange,
  isDisabled,
  boundaries,
  offset = 0,
  onChange,
  siblings,
  total,
  ...props
}: PaginationProps) => {
  const {
    canPreviousPage,
    canNextPage,
    onPrevious,
    setActive,
    pageCount,
    isActive,
    onNext,
    range,
    page,
  } = usePagination({
    boundaries,
    pageSize,
    siblings,
    onChange,
    offset,
    total,
  });

  const _onSizeChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    onSizeChange && onSizeChange(Number(e.target.value));
  };

  const renderPageSizeSelect = () => {
    if (total < pageSizeOptions[0]) return null;
    return (
      <Select
        onChange={_onSizeChange}
        value={pageSize}
        maxW="150px"
        size={size}
      >
        {pageSizeOptions.map((opt) => (
          <option key={opt} value={opt}>
            Show {opt}
          </option>
        ))}
      </Select>
    );
  };

  const renderPager = (totalNumber: number) => {
    if (isCompact) {
      return (
        <Flex align="center" gap={2} mx={2}>
          <Input
            value={page}
            type="number"
            textAlign="center"
            maxWidth="50px"
            bgColor="white"
            onChange={(e) => {
              const n = (Number(e.target.value) - 1) * pageSize;
              if (n <= totalNumber) setActive(n);
            }}
            size={size}
          />

          <Text fontSize={size}>/ {totalNumber}</Text>
        </Flex>
      );
    }

    return range.map((n, index) => {
      if (n === "dots") {
        return (
          <Icon as={BiDotsHorizontalRounded} minW={10} key={`${n}-${index}`} />
        );
      }
      return (
        <chakra.button
          key={`${n}-${index}`}
          onClick={() => setActive((n - 1) * pageSize)}
          bgColor={isActive(n) ? "primary" : "none"}
          color={isActive(n) ? "white" : "#2D2D2D"}
          fontWeight={600}
          rounded={6}
          w="40px"
          h="40px"
        >
          {n}
        </chakra.button>
      );
    });
  };

  const renderControls = () => {
    if (isLoading) {
      return (
        <chakra.div mt={2} ml={2}>
          <BeatLoader />
        </chakra.div>
      );
    }

    return (
      <ButtonGroup
        hidden={pageCount < 2}
        isDisabled={isDisabled}
        alignItems="center"
        variant="ghost"
        spacing={0}
        size={size}
      >
        <IconButton
          isDisabled={canPreviousPage}
          icon={<FiChevronLeft />}
          aria-label="previous"
          onClick={onPrevious}
        />
        {renderPager(total)}
        <IconButton
          icon={<FiChevronRight />}
          isDisabled={canNextPage}
          aria-label="next"
          onClick={onNext}
        />
      </ButtonGroup>
    );
  };

  return (
    <Flex
      justifyContent={["normal", "space-between"]}
      alignItems={["center", "flex-start"]}
      flexDirection={["column", "row"]}
      gap="4"
      {...props}
    >
      {renderControls()}
      <Spacer />
      {showSizeChanger && renderPageSizeSelect()}
    </Flex>
  );
};
