import { theme } from "@/theme";
import { ChakraProvider, Flex, Box, Text } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(
          (registration) => {
            // eslint-disable-next-line no-console
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },
          (err) => {
            // eslint-disable-next-line no-console
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider {...pageProps}>
        <ChakraProvider theme={theme}>
          <Flex minH="100vh" direction="column" bgColor="gray.50">
            <Box flexGrow={1}>
              <Component {...pageProps} />
            </Box>
            <Text align="center" fontSize="sm" color="gray.700" pb={3} mt={5}>
              Copyright © {new Date().getFullYear()} by Brock Software LLC
            </Text>
          </Flex>
        </ChakraProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
