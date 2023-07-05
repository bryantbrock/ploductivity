import { Text, useBreakpoint } from "@chakra-ui/react";

export const Copyright = () => {
  const breakpoint = useBreakpoint();
  const isBase = breakpoint === "base";

  if (isBase) return null;

  return (
    <Text align="center" fontSize="sm" color="gray.700" pb={3} mt={5}>
      Copyright © {new Date().getFullYear()} by Brock Software LLC
    </Text>
  );
};
