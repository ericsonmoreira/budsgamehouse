import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type ControlledAutocompleteProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
};

// TODO: implementar esse componenete
const ControlledAutocomplete = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
    props: ControlledAutocompleteProps<TextFieldValues, TextFieldName>
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
    />
  );
};

export default ControlledAutocomplete;
