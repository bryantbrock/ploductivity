import { ClockIcon } from "@/icons/ClockIcon";
import { inFuture } from "@/utils/inFuture";
import { BellIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Flex,
  Tooltip,
  IconButton,
  Text,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Tag,
  Divider,
} from "@chakra-ui/react";
import { Category, Goal, Step } from "@prisma/client";
import Link from "next/link";
import { useUpdateStep } from "prisma-hooks";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "react-query";

type Props = {
  goal: Goal & {
    steps: (Step & { categories: Category[] })[];
    _count: { steps: number };
  };
  index: number;
};

export const StepCard = ({ goal, index }: Props) => {
  const step = goal.steps[0];
  const isFirst = index === 0;
  const [loading, setLoading] = useState<"snooze" | "finished" | undefined>(
    undefined
  );

  const queryClient = useQueryClient();
  const { mutateAsync: updateStep, isLoading: isUpdatingStep } =
    useUpdateStep();

  const percentComplete = useMemo(
    () =>
      Math.floor(
        ((step.position ?? goal._count.steps) / goal._count.steps) * 100
      ),
    [goal._count.steps, step.position]
  );

  const onSnooze = useCallback(
    async (amount: number, unit: "day" | "hr") => {
      setLoading("snooze");
      await updateStep({
        data: { snoozedTill: inFuture(amount, unit) },
        where: { id: step.id },
      });

      await queryClient.refetchQueries("Goal.findMany");
      setLoading(undefined);
    },
    [queryClient, step.id, updateStep]
  );

  const onFinish = useCallback(async () => {
    setLoading("finished");
    await updateStep({
      data: { finishedAt: new Date() },
      where: { id: step.id },
    });

    await queryClient.refetchQueries("Goal.findMany");
    setLoading(undefined);
  }, [queryClient, step.id, updateStep]);

  return (
    <Box
      position="relative"
      shadow={isFirst ? "xl" : undefined}
      opacity={isFirst ? 1 : 0.3}
    >
      <Flex
        direction="column"
        borderWidth="1px"
        rounded="md"
        gap={2}
        pointerEvents={isFirst ? undefined : "none"}
        bgColor="white"
        w={isFirst ? undefined : "98%"}
        mx={isFirst ? undefined : "auto"}
      >
        <Flex p={4} gap={2}>
          <Flex direction="column" grow={1}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.400"
              as={Link}
              _hover={{ textDecor: "underline" }}
              href={`/goals/${goal.id}`}
            >
              {goal.title.toUpperCase()}
            </Text>
            <Text
              fontWeight="semibold"
              as={Link}
              _hover={{ textDecor: "underline" }}
              href={`/goals/${goal.id}#step-${step.id}`}
            >
              {step.title}
            </Text>
            <Flex color="gray.400" gap={1} mt="3px" align="center">
              <ClockIcon />
              <Text fontSize="xs" minW="max-content">
                {step.duration} min
              </Text>
              {step.categories.length ? (
                <Divider orientation="vertical" h="12px" mx={1} />
              ) : null}
              <Flex gap={1} wrap="wrap">
                {step.categories.map((category) => (
                  <Tag key={step.id + category.id} bgColor="gray.100" size="sm">
                    {category.name}
                  </Tag>
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Menu>
            <Tooltip
              label="Snooze"
              placement="top"
              hasArrow
              rounded="md"
              openDelay={400}
            >
              <MenuButton
                as={IconButton}
                aria-label="snooze"
                icon={<BellIcon color="gray.600" />}
                variant="outline"
                rounded="full"
                size="sm"
                isLoading={loading === "snooze"}
                isDisabled={loading === "finished"}
              />
            </Tooltip>
            <MenuList maxW="100px">
              <MenuItem onClick={() => onSnooze(1, "hr")}>1 Hour</MenuItem>
              <MenuItem onClick={() => onSnooze(12, "hr")}>12 Hours</MenuItem>
              <MenuItem onClick={() => onSnooze(1, "day")}>1 Day</MenuItem>
              <MenuItem onClick={() => onSnooze(5, "day")}>5 Days</MenuItem>
              <MenuItem onClick={() => onSnooze(15, "day")}>15 Days</MenuItem>
            </MenuList>
          </Menu>
          <Tooltip
            label="Complete"
            placement="top"
            hasArrow
            rounded="md"
            openDelay={400}
          >
            <IconButton
              aria-label="finish"
              icon={<CheckIcon color="green.600" />}
              variant="outline"
              rounded="full"
              size="sm"
              colorScheme="green"
              isDisabled={loading === "snooze"}
              isLoading={loading === "finished"}
              onClick={onFinish}
            />
          </Tooltip>
        </Flex>
        {step.description ? <Text px={4}>{step.description}</Text> : null}
        <Progress
          value={percentComplete}
          colorScheme="green"
          rounded="0 0 4px 4px"
          size="xs"
        />
      </Flex>
    </Box>
  );
};
