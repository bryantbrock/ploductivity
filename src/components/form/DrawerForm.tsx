import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  usePrevious,
} from "@chakra-ui/react";
import startCase from "lodash/startCase";
import {
  LegacyRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Control, SubmitHandler, useForm } from "react-hook-form";

type Props<T extends object> = {
  children: ({ onOpen }: { onOpen: (values?: T) => void }) => ReactNode;
  defaultValues: T;
  entity: string;
  isLoading?: boolean;
  body?: ({ control }: { control: Control<T, any> }) => ReactNode;
  onSubmit: (results: T) => Promise<any>;
};

export const DrawerForm = <T extends object>({
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
  const wasOpen = usePrevious(isOpen);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<T>({ values });

  const onInternalClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onInternalSubmit: SubmitHandler<T> = useCallback(
    async (results, event) => {
      event?.preventDefault();

      await onSubmit(results);
      reset();
      onClose();
    },
    [onClose, reset, onSubmit]
  );

  useEffect(() => {
    if (isLoading || wasOpen) return;

    // Update the form anytime the values change
    // when the form is hidden from view
    if (!values) {
      reset(defaultValues);
    } else {
      reset(values);
    }
  }, [defaultValues, isLoading, wasOpen, reset, values]);

  return (
    <>
      {children({
        onOpen: (values?: T) => {
          setValues(values);
          onOpen();
        },
      })}

      <Drawer
        isOpen={isOpen}
        onClose={onInternalClose}
        size="lg"
        closeOnOverlayClick={!isDirty}
      >
        <DrawerOverlay />
        <form
          onSubmit={handleSubmit(onInternalSubmit)}
          id={`${entity}-drawer-form`}
        >
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {values ? "Edit" : "Add"} {startCase(entity)}
            </DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody display="flex" gap={4} flexDirection="column">
              {body?.({ control })}
            </DrawerBody>

            <DrawerFooter display="flex" gap={2}>
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
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
