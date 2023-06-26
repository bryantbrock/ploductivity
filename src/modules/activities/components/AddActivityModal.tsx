import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextArea";
import { useUser } from "@/hooks/useUser";
import { AddIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useCreateActivity, useFindManyCateogrys } from "prisma-hooks";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type Values = {
  title: string;
  description: string;
  steps: string[];
  category: { id: number; name?: string };
};

type Props = {
  onSuccess?: () => void;
};

export const AddActivityModal = ({ onSuccess }: Props) => {
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: categories = [] } = useFindManyCateogrys();
  const { mutateAsync: createActivity } = useCreateActivity();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Values>({
    defaultValues: {
      title: "",
      description: "",
      steps: [],
      category: categories[0] ?? { id: 0 },
    },
  });

  const onSubmit = useCallback(
    async ({ category, steps: _, ...data }: Values) => {
      if (isDirty) {
        if (!user?.id) throw new Error("User not found");

        await createActivity({
          data: {
            ...data,
            ...(category.id && { category: { connect: { id: category.id } } }),
            plodder: { connect: { id: user.id } },
          },
        });

        onSuccess?.();
        reset();
        onClose();
      }
    },
    [createActivity, isDirty, onClose, reset, user?.id, onSuccess]
  );

  return (
    <>
      <Flex justify="flex-end">
        <Button onClick={onOpen} leftIcon={<AddIcon />} variant="primary">
          Activity
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add activity</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" gap={3} flexDirection="column">
              <FormInput
                control={control}
                name="title"
                variant="floating"
                isRequired
              />
              <FormTextarea
                control={control}
                name="description"
                variant="floating"
              />
            </ModalBody>

            <ModalFooter display="flex" gap={2}>
              <Button
                variant="ghost"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={onClose} type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
