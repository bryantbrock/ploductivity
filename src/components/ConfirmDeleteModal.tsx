import { ReactNode, useCallback, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

type Props<T> = {
  additionalText?: string;
  children: ({ onOpen }: { onOpen: (values?: T) => void }) => ReactNode;
  onDelete: (values?: T) => Promise<void> | void | any;
};

export const ConfirmDeleteModal = <T extends { id: number }>({
  children,
  onDelete,
  additionalText,
}: Props<T>) => {
  const [values, setValues] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onInternalDelete = useCallback(async () => {
    setIsLoading(true);
    await onDelete(values);
    setIsLoading(false);

    onClose();
  }, [onClose, onDelete, values]);

  return (
    <>
      {children({
        onOpen: (values?: T) => {
          setValues(values);
          onOpen();
        },
      })}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody
            pb={6}
            display="grid"
            gap={5}
            maxH="1200px"
            overflowY="scroll"
          >
            <Text>Are you sure?</Text>
            {additionalText ? <Text>{additionalText}</Text> : null}
          </ModalBody>

          <ModalFooter display="flex" gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="danger"
              mr={3}
              onClick={onInternalDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
