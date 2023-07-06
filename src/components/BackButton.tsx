import { useScrolled } from "@/hooks/useScrolled";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, useBreakpoint } from "@chakra-ui/react";
import Link from "next/link";

type Props = { href: string; label?: string };

export const BackButton = ({ href, label }: Props) => {
  const breakpoint = useBreakpoint();
  const isBase = breakpoint === "base";

  const hasScrolled = useScrolled({ y: 50 });

  return (
    <Box>
      <IconButton
        aria-label="back"
        icon={<ChevronLeftIcon strokeWidth={2} h="18px" w="18px" />}
        rounded="full"
        as={Link}
        href={href}
        size="sm"
      />
      {hasScrolled && isBase ? (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          w="full"
          bgColor="gray.50"
          zIndex={9999}
          borderBottomWidth="2px"
          borderBottomColor="gray.100"
          align="center"
          p={2}
          justify="space-between"
          gap={2}
        >
          <IconButton
            aria-label="back"
            icon={<ChevronLeftIcon strokeWidth={2} h="20px" w="20px" />}
            rounded="full"
            variant="unstyled"
            display="flex"
            justifyContent="center"
            alignItems="center"
            as={Link}
            href={href}
            size="sm"
          />
          <Text fontWeight="bold" fontSize="sm" mr={8}>
            {label}
          </Text>
          <Box />
        </Flex>
      ) : null}
    </Box>
  );
};
