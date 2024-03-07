import { Flex, Spinner, Portal } from "@chakra-ui/react";

export const Fallback = () => (
  <Portal>
    <Flex
      position="fixed"
      top={0}
      left={0}
      justify="center"
      align="center"
      w="100vw"
      h="100vh"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="primary"
        size="xl"
      />
    </Flex>
  </Portal>
);
