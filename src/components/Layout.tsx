import { EllipsisVerticalIcon } from "@/icons/EllipsisVerticalIcon";
import {
  Flex,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Box>
        <Box borderBottomWidth="1px" bg="white" borderBottomColor="gray.100">
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
            <Box minW="35px">
              <UserButton afterSignOutUrl="/" />
            </Box>
          </Flex>
        </Box>
        <Flex mx="auto" maxW="xl" px={2} direction="column">
          {children}
        </Flex>
      </Box>
    </>
  );
};
