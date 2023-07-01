import { Box, Button, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  useDeleteActivity,
  useFindManyActivitys,
  useFindManyCategorys,
  useUpsertActivity,
  useUpsertCategory,
} from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { ActivityItem } from "@/modules/activities/components/AcitivityItem";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { AddIcon } from "@chakra-ui/icons";
import { FormTextarea } from "@/components/form/FormTextArea";
import { FormInput } from "@/components/form/FormInput";
import { DrawerForm } from "@/components/form/DrawerForm";
import { Activity, Category } from "@prisma/client";
import { FormMultiSelect } from "@/components/form/FormMultiSelect";
import { ModalForm } from "@/components/form/ModalForm";

const Index = () => {
  const { data: user } = useUser();
  const { data: allCategories = [], refetch: refetchCategories } =
    useFindManyCategorys({
      query: { where: { plodderId: user?.id } },
    });

  const { mutateAsync: deleteActivity } = useDeleteActivity();
  const { isLoading: isUpserting, mutateAsync: upsertActivity } =
    useUpsertActivity();
  const { isLoading: isUpsertingCategory, mutateAsync: upsertCategory } =
    useUpsertCategory();

  const {
    data: activities = [],
    isLoading,
    refetch: refetchActivities,
    isFetched,
  } = useFindManyActivitys({
    query: { where: { plodderId: user?.id }, include: { categories: true } },
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

        <DrawerForm<Partial<Activity & { categories: Category[] }>>
          entity="activity"
          isLoading={isUpserting}
          defaultValues={{ title: "", description: "", categories: [] }}
          onSubmit={async (activity) => {
            if (!activity?.title) throw new Error("Title is required");
            if (!user?.id) throw new Error("User not found");

            const values = {
              title: activity?.title,
              description: activity?.description,
              plodder: { connect: { id: user.id } },
            };

            await upsertActivity({
              create: {
                ...values,
                categories: {
                  connect: activity?.categories?.map(({ id }) => ({ id })),
                },
              },
              update: {
                ...values,
                categories: {
                  set: activity?.categories?.map(({ id }) => ({ id })),
                },
              },
              where: { id: activity?.id ?? 0 },
            });

            await refetchActivities();
          }}
          body={({ control }) => (
            <>
              <FormInput
                control={control}
                name="title"
                label="Title"
                variant="floating"
                isRequired
              />
              <FormTextarea
                control={control}
                name="description"
                label="Description"
                variant="floating"
              />
              <FormMultiSelect
                control={control}
                name="categories"
                options={allCategories}
                onAdd={() => {}}
                displayKey="name"
              />
            </>
          )}
        >
          {({ onOpen: onEdit }) => (
            <Flex mx="auto" maxW="xl" px={2} direction="column">
              <Box py={3}>
                <Flex justify="flex-end">
                  <Button
                    onClick={() => onEdit()}
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
                  onDelete={async (activity) => {
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
                          onDelete={(activity) => onDelete(activity)}
                          onEdit={onEdit}
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
        </DrawerForm>
      </Box>
    </>
  );
};

export default Index;
