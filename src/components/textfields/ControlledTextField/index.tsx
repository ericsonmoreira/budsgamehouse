import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

type ControlledTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
  children?: React.ReactNode;
};

const ControlledTextField = <TextFieldValues extends FieldValues, TextFieldName extends FieldPath<TextFieldValues>>(
  props: ControlledTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, textFieldProps, children } = props;

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField {...field} {...textFieldProps} error={!!error} helperText={error?.message}>
      {children}
    </TextField>
  );
};

export default ControlledTextField;
