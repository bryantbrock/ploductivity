import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Flex,
  Input,
  InputProps,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
  Text,
  FlexProps,
  Button,
} from "@chakra-ui/react";
import { useDebounce, useOnClickOutside } from "usehooks-ts";
import differenceWith from "lodash/differenceWith";
import get from "lodash/get";

export type MultiSelectProps<T, DK extends keyof T> = {
  values: T[];
  options: T[];
  displayKey: DK;
  onAdd?: () => void;
  multiple?: boolean;
  shouldFocus?: boolean;
  onChange?: (values: T[]) => void;
  displayFn?: (value: T) => ReactNode;
} & Omit<FlexProps, "onChange"> &
  Pick<InputProps, "size" | "variant" | "placeholder" | "name">;

export const MultiSelect = <
  T extends { id: number } & Record<DK, string | number | Date | null>,
  DK extends keyof T
>({
  size,
  values,
  options,
  variant,
  onChange,
  displayKey,
  displayFn,
  placeholder,
  shouldFocus = false,
  multiple = true,
  onAdd,
  ...props
}: MultiSelectProps<T, DK>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  useOnClickOutside(ref, onClose);

  const filteredOptions = useMemo(
    () =>
      differenceWith(options, values, (option, val) => option.id === val.id)
        .filter((option) =>
          get(option, displayKey, "")
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        )
        .concat(
          onAdd
            ? [
                {
                  id: 0,
                  [displayKey]: <Text>+ Add</Text>,
                } as T,
              ]
            : []
        ),
    [options, values, onAdd, displayKey, debouncedSearch]
  );

  const handleSelect = useCallback(
    (option: T) => {
      onChange?.(multiple ? [...values, option] : [option]);

      if (multiple) {
        searchRef.current?.focus();
      } else {
        onClose();
      }
    },
    [multiple, onChange, values, onClose]
  );

  const handleRemove = useCallback(
    (optionId: number) => {
      onChange?.(multiple ? values.filter(({ id }) => id !== optionId) : []);
      setTimeout(() => searchRef.current?.focus());
    },
    [multiple, onChange, values]
  );

  useEffect(() => {
    if (shouldFocus && searchRef.current) {
      searchRef.current.focus();
      onOpen();
    }
  }, [shouldFocus, onOpen]);

  return (
    <Box ref={ref} position="relative">
      <Flex
        gap={1}
        wrap="wrap"
        borderWidth="1px"
        borderColor={isOpen ? "blue.500" : "gray.200"}
        shadow={isOpen ? "0px 0px 0px 1px #5f59d9" : undefined}
        rounded="md"
        p={size === "sm" ? 1 : size === "lg" ? 3 : 2}
        w="full"
        align="center"
        transition=".3s backgrond-color ease-in-out"
        {...props}
      >
        {values.map((val) => (
          <Tag
            key={val.id}
            size={multiple ? "sm" : "md"}
            variant={multiple ? "outline" : "unstyled"}
            colorScheme="blue"
            borderRadius="md"
            {...(!multiple
              ? { justifyContent: "space-between", w: "full" }
              : {})}
          >
            <TagLabel>
              {displayFn ? displayFn(val) : get(val, displayKey, "")}
            </TagLabel>
            <TagCloseButton onClick={() => handleRemove(val.id)} />
          </Tag>
        ))}
        {!multiple && values.length ? null : (
          <Flex grow={1}>
            <Input
              size={size}
              value={search}
              ref={searchRef}
              onFocus={onOpen}
              placeholder={placeholder}
              onChange={(e) => setSearch(e.target.value)}
              variant={variant ?? "unstyled"}
              pl={1}
            />
          </Flex>
        )}
      </Flex>
      {isOpen && filteredOptions.length ? (
        <Flex
          direction="column"
          position="absolute"
          top="104%"
          left={0}
          right={0}
          zIndex={3}
          bg="white"
          shadow="xl"
          rounded="lg"
          maxH="200px"
          overflowY="auto"
          borderWidth="1px"
        >
          {filteredOptions.map((option) => (
            <Flex
              key={option.id}
              cursor="pointer"
              p={2}
              _hover={{ bg: "gray.100" }}
              onClick={() =>
                option.id === 0 ? onAdd?.() : handleSelect(option)
              }
            >
              <Text fontSize="sm">
                {displayFn ? displayFn(option) : get(option, displayKey, "")}
              </Text>
            </Flex>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
};
