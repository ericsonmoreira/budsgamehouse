import { TextFieldProps } from "@mui/material";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import PasswordTextField from "../PasswordTextField";

type ControlledPasswordTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
};

const ControlledPasswordTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledPasswordTextFieldProps<TextFieldValues, TextFieldName>
) => {
  const { control, name, textFieldProps } = props;

  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <PasswordTextField
      {...field}
      {...textFieldProps}
      error={!!error}
      helperText={error?.message}
    />
  );
};

export default ControlledPasswordTextField;
