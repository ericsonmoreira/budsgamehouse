import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { NumberFormatBaseProps, NumericFormat } from "react-number-format";

type ControlledCurrencyTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
> = UseControllerProps<TextFieldValues, TextFieldName> &
  NumberFormatBaseProps<TextFieldProps>;

const ControlledCurrencyTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
>(
  props: ControlledCurrencyTextFieldProps<TextFieldValues, TextFieldName>,
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <NumericFormat
      {...rest}
      {...fieldRest}
      getInputRef={ref}
      error={!!error}
      fixedDecimalScale
      decimalScale={2}
      helperText={error?.message}
      customInput={TextField}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        },
      }}
    />
  );
};

export default ControlledCurrencyTextField;
