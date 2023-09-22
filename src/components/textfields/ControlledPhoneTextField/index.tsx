import { TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

type ControlledPhoneTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
};

const ControlledPhoneTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledPhoneTextFieldProps<TextFieldValues, TextFieldName>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inputComponent: PatternFormat as any,
        inputProps: {
          format: '(##) #####-####',
        },
      }}
    />
  );
};

export default ControlledPhoneTextField;
