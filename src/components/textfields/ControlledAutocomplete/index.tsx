import { TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';

type ControlledAutocompleteProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & TextFieldProps;

// TODO: implementar esse componenete
const ControlledAutocomplete = <TextFieldValues extends FieldValues, TextFieldName extends FieldPath<TextFieldValues>>(
  props: ControlledAutocompleteProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return <TextField {...rest} {...fieldRest} inputRef={ref} error={!!error} helperText={error?.message} />;
};

export default ControlledAutocomplete;
