import {
  Box,
  Center,
  Flex,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useFindManyGoals } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { FunnelIcon } from "@/icons/FunnelIcon";
import { useMemo, useState } from "react";
import { Prisma } from "@prisma/client";
import { StepCard } from "@/modules/index/components/StepCard";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { flattenSequentially } from "@/utils/flattenSequentially";

const Index = () => {
  const { data: user } = useUser();
  const currentTime = useMemo(() => new Date(), []);
  const [filters, setFilters] = useState<Prisma.StepWhereInput>({});

  // TODO: filter by minutes
  // TODO: filter by categories
  // TODO: filter by snoozedTill (show snoozed or not)

  const {
    data: goals = [],
    isLoading,
    isFetched,
  } = useFindManyGoals({
    options: { enabled: !!user?.id },
    query: {
      include: {
        steps: {
          include: {
            categories: true,
            goal: { include: { _count: { select: { steps: true } } } },
          },
          orderBy: [{ position: "asc" }],
          where: {
            OR: [{ snoozedTill: { lte: currentTime } }, { snoozedTill: null }],
            finishedAt: null,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      where: {
        ...filters,
        steps: { some: { finishedAt: null } },
      },
    },
  });

  const sequentialSteps = useMemo(
    () => flattenSequentially(goals.map((goal) => goal.steps)),
    [goals]
  );

  return (
    <Layout>
      <Flex py={4} gap={2}>
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
      ) : !sequentialSteps.length ? (
        <Center
          borderWidth="1px"
          rounded="md"
          borderColor="gray.100"
          p={5}
          my={2}
        >
          <Text>
            No activities found.{" "}
            <Box
              as={Link}
              href="/goals"
              textDecoration="underline"
              fontWeight={600}
            >
              Add a goal
            </Box>
          </Text>
        </Center>
      ) : (
        <Flex direction="column" gap={2} flexGrow={1}>
          {sequentialSteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
