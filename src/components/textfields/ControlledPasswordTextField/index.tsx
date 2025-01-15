import PasswordTextField from "@/components/PasswordTextField";
import { TextFieldProps } from "@mui/material";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledPasswordTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
> = UseControllerProps<TextFieldValues, TextFieldName> & TextFieldProps;

const ControlledPasswordTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
>(
  props: ControlledPasswordTextFieldProps<TextFieldValues, TextFieldName>,
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <PasswordTextField
      {...rest}
      {...fieldRest}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
      slotProps={{
        input: {
          inputMode: "email",
        },
      }}
    />
  );
};

export default ControlledPasswordTextField;
