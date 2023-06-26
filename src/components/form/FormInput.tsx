import { ChangeEvent, useCallback, useMemo } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
  ComponentWithAs,
  IconProps,
  Icon,
  Flex,
  Text,
  Tooltip,
  FormHelperText,
} from "@chakra-ui/react";
import PhoneInput from "@/components/PhoneInput";
import { ZipInput } from "@/components/ZipInput";
import startCase from "lodash/startCase";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isRequired?: boolean;
  icon?: ComponentWithAs<"svg", IconProps>;
  tooltipLabel?: string;
  helperText?: string;
  variant?: "floating" | "outline" | "unstyled" | "flushed" | "filled";
  hideLabel?: boolean;
} & Omit<InputProps, "variant">;

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  placeholder,
  type,
  icon,
  tooltipLabel,
  variant,
  helperText,
  hideLabel,
  ...props
}: Props<T>) => {
  const defaultText = useMemo(() => startCase(name), [name]);

  const {
    field: { onChange, ...field },
    fieldState: { error, invalid },
  } = useController({ control, name, rules: { required: isRequired } });

  const onFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        type === "number" ? parseInt(e.target.value) : e.target.value;

      onChange(value as any);
    },
    [onChange, type]
  );

  if (variant === "floating") {
    return (
      <FormControl
        variant="floating"
        id={name}
        isInvalid={invalid}
        isRequired={isRequired}
        w="100%"
      >
        {type === "phone" ? (
          <PhoneInput
            id={name}
            {...field}
            {...props}
            type={type}
            onChange={onFieldChange}
            placeholder={placeholder ?? " "}
          />
        ) : type === "zip" ? (
          <ZipInput
            id={name}
            {...field}
            {...props}
            type={type}
            onChange={onFieldChange}
            placeholder={placeholder ?? " "}
          />
        ) : (
          <Input
            id={name}
            {...field}
            {...props}
            type={type}
            onChange={onFieldChange}
            placeholder={placeholder ?? " "}
          />
        )}
        {!hideLabel ? <FormLabel>{label ?? defaultText}</FormLabel> : null}
        {helperText ? (
          <FormHelperText mt={1} ml={1}>
            {helperText}
          </FormHelperText>
        ) : null}
        {error ? <FormErrorMessage>{error.message}</FormErrorMessage> : null}
      </FormControl>
    );
  }

  return (
    <FormControl isInvalid={invalid} isRequired={isRequired}>
      {icon ? (
        tooltipLabel ? (
          <FormLabel htmlFor={name}>
            <Flex gap={2} align="center">
              <Text>{label ?? defaultText}</Text>
              <Tooltip
                hasArrow
                placement="top"
                rounded="md"
                label={tooltipLabel}
              >
                <Icon as={icon} />
              </Tooltip>
            </Flex>
          </FormLabel>
        ) : (
          <FormLabel htmlFor={name}>
            <Flex gap={2} align="center">
              <Text>{label ?? defaultText}</Text>
              <Icon as={icon} />
            </Flex>
          </FormLabel>
        )
      ) : hideLabel ? null : (
        <FormLabel htmlFor={name}>{label ?? defaultText}</FormLabel>
      )}

      {type === "phone" ? (
        <PhoneInput
          id={name}
          {...field}
          {...props}
          type={type}
          onChange={onFieldChange}
          placeholder={placeholder}
        />
      ) : type === "zip" ? (
        <ZipInput
          id={name}
          {...field}
          {...props}
          type={type}
          onChange={onFieldChange}
          placeholder={placeholder ?? " "}
        />
      ) : (
        <Input
          id={name}
          {...field}
          {...props}
          type={type}
          onChange={onFieldChange}
          placeholder={placeholder}
        />
      )}
      {error ? <FormErrorMessage>{error.message}</FormErrorMessage> : null}
    </FormControl>
  );
};
