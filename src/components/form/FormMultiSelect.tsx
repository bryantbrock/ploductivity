import { ReactNode, useCallback, useMemo } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputProps,
  Flex,
  Button,
} from "@chakra-ui/react";
import { MultiSelect } from "../MultiSelect";
import startCase from "lodash/startCase";

type ValueObject<DK extends string> = { id: number } & Record<
  DK,
  string | number | Date | null
>;

type Props<
  FV extends FieldValues,
  DK extends string,
  T extends { id: number } & Record<DK, string | number | Date | null>
> = {
  control: Control<FV>;
  name: Path<FV>;
  label?: string;
  options: T[];
  displayKey?: DK;
  isRequired?: boolean;
  multiple?: boolean;
  displayFn?: (value: T) => ReactNode;
  hideLabel?: boolean;
  onAdd?: () => void;
} & Omit<InputProps, "onChange" | "onBlur">;

export const FormMultiSelect = <
  FV extends FieldValues,
  DK extends string,
  T extends { id: number } & Record<DK, string | number | Date | null>
>({
  control,
  name,
  label,
  options,
  displayKey = "value" as DK,
  displayFn,
  isRequired,
  multiple = true,
  hideLabel,
  ...props
}: Props<FV, DK, T>) => {
  const defaultText = useMemo(() => startCase(name.replace("Id", "")), [name]);

  const {
    field: { value, onChange },
    fieldState: { error, invalid },
  } = useController({ control, name, rules: { required: isRequired } });

  const handleClear = useCallback(() => {
    // @ts-ignore
    onChange(multiple ? [] : undefined);
  }, [onChange, multiple]);

  const handleChange = useCallback(
    (incoming: ValueObject<DK>[]) => {
      // @ts-ignore
      onChange(multiple ? incoming : incoming[0] ?? {});
    },
    [onChange, multiple]
  );

  return (
    <FormControl isInvalid={invalid} isRequired={isRequired}>
      <Flex gap={1}>
        {hideLabel ? null : (
          <FormLabel htmlFor={name}>{label ?? defaultText}</FormLabel>
        )}
        {multiple && value.length ? (
          <Button size="xs" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        ) : null}
      </Flex>
      <MultiSelect
        values={multiple ? value : value?.id ? [value] : []}
        options={options}
        onChange={handleChange}
        displayKey={displayKey}
        multiple={multiple}
        displayFn={displayFn}
        {...props}
      />
      {error ? <FormErrorMessage>{error.message}</FormErrorMessage> : null}
    </FormControl>
  );
};
