import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { PhoneIcon } from "../../../icons";

type ControlledPhoneTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
> = UseControllerProps<TextFieldValues, TextFieldName> &
  Omit<PatternFormatProps<TextFieldProps>, "format">;

const ControlledPhoneTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>,
>(
  props: ControlledPhoneTextFieldProps<TextFieldValues, TextFieldName>,
) => {
  const { control, name, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <PatternFormat
      {...rest}
      {...fieldRest}
      getInputRef={ref}
      customInput={TextField}
      error={!!error}
      helperText={error?.message}
      format="(##) #####-####"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
          inputMode: "tel",
        },
      }}
    />
  );
};

export default ControlledPhoneTextField;
