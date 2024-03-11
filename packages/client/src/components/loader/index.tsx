import { Flex, Spinner } from "@chakra-ui/react";

export const Loader = () => (
  <Flex
    position="absolute"
    bg="whiteAlpha.700"
    justify="center"
    align="center"
    left={0}
    w="100%"
    h="100%"
    top={0}
  >
    <Spinner
      emptyColor="gray.200"
      color="primary"
      thickness="4px"
      speed="0.65s"
      size="xl"
    />
  </Flex>
);
