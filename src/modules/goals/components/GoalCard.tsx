import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { EllipsisVerticalIcon } from "@/icons/EllipsisVerticalIcon";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Category, Goal, Step } from "@prisma/client";
import Link from "next/link";
import { useDeleteGoal } from "prisma-hooks";
import { useMemo } from "react";

type Props = {
  goal: Goal & {
    steps: (Step & { categories: Category[] })[];
    _count: { steps: number };
  };
  index: number;
  onDelete?: () => Promise<any> | any;
};

export const GoalCard = ({ goal, onDelete }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: deleteGoal } = useDeleteGoal();
  const step = goal.steps[0];

  const percentComplete = useMemo(
    () =>
      step
        ? Math.floor(
            ((step.position ?? goal._count.steps) / goal._count.steps) * 100
          )
        : 0,
    [goal._count.steps, step]
  );

  return (
    <Flex
      direction="column"
      borderWidth="1px"
      rounded="md"
      gap={1}
      bgColor="white"
      _hover={{ borderColor: "gray.400" }}
      cursor="pointer"
      as={Link}
      href={`/goals/${goal.id}`}
    >
      <Flex pl={3} pt={1} pr={1} justify="space-between" align="center">
        <Text>{goal.title}</Text>
        <Menu isOpen={isOpen} onClose={onClose}>
          <MenuButton
            as={IconButton}
            aria-label="goal menu"
            icon={<EllipsisVerticalIcon h="20px" w="20px" />}
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              onOpen();
            }}
          />
          <MenuList>
            <ConfirmDeleteModal
              onDelete={async () => {
                await deleteGoal({ where: { id: goal.id } });
                await onDelete?.();
              }}
            >
              {({ onOpen }) => (
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen();
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </ConfirmDeleteModal>
          </MenuList>
        </Menu>
      </Flex>
      <Progress
        value={percentComplete}
        colorScheme="green"
        rounded="0 0 4px 4px"
        size="xs"
      />
    </Flex>
  );
};
