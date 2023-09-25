import { TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import PasswordTextField from '../../PasswordTextField';

type ControlledPasswordTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & TextFieldProps;

const ControlledPasswordTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledPasswordTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return <PasswordTextField {...rest} {...fieldRest} inputRef={ref} error={!!error} helperText={error?.message} />;
};

export default ControlledPasswordTextField;
