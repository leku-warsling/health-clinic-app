import {
  Input,
  InputProps,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";
import { forwardRef } from "react";

export type SearchInputProps = Omit<InputProps, "value">;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => {
    return (
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<RiSearchLine color="gray.400" />}
        />
        <Input ref={ref} {...props} />
      </InputGroup>
    );
  },
);
