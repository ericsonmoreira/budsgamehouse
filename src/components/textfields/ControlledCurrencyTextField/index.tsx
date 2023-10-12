import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

type ControlledCurrencyTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & NumericFormatProps<TextFieldProps>;

const ControlledCurrencyTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledCurrencyTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, onChange, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <NumericFormat
      {...rest}
      {...fieldRest}
      getInputRef={ref}
      error={!!error}
      helperText={error?.message}
      customInput={TextField}
      allowLeadingZeros
      fixedDecimalScale
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      onValueChange={(values) => onChange(values.floatValue ?? 0)}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      }}
    />
  );
};

export default ControlledCurrencyTextField;
