import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextArea";
import { useUser } from "@/hooks/useUser";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Activity } from "@prisma/client";
import { useUpsertActivity } from "prisma-hooks";
import { ReactNode, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  activity?: Activity;
  children: ({ onOpen }: { onOpen: () => void }) => ReactNode;
  onSuccess?: () => Promise<void> | void | any;
};

const blank = { title: "", description: "", id: 0 };

export const ActivityForm = ({ activity, children, onSuccess }: Props) => {
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: upsertActivity, isLoading } = useUpsertActivity();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({ values: activity });

  const onInternalClose = useCallback(() => {
    reset(blank);
    onClose();
  }, [onClose, reset]);

  const onSubmit = useCallback(
    async (activity: Activity) => {
      if (!activity?.title) throw new Error("Title is required");
      if (!user?.id) throw new Error("User not found");

      const values = {
        title: activity?.title,
        description: activity?.description,
        plodder: { connect: { id: user.id } },
      };

      await upsertActivity({
        create: values,
        update: values,
        where: { id: activity?.id ?? 0 },
      });

      await onSuccess?.();
      reset(blank);
      onClose();
    },
    [onClose, onSuccess, reset, upsertActivity, user?.id]
  );

  useEffect(() => {
    if (!activity) {
      reset(blank);
    }
  }, [activity, reset]);

  return (
    <>
      {children({ onOpen })}

      <Modal isOpen={isOpen} onClose={onInternalClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>{activity ? "Edit" : "Add"} Activity</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" gap={3} flexDirection="column">
              <FormInput
                control={control}
                name="title"
                label="Title"
                variant="floating"
                isRequired
              />
              <FormTextarea
                control={control}
                name="description"
                label="Description"
                variant="floating"
              />
            </ModalBody>

            <ModalFooter display="flex" gap={2}>
              <Button variant="ghost" onClick={onInternalClose}>
                Cancel
              </Button>
              <Button
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                type="submit"
                isLoading={isLoading}
                isDisabled={!isDirty}
              >
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
