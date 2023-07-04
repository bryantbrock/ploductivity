import { FormInput } from "@/components/form/FormInput";
import { FormMultiSelect } from "@/components/form/FormMultiSelect";
import { FormTextarea } from "@/components/form/FormTextArea";
import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, Goal, Step } from "@prisma/client";
import { ForwardedRef, forwardRef, useMemo } from "react";
import { Control, UseFormWatch } from "react-hook-form";

type FormValues = Goal & { steps: (Step & { categories: Category[] })[] };

type Props = {
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  remove: (i: number) => void;
  index: number;
  step: Step;
  categories: Category[];
};

export const StepCard = forwardRef(
  (
    { control, index, step, remove, watch, categories }: Props,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

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

    return (
      <Flex
        gap={1}
        rounded="md"
        bg="white"
        borderWidth="2px"
        borderColor="gray.100"
        p={1}
        justify="space-between"
        ref={setNodeRef}
        style={style}
        onMouseEnter={onOpen}
        onMouseLeave={isDragging ? undefined : onClose}
      >
        <Flex direction="column" flexGrow={1} gap={1}>
          <Flex gap={1} grow={1}>
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
                pr={9}
                flexGrow={1}
                maxW="80px"
                _hover={{ borderColor: "gray.200" }}
              />
              <Text pos="absolute" right={2} top={2}>
                min
              </Text>
            </Box>
          </Flex>
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
        <Flex
          direction="column"
          gap={1}
          align="center"
          mt={1}
          visibility={isOpen ? "visible" : "hidden"}
        >
          <IconButton
            aria-label="Delete step"
            icon={<DeleteIcon color="gray.400" />}
            onClick={() => remove(index)}
            variant="ghost"
            size="sm"
          />
          <DragHandleIcon
            color="gray.400"
            cursor={isDragging ? "grabbing" : "grab"}
            p={1}
            h="20px"
            w="20px"
            {...attributes}
            {...listeners}
          />
        </Flex>
      </Flex>
    );
  }
);
