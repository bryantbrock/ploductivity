import { ArrowTrendingUpIcon } from "@/icons/ArrowTrendingUpIcon";
import { EllipsisVerticalIcon } from "@/icons/EllipsisVerticalIcon";
import { HomeIcon } from "@/icons/HomeIcon";
import { Squares2x2Icon } from "@/icons/Squares2x2Icon";
import {
  Flex,
  Box,
  Text,
  Stack,
  Divider,
  Menu,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpoint,
  Center,
} from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const Layout = ({ children }: Props) => {
  const breakpoint = useBreakpoint();
  const isBase = breakpoint === "base";
  const isMediumOrSmall = breakpoint === "md" || breakpoint === "sm";
  const isLarge = breakpoint === "lg" || breakpoint.includes("xl");

  const { pathname } = useRouter();
  const basePath = pathname.split("/")[1];
  const isSubRoute = pathname.split("/").length > 2;

  return (
    <>
      <Box>
        {!isBase ? (
          <Box borderBottomWidth="2px" bg="white" borderBottomColor="gray.100">
            <Flex
              py={3}
              px={2}
              mx="auto"
              maxW="xl"
              minH="60px"
              align="center"
              gap={2}
            >
              <Box flexGrow={1}>
                <Text fontSize="xl" fontWeight="bold" as={Link} href="/">
                  Ploductivity
                </Text>
              </Box>
              {isMediumOrSmall ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="more"
                    icon={<EllipsisVerticalIcon h="20px" w="20px" />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList zIndex={200}>
                    <MenuItem as={Link} href="/">
                      Home
                    </MenuItem>
                    <MenuItem as={Link} href="/goals">
                      Goals
                    </MenuItem>
                    <MenuItem as={Link} href="/categories">
                      Categories
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : null}
              <Box minW="35px">
                <UserButton afterSignOutUrl="/" />
              </Box>
            </Flex>
          </Box>
        ) : null}
        <Flex
          mx="auto"
          maxW="xl"
          px={2}
          direction="column"
          position="relative"
          mb={isBase ? "120px" : undefined}
        >
          {children}
          {isLarge ? (
            <Stack
              position="absolute"
              rounded="md"
              bg="white"
              borderWidth="2px"
              borderColor="gray.100"
              right="585px"
              top={4}
              direction="column"
              divider={<Divider m={0} p={0} />}
              spacing={0}
              w="full"
              maxW="200px"
            >
              <Flex
                as={Link}
                href="/"
                align="center"
                gap={2}
                px={3}
                py={1}
                _hover={{ bg: "gray.50" }}
              >
                <HomeIcon variant="filled" />
                <Text>Home</Text>
              </Flex>
              <Flex
                as={Link}
                href="/goals"
                align="center"
                gap={2}
                px={3}
                py={1}
                _hover={{ bg: "gray.50" }}
              >
                <ArrowTrendingUpIcon />
                <Text>Goals</Text>
              </Flex>
              <Flex
                as={Link}
                href="/categories"
                align="center"
                gap={2}
                px={3}
                py={1}
                _hover={{ bg: "gray.50" }}
              >
                <Squares2x2Icon variant="filled" />
                <Text>Categories</Text>
              </Flex>
            </Stack>
          ) : null}
        </Flex>

        {isBase && !isSubRoute ? (
          <Flex
            position="fixed"
            bottom={0}
            w="full"
            bg="white"
            borderTopWidth="2px"
            borderTopColor="gray.100"
            p={2}
            px={6}
            justify="space-between"
            pb={7}
            zIndex={999999}
          >
            <Flex
              as={Link}
              href="/"
              align="center"
              gap={1}
              px={3}
              py={1}
              direction="column"
            >
              <Center h="32px" w="32px">
                <HomeIcon
                  variant="filled"
                  h="20px"
                  w="20px"
                  color={pathname === "/" ? "blue.500" : "gray.600"}
                />
              </Center>
              <Text
                fontSize="sm"
                color={pathname === "/" ? "blue.600" : "gray.600"}
              >
                Home
              </Text>
            </Flex>
            <Flex
              as={Link}
              href="/goals"
              align="center"
              gap={1}
              px={3}
              py={1}
              direction="column"
            >
              <Center h="32px" w="32px">
                <ArrowTrendingUpIcon
                  h="20px"
                  w="20px"
                  color={basePath === "goals" ? "blue.500" : "gray.600"}
                />
              </Center>
              <Text
                fontSize="sm"
                color={basePath === "goals" ? "blue.600" : "gray.600"}
              >
                Goals
              </Text>
            </Flex>
            <Flex
              as={Link}
              href="/categories"
              align="center"
              gap={1}
              px={3}
              py={1}
              direction="column"
              h="full"
            >
              <Center h="32px" w="32px">
                <Squares2x2Icon
                  variant="filled"
                  h="20px"
                  w="20px"
                  color={basePath === "categories" ? "blue.500" : "gray.600"}
                />
              </Center>
              <Text
                fontSize="sm"
                color={basePath === "categories" ? "blue.600" : "gray.600"}
              >
                Categories
              </Text>
            </Flex>
            <Flex
              as={Link}
              href="/categories"
              align="center"
              gap={1}
              px={3}
              py={1}
              direction="column"
            >
              <Box minW="35px">
                <UserButton afterSignOutUrl="/" />
              </Box>
              <Text fontSize="sm" color="gray.600">
                Profile
              </Text>
            </Flex>
          </Flex>
        ) : null}

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            overscroll-behavior: none;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </Box>
    </>
  );
};
