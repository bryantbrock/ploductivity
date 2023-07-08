import { Button, Center, Flex, Skeleton, Text } from "@chakra-ui/react";
import {
  useDeleteManySteps,
  useFindManyCategorys,
  useFindManyGoals,
  useUpdateGoal,
  useUpsertStep,
} from "prisma-hooks";
import { useUser } from "@/hooks/useUser";
import { Layout } from "@/components/Layout";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useForm, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextArea";
import { StepCard } from "@/modules/goals/components/StepCard";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useCallback, useMemo, useRef, useState } from "react";
import { hasDirtyField } from "@/utils/hasDirtyField";
import omit from "lodash/omit";
import { pullAll } from "lodash";
import { BackButton } from "@/components/BackButton";
import { ShowCompletedSteps } from "@/components/ShowCompletedSteps";

const GoalId = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();
  const { id: queryId } = useRouter().query;
  const id = parseInt(queryId as string);
  const lastTitleRef = useRef<HTMLInputElement>(null);

  const {
    data: [goal] = [],
    isLoading: isLoadingGoal,
    isFetched,
    refetch: refetchGoal,
  } = useFindManyGoals({
    options: { enabled: !!user?.id && !Number.isNaN(id) },
    query: {
      include: {
        steps: {
          include: { categories: true },
          orderBy: { position: "asc" },
        },
      },
      where: { id, userId: user?.id ?? 0 },
    },
  });

  const completedStepsCount = useMemo(() => {
    return (
      goal?.steps.reduce((acc, step) => (step.finishedAt ? acc + 1 : acc), 0) ??
      0
    );
  }, [goal?.steps]);

  const { data: categories = [] } = useFindManyCategorys({
    options: { enabled: !!user?.id && !Number.isNaN(id) },
    query: { where: { userId: user?.id } },
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm({ values: goal });

  const {
    fields: steps,
    append,
    remove,
    move,
  } = useFieldArray({ control, keyName: "fieldId", name: "steps" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      const from = active.data.current?.sortable.index;
      const to = over?.data.current?.sortable.index;

      move(from, to);
    },
    [move]
  );

  const { mutateAsync: updateGoal } = useUpdateGoal();
  const { mutateAsync: upsertStep } = useUpsertStep();
  const { mutateAsync: deleteManySteps } = useDeleteManySteps();

  const onSubmit = useCallback(
    async ({ steps, id, title, description }: typeof goal) => {
      setIsLoading(true);

      // Update goal
      if (hasDirtyField(omit(dirtyFields, ["steps"]))) {
        await updateGoal({
          data: { description, title },
          where: { id },
        });
      }

      // Update steps
      if (dirtyFields.steps?.length) {
        await Promise.all(
          steps.map((step, index) => {
            if (hasDirtyField(dirtyFields.steps?.[index])) {
              const baseValues = {
                completed: step.completed,
                description: step.description,
                duration: step.duration,
                finishedAt:
                  step.completed === step.repeats && !step.finishedAt
                    ? new Date()
                    : step.finishedAt,
                position: index,
                repeats: step.repeats,
                snoozedTill: step.snoozedTill,
                title: step.title,
              };

              return upsertStep({
                create: {
                  categories: {
                    connect: step.categories.map((c) => ({
                      id: c.id,
                    })),
                  },
                  goal: { connect: { id } },
                  ...baseValues,
                },
                update: {
                  categories: {
                    set: step.categories.map((c) => ({
                      id: c.id,
                    })),
                  },
                  ...baseValues,
                },
                where: { id: step.id },
              });
            } else {
              return Promise.resolve(step);
            }
          })
        );
      }

      // Delete steps
      const originalStepIds = goal.steps.map((step) => step.id);
      const currentStepIds = steps.map((step) => step.id);
      const deletedStepIds = pullAll(originalStepIds, currentStepIds);

      if (deletedStepIds.length) {
        await deleteManySteps({ where: { id: { in: deletedStepIds } } });
      }

      await refetchGoal();

      setIsLoading(false);
    },
    [
      deleteManySteps,
      dirtyFields,
      goal?.steps,
      refetchGoal,
      updateGoal,
      upsertStep,
    ]
  );

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justify="space-between" py={3} gap={2} align="center" minH="63px">
          <BackButton href="/goals" label={goal?.title} />
          <Flex gap={1}>
            <Button
              variant="outline"
              bg="white"
              isDisabled={!isDirty || isLoading}
              onClick={() => reset(goal)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isDisabled={!isDirty}
              type="submit"
              isLoading={isLoading}
            >
              Save
            </Button>
          </Flex>
        </Flex>
        {isLoadingGoal || !isFetched ? (
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
        ) : !goal ? (
          <Center
            borderWidth="1px"
            rounded="md"
            borderColor="gray.100"
            p={5}
            my={2}
          >
            <Text>No goal found.</Text>
          </Center>
        ) : (
          <Flex direction="column" gap={2} flexGrow={1}>
            <FormInput
              control={control}
              name="title"
              hideLabel
              fontWeight={600}
              fontSize="2xl"
              borderColor="transparent"
              px={2}
              _hover={{ borderColor: "gray.200" }}
            />
            <FormTextarea
              control={control}
              name="description"
              hideLabel
              borderColor="transparent"
              px={2}
              py={1}
              fontSize="lg"
              sx={{ resize: "none" }}
              _hover={{ borderColor: "gray.200", resize: "vertical" }}
              autoGrow
            />
            <Flex justify="space-between" align="flex-end">
              <Text fontWeight={600} fontSize="lg" mt={4}>
                Steps
              </Text>
              <ShowCompletedSteps completedStepsCount={completedStepsCount} />
            </Flex>
            <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={steps}>
                {steps.map((step, index) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={index}
                    control={control}
                    remove={remove}
                    ref={index + 1 === steps.length ? lastTitleRef : null}
                    categories={categories}
                    watch={watch}
                    setValue={setValue}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <Button
              variant="outline"
              leftIcon={<AddIcon />}
              onClick={() => {
                append(
                  {
                    categories: steps[steps.length - 1]?.categories ?? [],
                    description: "",
                    duration: 5,
                    id: 0,
                    repeats: 1,
                    title: `Step ${steps.length + 1}`,
                  } as any,
                  { shouldFocus: true }
                );

                setTimeout(() => {
                  lastTitleRef.current?.focus();
                  lastTitleRef.current?.select();
                });
              }}
              zIndex={1}
            >
              Add step
            </Button>
          </Flex>
        )}
      </form>
    </Layout>
  );
};

export default GoalId;
