import { TextField, TextFieldProps } from "@mui/material";
import {
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

type ControlledTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & {
  textFieldProps?: TextFieldProps;
};

const ControlledTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledTextFieldProps<TextFieldValues, TextFieldName>
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

export default ControlledTextField;
