import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { NumberFormatBase, NumberFormatBaseProps } from 'react-number-format';
import { FormatInputValueFunction } from 'react-number-format/types/types';
import { formatterDecimal } from '../../../utils/formatters';

type ControlledCurrencyTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & NumberFormatBaseProps<TextFieldProps>;

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

  const format: FormatInputValueFunction = (numString) => {
    const numSanitized = numString.replace(/[^0-9.]/g, '');

    return formatterDecimal.format(Number(numSanitized || 0) / 100);
  };

  return (
    <NumberFormatBase
      {...rest}
      {...fieldRest}
      value={null}
      getInputRef={ref}
      error={!!error}
      helperText={error?.message}
      customInput={TextField}
      format={format}
      onValueChange={(values) => onChange((values.floatValue || 0) / 100)}
      InputProps={{
        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
      }}
    />
  );
};

export default ControlledCurrencyTextField;
