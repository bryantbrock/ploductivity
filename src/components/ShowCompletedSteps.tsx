import { useUser } from "@/hooks/useUser";
import { Flex, Switch, Text } from "@chakra-ui/react";
import { useUpdateUser } from "prisma-hooks";
import { useEffect, useState } from "react";

type Props = { completedStepsCount: number };

export const ShowCompletedSteps = ({ completedStepsCount }: Props) => {
  const { data: user, refetch } = useUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [value, setValue] = useState(user?.showCompletedSteps);

  useEffect(() => {
    const update = async () => {
      await updateUser({
        data: { showCompletedSteps: value },
        where: { id: user?.id },
      });

      await refetch();
    };

    if (value !== user?.showCompletedSteps) {
      update();
    }
  }, [value, refetch, updateUser, user?.id, user?.showCompletedSteps]);

  return (
    <Flex gap={2} align="center">
      <Text fontSize="sm" fontWeight={600} color="gray.600">
        Show completed ({completedStepsCount})
      </Text>
      <Switch
        id="showCompletedSteps"
        isChecked={value}
        onChange={(e) => setValue(e.target.checked)}
        size="sm"
      />
    </Flex>
  );
};
