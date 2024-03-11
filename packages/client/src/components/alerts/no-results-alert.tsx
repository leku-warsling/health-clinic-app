import {
  Flex,
  Text,
  Button,
  Heading,
  Icon,
  type FlexProps,
} from "@chakra-ui/react";
import NoResultsSVG from "@assets/svgs/no-results.svg?react";
import { FC } from "react";
import { RiFilter2Line } from "react-icons/ri";

export type NoResultsAlertProps = Omit<FlexProps, "children"> & {
  onClear: () => void;
  title?: string;
  description?: string;
  clearButtonLabel?: string;
};

export const NoResultsAlert: FC<NoResultsAlertProps> = ({
  clearButtonLabel = "Clear Filters",
  title = "No results found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  onClear,
  ...props
}) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    textAlign="center"
    bg="gray.100"
    rounded={12}
    w="fit-content"
    px={14}
    py={12}
    gap={8}
    {...props}
  >
    <NoResultsSVG fontSize="80px" />
    <Flex direction="column" align="center" gap={2}>
      <Heading size="lg">{title}</Heading>
      <Text fontWeight={600} maxW="300px">
        {description}
      </Text>
    </Flex>
    <Button
      w="fit-content"
      leftIcon={<RiFilter2Line />}
      color="primary"
      borderColor="primary"
      variant="outline"
      size="lg"
      _hover={{ bg: "primary", color: "white" }}
      lineHeight="40px"
      onClick={onClear}
    >
      {clearButtonLabel}
    </Button>
  </Flex>
);
