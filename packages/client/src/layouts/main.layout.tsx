import {
  Flex,
  Container,
  Button,
  Spacer,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Logo from "@assets/svgs/logo.svg?react";
import {
  RiNotification2Line,
  RiSearch2Line,
  RiAccountCircleLine,
} from "react-icons/ri";
import { Fallback } from "@components";

const MainLayout = () => {
  return (
    <Flex direction="column" maxW="100vw" position="relative">
      <Flex
        position="sticky"
        gap={14}
        align="center"
        as="header"
        w="100%"
        bg="white"
        py={6}
        px={8}
        top={0}
        zIndex={10}
        boxShadow="sm"
      >
        <Logo fontSize="100px" />
        <Flex mt={2} as="nav" gap={4} fontWeight={600} color="primary">
          <Button variant="ghost">Clinics</Button>
          <Button isActive _active={{ bg: "primary", color: "white" }}>
            Patients
          </Button>
          <Button variant="ghost">Doctors</Button>
          <Button variant="ghost">Appointments</Button>
        </Flex>
        <Spacer />
        <ButtonGroup>
          <IconButton
            aria-label="Notifications"
            fontSize="xl"
            icon={<RiSearch2Line />}
            variant="ghost"
          />
          <IconButton
            fontSize="xl"
            aria-label="Notifications"
            icon={<RiNotification2Line />}
            variant="ghost"
          />
          <IconButton
            fontSize="xl"
            aria-label="Notifications"
            icon={<RiAccountCircleLine />}
            variant="ghost"
          />
        </ButtonGroup>
      </Flex>
      <Container as="main" maxW="1440px">
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </Container>
    </Flex>
  );
};

export default MainLayout;
