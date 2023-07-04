import { Center, Flex, IconButton, Skeleton, Text } from "@chakra-ui/react";
import { useFindManyGoals } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { FunnelIcon } from "@/icons/FunnelIcon";
import { useMemo, useState } from "react";
import { Prisma, Step } from "@prisma/client";
import { StepCard } from "@/modules/index/components/StepCard";
import { Layout } from "@/components/Layout";

const Index = () => {
  const { data: user } = useUser();
  const currentTime = useMemo(() => new Date(), []);
  const [filters, setFilters] = useState<Prisma.GoalWhereInput>({
    steps: {
      some: {
        OR: [{ snoozedTill: { lte: currentTime } }, { snoozedTill: null }],
        // categories: { some: { name: { in: ["Computer"] } } },
        finishedAt: null,
      },
    },
  });

  // TODO: filter by minutes
  // TODO: filter by categories
  // TODO: filter by snoozedTill (show snoozed or not)

  // Note: the app sorts steps based on two pieces of information
  // 1. If the step does not have a previous step push it to the top
  // 2. If the step has a previous step (ie a position before it),
  //    sort the current steps by the `finishedAt` date of the previous step (most recent last)

  const {
    data: goals = [],
    isLoading,
    isFetched,
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
      where: {
        ...filters,
        userId: user?.id ?? 0,
      },
    },
  });

  const sortedGoals = useMemo(() => {
    const getMostRecentFinishedStep = (steps: Step[]) => {
      return steps.reduce((latest, current) => {
        if (!current.finishedAt) return latest;
        if (!latest) return current.finishedAt;

        return new Date(current.finishedAt) > new Date(latest)
          ? current.finishedAt
          : latest;
      }, null as unknown as Date);
    };

    return goals.sort((a, b) => {
      const aFinishedAt = getMostRecentFinishedStep(a.steps);
      const bFinishedAt = getMostRecentFinishedStep(b.steps);

      if (!aFinishedAt) return -1;
      if (!bFinishedAt) return 1;

      return new Date(bFinishedAt).getTime() - new Date(aFinishedAt).getTime();
    });
  }, [goals]);

  return (
    <Layout>
      <Flex justify="flex-end" py={3} gap={2}>
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
      ) : !sortedGoals.length ? (
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
        <Flex direction="column" gap={2} flexGrow={1}>
          {sortedGoals.map((goal, i) => (
            <StepCard key={goal.id} goal={goal} index={i} />
          ))}
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
