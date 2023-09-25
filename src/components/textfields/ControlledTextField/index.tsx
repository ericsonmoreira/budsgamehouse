import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';

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
    field: { ref, ...rest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <TextField {...rest} {...textFieldProps} inputRef={ref} error={!!error} helperText={error?.message}>
      {children}
    </TextField>
  );
};

export default ControlledTextField;
