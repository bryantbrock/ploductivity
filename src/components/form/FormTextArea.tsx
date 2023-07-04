import { useEffect, useMemo, useRef } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  TextareaProps,
  FormHelperText,
} from "@chakra-ui/react";
import startCase from "lodash/startCase";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
  variant?: "floating" | "outline" | "unstyled" | "flushed" | "filled";
  hideLabel?: boolean;
  autoGrow?: boolean;
} & Omit<TextareaProps, "variant">;

export const FormTextarea = <T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  placeholder,
  helperText,
  variant,
  hideLabel,
  autoGrow,
  ...props
}: Props<T>) => {
  const defaultText = useMemo(() => startCase(name), [name]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    field,
    fieldState: { error, invalid },
  } = useController({ control, name, rules: { required: isRequired } });

  useEffect(() => {
    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [autoGrow, field.value]);

  if (variant === "floating") {
    return (
      <FormControl
        variant="floating"
        id={name}
        isInvalid={invalid}
        isRequired={isRequired}
        w="100%"
      >
        <Textarea
          id={name}
          {...field}
          {...props}
          ref={textareaRef}
          placeholder={placeholder ?? " "}
        />
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
      {!hideLabel ? (
        <FormLabel htmlFor={name}>{label ?? defaultText}</FormLabel>
      ) : null}
      <Textarea
        id={name}
        {...field}
        {...props}
        ref={textareaRef}
        placeholder={placeholder ?? defaultText}
      />
      {error ? <FormErrorMessage>{error.message}</FormErrorMessage> : null}
    </FormControl>
  );
};
