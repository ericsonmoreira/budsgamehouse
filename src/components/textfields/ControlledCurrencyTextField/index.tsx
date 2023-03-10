import { TextField, TextFieldProps } from "@mui/material";
import {
  Controller,
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";

type ControlledCurrencyTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
};

const ControlledCurrencyTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledCurrencyTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, textFieldProps } = props;

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField
      {...field}
      {...textFieldProps}
      error={!!error}
      helperText={error?.message}
      InputProps={{
        inputComponent: NumericFormat as any,
        inputProps: {
          allowLeadingZeros: true,
          fixedDecimalScale: true,
          thousandSeparator: ",",
          decimalScale: 2,
        },
      }}
    />
  );
};

export default ControlledCurrencyTextField;
