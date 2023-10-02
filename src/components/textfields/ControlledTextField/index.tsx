import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';

type ControlledTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & TextFieldProps;

const ControlledTextField = <TextFieldValues extends FieldValues, TextFieldName extends FieldPath<TextFieldValues>>(
  props: ControlledTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return <TextField {...rest} {...fieldRest} inputRef={ref} error={!!error} helperText={error?.message} />;
};

export default ControlledTextField;
