import { FormInput } from "@/components/form/FormInput";
import { FormMultiSelect } from "@/components/form/FormMultiSelect";
import { FormTextarea } from "@/components/form/FormTextArea";
import { useUser } from "@/hooks/useUser";
import { inFuture } from "@/utils/inFuture";
import {
  BellIcon,
  CheckIcon,
  DeleteIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useBreakpoint,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, Goal, Step } from "@prisma/client";
import { useRouter } from "next/router";
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

type FormValues = Goal & { steps: (Step & { categories: Category[] })[] };

type Props = {
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  remove: (i: number) => void;
  index: number;
  step: Step;
  categories: Category[];
};

export const StepCard = forwardRef(
  (
    { control, index, step, remove, watch, categories, setValue }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { data: user } = useUser();
    const router = useRouter();
    const stepId = parseInt(
      router.asPath.split("#").pop()?.split("-").pop() ?? ""
    );
    const hasIdHash = !isNaN(stepId) && stepId === step.id;
    const [hasHash, setHasHash] = useState(hasIdHash);

    const isFinished = !!watch(`steps.${index}.finishedAt`);
    const isSnoozed = !!watch(`steps.${index}.snoozedTill`);

    const breakpoint = useBreakpoint();
    const isBaseOrSmall = breakpoint === "base" || breakpoint === "sm";

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: step.id });

    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
    };

    const selectedCategoryIds = watch(`steps.${index}.categories`).map(
      (c) => c.id
    );
    const categoriesMinusSelected = useMemo(() => {
      return categories.filter((c) => !selectedCategoryIds.includes(c.id));
    }, [categories, selectedCategoryIds]);

    useEffect(() => {
      if (!hasHash) return;

      const handleScroll = () => {
        if (window.location.hash) {
          setHasHash(false);
          window.history.replaceState(
            "",
            document.title,
            window.location.pathname + window.location.search
          );
        }
      };

      setTimeout(
        () =>
          window.addEventListener("scroll", handleScroll, { passive: true }),
        500
      );

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [hasHash]);

    if (isFinished && !user?.showCompletedSteps) return null;

    return (
      <Flex
        gap={1}
        rounded="md"
        bg="white"
        borderWidth="2px"
        borderColor={hasHash ? "blue.300" : "gray.100"}
        p={1}
        justify="space-between"
        ref={setNodeRef}
        style={style}
        id={`step-${step.id}`}
        position="relative"
      >
        <Flex direction="column" flexGrow={1} gap={1}>
          <Flex gap={1}>
            <FormInput
              control={control}
              name={`steps.${index}.title`}
              hideLabel
              placeholder="Title"
              fontWeight={600}
              borderColor="transparent"
              px={2}
              flexGrow={1}
              _hover={{ borderColor: "gray.200" }}
              ref={ref}
            />
            <Box pos="relative">
              <FormInput
                control={control}
                name={`steps.${index}.duration`}
                type="number"
                hideLabel
                placeholder="0"
                borderColor="transparent"
                px={2}
                pr={12}
                flexGrow={1}
                maxW="105px"
                textAlign="end"
                _hover={{ borderColor: "gray.200" }}
              />
              <Text
                pos="absolute"
                right={2}
                top={2.5}
                color="gray.400"
                fontSize="sm"
              >
                min{watch(`steps.${index}.duration`) === 1 ? "" : "s"}
              </Text>
            </Box>
          </Flex>
          <Flex gap={1}>
            <FormTextarea
              control={control}
              name={`steps.${index}.description`}
              placeholder="Description"
              borderColor="transparent"
              hideLabel
              fontSize="sm"
              sx={{ resize: "none" }}
              _hover={{ borderColor: "gray.200", resize: "vertical" }}
              px={2}
              py={1}
              autoGrow
            />
            <Box pos="relative">
              <FormInput
                control={control}
                name={`steps.${index}.repeats`}
                type="number"
                hideLabel
                min={1}
                placeholder="0"
                borderColor="transparent"
                px={2}
                pr={12}
                flexGrow={1}
                maxW="105px"
                textAlign="end"
                _hover={{ borderColor: "gray.200" }}
              />
              <Text
                pos="absolute"
                right={2}
                top={2.5}
                color="gray.400"
                fontSize="sm"
              >
                time{watch(`steps.${index}.repeats`) === 1 ? "" : "s"}
              </Text>
            </Box>
          </Flex>
          <FormMultiSelect
            name={`steps.${index}.categories`}
            control={control}
            options={categoriesMinusSelected}
            displayKey="name"
            hideLabel
            placeholder="Categories"
            size="sm"
            hideClear
            borderColor="transparent"
            _hover={{ borderColor: "gray.200" }}
          />
        </Flex>
        <Flex direction="column" gap={1} align="center" mt={1}>
          <IconButton
            aria-label="Delete step"
            icon={<DeleteIcon color="gray.400" />}
            onClick={() => remove(index)}
            size="xs"
            variant="outline"
            rounded="full"
          />
          <DragHandleIcon
            color="gray.400"
            cursor={isDragging ? "grabbing" : "grab"}
            p={1.5}
            h="24px"
            w="24px"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="full"
            {...attributes}
            {...listeners}
          />
          <Tooltip
            label={isFinished ? "Mark unfinished" : "Mark finished"}
            hasArrow
            placement="left"
          >
            <IconButton
              aria-label="Delete step"
              icon={<CheckIcon color={isFinished ? "green.600" : "gray.500"} />}
              variant="outline"
              rounded="full"
              bgColor={isFinished ? "green.50" : "gray.50"}
              colorScheme={isFinished ? "green" : "gray"}
              onClick={() =>
                setValue(
                  `steps.${index}.finishedAt`,
                  isFinished ? null : new Date(),
                  { shouldDirty: true }
                )
              }
              size="xs"
            />
          </Tooltip>
          {!isSnoozed ? (
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
                  icon={<BellIcon color="gray.400" />}
                  variant="outline"
                  rounded="full"
                  size="xs"
                />
              </Tooltip>
              <MenuList maxW="100px">
                <MenuItem
                  onClick={() =>
                    setValue(`steps.${index}.snoozedTill`, inFuture(1, "hr"), {
                      shouldDirty: true,
                    })
                  }
                >
                  1 Hour
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setValue(`steps.${index}.snoozedTill`, inFuture(12, "hr"), {
                      shouldDirty: true,
                    })
                  }
                >
                  12 Hours
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setValue(`steps.${index}.snoozedTill`, inFuture(1, "day"), {
                      shouldDirty: true,
                    })
                  }
                >
                  1 Day
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setValue(`steps.${index}.snoozedTill`, inFuture(5, "day"), {
                      shouldDirty: true,
                    })
                  }
                >
                  5 Days
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setValue(
                      `steps.${index}.snoozedTill`,
                      inFuture(15, "day"),
                      { shouldDirty: true }
                    )
                  }
                >
                  15 Days
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Tooltip label="Remove snooze" hasArrow placement="left">
              <IconButton
                aria-label="Remove snooze"
                icon={<BellIcon color="yellow.600" />}
                variant="outline"
                rounded="full"
                bgColor="yellow.50"
                colorScheme="yellow"
                onClick={() =>
                  setValue(`steps.${index}.snoozedTill`, null, {
                    shouldDirty: true,
                  })
                }
                size="xs"
              />
            </Tooltip>
          )}
        </Flex>
        {!isBaseOrSmall ? (
          <Box position="absolute" left={-9}>
            <Text color="gray.200"># {index + 1}</Text>
          </Box>
        ) : null}
      </Flex>
    );
  }
);
