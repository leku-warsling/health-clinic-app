import { Flex, Heading, Spacer, Icon } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { IconType } from "react-icons";

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: IconType;
};

export const PageHeader: FC<PageHeaderProps> = ({
  subtitle,
  actions,
  title,
  icon,
}) => (
  <Flex align="center" gap={2}>
    <Flex align="flex-end" gap={2}>
      {icon && <Icon as={icon} fontSize="40px" />}
      <Heading as="h1" fontWeight={600} lineHeight={0.9}>
        {title}
      </Heading>
      <Heading hidden={!subtitle} size="md" fontWeight={500}>
        - {subtitle}
      </Heading>
    </Flex>
    <Spacer />
    {actions}
  </Flex>
);
