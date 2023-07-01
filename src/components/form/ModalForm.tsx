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
import startCase from "lodash/startCase";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";

type Props<T extends object> = {
  children: ({ onOpen }: { onOpen: (values?: T) => void }) => ReactNode;
  defaultValues: T;
  entity: string;
  isLoading?: boolean;
  body?: ({ control }: { control: Control<T, any> }) => ReactNode;
  onSubmit: (results: FieldValues) => Promise<any>;
};

export const ModalForm = <T extends object>({
  body,
  entity,
  children,
  onSubmit,
  isLoading,
  defaultValues,
}: Props<T>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState<T | undefined>();
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({ values });

  const onInternalClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onInternalSubmit = useCallback(
    async (results: FieldValues, event: any) => {
      event.preventDefault();

      await onSubmit(results);
      reset();
      onClose();
    },
    [onClose, reset, onSubmit]
  );

  useEffect(() => {
    if (isLoading || isOpen) return;

    // Update the form anytime the values change
    // when the form is hidden from view
    if (!values) {
      reset(defaultValues);
    } else {
      reset(values);
    }
  }, [defaultValues, isLoading, isOpen, reset, values]);

  return (
    <>
      {children({
        onOpen: (values?: T) => {
          setValues(values);
          onOpen();
        },
      })}

      <Modal
        isOpen={isOpen}
        onClose={onInternalClose}
        size="lg"
        closeOnOverlayClick={!isDirty}
      >
        <ModalOverlay />
        <form
          onSubmit={handleSubmit(onInternalSubmit)}
          id={`${entity}-modal-form`}
        >
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              {values ? "Edit" : "Add"} {startCase(entity)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" gap={3} flexDirection="column">
              {body?.({ control })}
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
                ref={saveButtonRef}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
