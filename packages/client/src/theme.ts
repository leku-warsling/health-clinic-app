import { extendTheme } from "@chakra-ui/react";

const solid = {
  field: {
    borderRadius: "12px",
    bg: "white",
    color: "#2D2D2D",
    border: "1px solid",
    borderColor: "gray.400",
    _focus: {
      borderColor: "blue.500",
    },
    _hover: {
      borderColor: "gray.700",
    },
    _disabled: {
      bg: "gray.100",
    },
    _readOnly: {
      bg: "gray.100",
    },
    _invalid: {
      borderColor: "red.500",
    },
  },
};

const Input = {
  variants: {
    solid,
  },
  defaultProps: {
    variant: "solid",
  },
};

const Select = {
  variants: {
    solid,
  },
  defaultProps: {
    variant: "solid",
  },
};

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#e7edf3",
        color: "#2D2D2D",
      },
    },
  },
  fonts: {
    heading: "'Sen', sans-serif",
    body: "'Sen', sans-serif",
  },
  colors: {
    // primary: "#8664E3",
    primary: "#5D40A1",
  },
  components: {
    Input,
    Select,
  },
});

export default theme;
