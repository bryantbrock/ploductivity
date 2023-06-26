import React from "react";
import InputMask from "react-input-mask";
import { Input, InputProps } from "@chakra-ui/react";

type Props = {
  mask?: string;
  maskChar?: string | null;
} & InputProps;

const PhoneInput = ({
  mask = "(999) 999-9999",
  maskChar = null,
  onChange,
  ...props
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const unmaskedValue = e.target.value.replace(/\D+/g, "");
    const event = {
      ...e,
      target: {
        ...e.target,
        value: unmaskedValue,
      },
    };

    if (onChange) {
      onChange(event as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      onChange={handleChange}
      {...props}
    >
      {/* @ts-ignore */}
      {(inputProps: Props) => <Input {...inputProps} />}
    </InputMask>
  );
};

export default PhoneInput;
