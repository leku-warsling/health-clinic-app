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
  variant = "ghost",
  size = "md",
  onSizeChange,
  isDisabled,
  boundaries,
  onChange,
  siblings,
  current,
  total,
  ...props
}: PaginationProps) => {
  const {
    canPreviousPage,
    canNextPage,
    onPrevious,
    setActive,
    isActive,
    onNext,
    range,
  } = usePagination({
    boundaries,
    siblings,
    onChange,
    current,
    total,
  });

  const _onSizeChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    onSizeChange && onSizeChange(Number(e.target.value));
  };

  const renderPageSizeSelect = () => {
    if (!total) {
      return null;
    }

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
            value={current}
            textAlign="center"
            maxWidth="50px"
            bgColor="white"
            onChange={(e) => {
              const n = Number(e.target.value);
              if (n <= totalNumber) setActive(n);
            }}
            size={size}
            borderColor="#121212"
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
          onClick={() => setActive(n)}
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

    if (!total) {
      return null;
    }

    return (
      <ButtonGroup
        isDisabled={isDisabled}
        alignItems="center"
        variant={variant}
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
      alignItems={["center", "flex-start"]}
      flexDirection={["column", "row"]}
      gap="4"
      justifyContent={["normal", "space-between"]}
      {...props}
    >
      {renderControls()}
      {showSizeChanger && renderPageSizeSelect()}
    </Flex>
  );
};
