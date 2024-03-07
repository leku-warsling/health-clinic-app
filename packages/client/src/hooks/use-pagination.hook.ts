import equals from "ramda/es/equals";
import { useMemo } from "react";

export type UsePaginationState = {
  onChange?: (value: number) => void;
  boundaries?: number;
  siblings?: number;
  pageSize?: number;
  total: number | null;
  current: number;
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
  siblings = 1,
  current = 1,
  total,
}: UsePaginationState) => {
  const onPrevious = () => onChange(current - 1);
  const onNext = () => onChange(current + 1);
  const canNextPage = total ? current + 1 > total : false;
  const canPreviousPage = current - 1 < 1;

  const paginationRange = useMemo((): (number | "dots")[] => {
    if (!total) return [];
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

    if (totalPageNumbers >= total) {
      return range(1, total);
    }

    const leftSiblingIndex = Math.max(current - siblings, boundaries);
    const rightSiblingIndex = Math.min(current + siblings, total - boundaries);

    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [
        ...range(1, leftItemCount),
        DOTS,
        ...range(total - (boundaries - 1), total),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings;
      return [
        ...range(1, boundaries),
        DOTS,
        ...range(total - rightItemCount, total),
      ];
    }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(total - boundaries + 1, total),
    ];
  }, [total, siblings, current, boundaries]);

  return {
    range: paginationRange,
    isActive: equals(current),
    setActive: (n: number) => {
      onChange(n);
    },
    canPreviousPage,
    canNextPage,
    onPrevious,
    onNext,
  };
};
