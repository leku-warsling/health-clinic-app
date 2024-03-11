import equals from "ramda/es/equals";
import { useMemo } from "react";

export type UsePaginationState = {
  onChange?: (value: number) => void;
  boundaries?: number;
  siblings?: number;
  pageSize?: number;
  total: number;
  offset: number;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};

const DOTS = "dots";
const noop = () => {};

export const usePagination = ({
  onChange = noop,
  boundaries = 1,
  pageSize = 10,
  siblings = 1,
  offset = 0,
  total,
}: UsePaginationState) => {
  console.log(pageSize);
  const pageCount = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  );
  const page = Math.ceil(offset / pageSize) + 1;
  const onPrevious = () => onChange(offset - pageSize);
  const onNext = () => onChange(offset + pageSize);
  const canNextPage = page + 1 > pageCount;
  const canPreviousPage = page - 1 < 1;

  const paginationRange = useMemo((): (number | "dots")[] => {
    if (!pageCount) return [];
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

    if (totalPageNumbers >= pageCount) {
      return range(1, pageCount);
    }

    const leftSiblingIndex = Math.max(page - siblings, boundaries);
    const rightSiblingIndex = Math.min(page + siblings, pageCount - boundaries);

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots =
      rightSiblingIndex < pageCount - (boundaries + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [
        ...range(1, leftItemCount),
        DOTS,
        ...range(pageCount - (boundaries - 1), pageCount),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings;
      return [
        ...range(1, boundaries),
        DOTS,
        ...range(pageCount - rightItemCount, pageCount),
      ];
    }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(pageCount - boundaries + 1, pageCount),
    ];
  }, [pageCount, siblings, page, boundaries]);

  return {
    range: paginationRange,
    isActive: equals(page),
    setActive: (n: number) => {
      onChange(n);
    },
    canPreviousPage,
    canNextPage,
    onPrevious,
    pageCount,
    onNext,
    page,
  };
};
