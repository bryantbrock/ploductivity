import { Box, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useFindManyActivitys } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { AddActivityModal } from "@/modules/activities/components/AddActivityModal";

const Index = () => {
  const { data: user } = useUser();

  const {
    data: activity = [],
    isLoading,
    refetch: refetchActivities,
    isFetched,
  } = useFindManyActivitys({
    query: { where: { plodderId: user?.id } },
    options: { enabled: !!user?.id },
  });

  return (
    <>
      <Box bg="gray.50" minH="100vh">
        <Box borderBottomWidth="1px" bg="white" borderBottomColor="gray.100">
          <Flex
            justify="space-between"
            py={3}
            px={2}
            mx="auto"
            maxW="xl"
            minH="60px"
            align="center"
          >
            <Text fontSize="xl" fontWeight="bold" as={Link} href="/">
              Ploductivity
            </Text>
            <UserButton afterSignOutUrl="/" />
          </Flex>
        </Box>

        <Box mx="auto" maxW="xl" px={2}>
          <Box py={3}>
            <AddActivityModal onSuccess={refetchActivities} />
          </Box>
          {isLoading || !isFetched ? (
            <Flex
              gap={2}
              direction="column"
              mt={4}
              borderWidth="1px"
              rounded="md"
              borderColor="gray.100"
              p={5}
            >
              <Skeleton h="20px" w="75%" />
              <Flex gap={2}>
                <Skeleton h="20px" w="50%" />
                <Skeleton h="20px" w="10%" />
              </Flex>
            </Flex>
          ) : !activity.length ? (
            <Center
              borderWidth="1px"
              rounded="md"
              borderColor="gray.100"
              p={5}
              my={2}
            >
              <Text>No activities found.</Text>
            </Center>
          ) : (
            <Flex direction="column" gap={2}>
              {activity.map((activity) => (
                <Flex
                  key={activity.id}
                  borderWidth="1px"
                  rounded="md"
                  borderColor="gray.100"
                  p={5}
                  bg="white"
                >
                  <Flex direction="column" flex={1}>
                    <Text fontWeight="bold">{activity.title}</Text>
                    <Text>{activity.description}</Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>

        <Text align="center" fontSize="sm" color="gray.700" pb={3} mt={5}>
          Copyright © {new Date().getFullYear()} by Brock Software LLC
        </Text>
      </Box>
    </>
  );
};

export default Index;
