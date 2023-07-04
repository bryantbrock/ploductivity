import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useCreateGoal, useFindManyGoals } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { FunnelIcon } from "@/icons/FunnelIcon";
import { useCallback } from "react";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { GoalCard } from "@/modules/goals/components/GoalCard";
import { useRouter } from "next/router";

const Index = () => {
  const { data: user } = useUser();
  const router = useRouter();

  const {
    data: goals = [],
    isLoading,
    isFetched,
    refetch: refetchGoals,
  } = useFindManyGoals({
    options: { enabled: !!user?.id },
    query: {
      include: {
        _count: { select: { steps: true } },
        steps: {
          include: { categories: true, goal: true },
          orderBy: { position: "asc" },
          where: { finishedAt: null },
        },
      },
      where: { userId: user?.id },
    },
  });

  const { mutateAsync: createGoal } = useCreateGoal();

  const onAddNewGoal = useCallback(async () => {
    const goal = await createGoal({
      data: { title: "New Goal", user: { connect: { id: user?.id } } },
    });

    router.push(`/goals/${goal.id}`);
  }, [createGoal, router, user?.id]);

  return (
    <Layout>
      <Flex justify="space-between" py={3} gap={2} align="center">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/goals" fontWeight="semibold">
              Goals
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <IconButton
          variant="outline"
          aria-label="filters"
          bgColor="white"
          icon={<FunnelIcon />}
        />
      </Flex>
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
      ) : !goals.length ? (
        <Center
          borderWidth="1px"
          rounded="md"
          borderColor="gray.100"
          p={5}
          my={2}
        >
          <Text>No goals found.</Text>
        </Center>
      ) : (
        <Flex direction="column" gap={2} flexGrow={1}>
          {goals.map((goal, i) => (
            <GoalCard
              key={goal.id}
              index={i}
              goal={goal}
              onDelete={refetchGoals}
            />
          ))}
          <Button leftIcon={<AddIcon />} onClick={onAddNewGoal}>
            Add goal
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
