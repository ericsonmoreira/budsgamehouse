import { DateField, DateFieldProps } from "@mui/x-date-pickers";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledDateField<
  DateFieldValues extends FieldValues,
  DateFieldName extends FieldPath<DateFieldValues>,
> = UseControllerProps<DateFieldValues, DateFieldName> & DateFieldProps<Date>;

const ControlledDateField = <
  DateFieldValues extends FieldValues,
  DateFieldName extends FieldPath<DateFieldValues>,
>(
  props: ControlledDateField<DateFieldValues, DateFieldName>,
) => {
  const { control, name, slotProps, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <DateField
      slotProps={{
        ...slotProps,
        textField: {
          ...slotProps?.textField,
          error: !!error,
          helperText: error?.message,
        },
      }}
      {...rest}
      {...fieldRest}
      inputRef={ref}
    />
  );
};

export default ControlledDateField;
