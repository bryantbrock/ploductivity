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

type Props = {
  additionalText?: string;
  children: ({ onOpen }: { onOpen: () => void }) => ReactNode;
  onDelete: () => Promise<void> | void | any;
};

export const ConfirmDeleteModal = ({
  children,
  onDelete,
  additionalText,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onInternalDelete = useCallback(async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);

    onClose();
  }, [onClose, onDelete]);

  return (
    <>
      {children({ onOpen })}
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
