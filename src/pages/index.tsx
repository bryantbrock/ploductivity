import { Box, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import { useFindManyCategorys, useFindManyGoals } from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { useMemo, useState } from "react";
import { StepCard } from "@/modules/index/components/StepCard";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { flattenSequentially } from "@/utils/flattenSequentially";

const Index = () => {
  const { data: user } = useUser();
  const currentTime = useMemo(() => new Date(), []);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

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
        steps: {
          some: {
            finishedAt: null,
            ...(selectedCategories.length
              ? { categories: { some: { id: { in: selectedCategories } } } }
              : undefined),
          },
        },
        userId: user?.id,
      },
    },
  });

  const { data: categries = [] } = useFindManyCategorys({
    options: { enabled: !!user?.id },
    query: { where: { userId: user?.id } },
  });

  const sequentialSteps = useMemo(
    () => flattenSequentially(goals.map((goal) => goal.steps)),
    [goals]
  );

  return (
    <Layout>
      <Flex
        py={categries.length ? 1 : undefined}
        gap={2}
        overflowX="scroll"
        mt={categries.length ? 4 : undefined}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          scrollbarWidth: 0,
        }}
      >
        {categries.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <Flex
              key={category.id}
              borderWidth="1px"
              borderColor={isSelected ? "blue.300" : "gray.200"}
              rounded="md"
              minW="fit-content"
              bg={isSelected ? "blue.50" : "white"}
              fontSize="sm"
              p={2}
              _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
              cursor="pointer"
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category.id)
                    ? prev.filter((id) => id !== category.id)
                    : [...prev, category.id]
                )
              }
            >
              {category.name}
            </Flex>
          );
        })}
      </Flex>
      {isLoading || !isFetched ? (
        <Flex direction="column" gap={2} mt={4}>
          <Flex
            gap={2}
            direction="column"
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
          mt={4}
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
        <Flex direction="column" gap={2} flexGrow={1} mt={4}>
          {sequentialSteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
