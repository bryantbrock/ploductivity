import { Copyright } from "@/components/Copyright";
import { theme } from "@/theme";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";
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
            <Copyright />
          </Flex>
        </ChakraProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
