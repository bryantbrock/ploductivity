import { Box, Button, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useDeleteActivity, useFindManyActivitys } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { ActivityItem } from "@/modules/activities/components/AcitivityItem";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useState } from "react";
import { Activity } from "@prisma/client";
import { ActivityForm } from "@/modules/activities/components/ActivityForm";
import { AddIcon } from "@chakra-ui/icons";
import { set } from "lodash";

const Index = () => {
  const [activity, setActivity] = useState<Activity | undefined>();

  const { data: user } = useUser();
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const {
    data: activities = [],
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

        <ActivityForm
          activity={activity}
          onSuccess={async () => await refetchActivities()}
        >
          {({ onOpen: onEdit }) => (
            <Flex mx="auto" maxW="xl" px={2} direction="column">
              <Box py={3}>
                <Flex justify="flex-end">
                  <Button
                    onClick={() => {
                      setActivity(undefined);
                      onEdit();
                    }}
                    leftIcon={<AddIcon />}
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                  >
                    Activity
                  </Button>
                </Flex>
              </Box>
              {isLoading || !isFetched ? (
                <Flex direction="column" gap={2}>
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
                </Flex>
              ) : !activities.length ? (
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
                <ConfirmDeleteModal
                  onDelete={async () => {
                    await deleteActivity({ where: { id: activity?.id } });
                    await refetchActivities();
                  }}
                >
                  {({ onOpen: onDelete }) => (
                    <Flex direction="column" gap={2}>
                      {activities.map((activity) => (
                        <ActivityItem
                          activity={activity}
                          key={activity.id}
                          onDelete={() => {
                            setActivity(activity);
                            onDelete();
                          }}
                          onEdit={(activity) => {
                            setActivity(activity);
                            onEdit();
                          }}
                        />
                      ))}
                    </Flex>
                  )}
                </ConfirmDeleteModal>
              )}
              <Text align="center" fontSize="sm" color="gray.700" pb={3} mt={5}>
                Copyright © {new Date().getFullYear()} by Brock Software LLC
              </Text>
            </Flex>
          )}
        </ActivityForm>
      </Box>
    </>
  );
};

export default Index;
