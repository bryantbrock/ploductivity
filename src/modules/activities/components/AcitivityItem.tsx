import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { Activity } from "@prisma/client";
import { useDeleteActivity, useUpdateActivity } from "prisma-hooks";

type Props = {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
};

export const ActivityItem = ({ activity, onEdit, onDelete }: Props) => {
  return (
    <Flex
      key={activity.id}
      borderWidth="1px"
      rounded="md"
      borderColor="gray.100"
      p={5}
      bg="white"
      justify="space-between"
    >
      <Flex direction="column" flex={1}>
        <Text fontWeight="bold">{activity.title}</Text>
        <Text>{activity.description}</Text>
      </Flex>
      <Flex direction="column" gap={2}>
        <IconButton
          icon={<DeleteIcon color="gray.300" />}
          aria-label="delete activity"
          onClick={() => onDelete(activity)}
          variant="ghost"
          _hover={{ bg: "none", borderWidth: "1px" }}
          size="sm"
        />
        <IconButton
          icon={<EditIcon color="gray.300" />}
          aria-label="delete activity"
          onClick={() => onEdit(activity)}
          variant="ghost"
          _hover={{ bg: "none", borderWidth: "1px" }}
          size="sm"
        />
      </Flex>
    </Flex>
  );
};
