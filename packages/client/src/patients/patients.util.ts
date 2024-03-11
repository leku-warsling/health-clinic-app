import { equals, where, prop, isEmpty, either, assoc } from "ramda";
import { flow } from "fp-ts/lib/function";

const isEmptyResult = where({
  isLoading: equals(false),
  data: flow(prop("data"), isEmpty),
});

const isRequesting = either(prop("isLoading"), prop("isFetching"));

const resetOffset = assoc("offset", 0);

export { isEmptyResult, isRequesting, resetOffset };
