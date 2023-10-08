import PhoneIcon from '@mui/icons-material/Phone';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

type ControlledPhoneTextFieldProps<
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
> = UseControllerProps<TextFieldValues, TextFieldName> & PatternFormatProps<TextFieldProps>;

const ControlledPhoneTextField = <
  TextFieldValues extends FieldValues,
  TextFieldName extends FieldPath<TextFieldValues>
>(
  props: ControlledPhoneTextFieldProps<TextFieldValues, TextFieldName>
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
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <PhoneIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ControlledPhoneTextField;
