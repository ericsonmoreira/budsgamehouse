import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledDateTimePicker<
  DateFieldValues extends FieldValues,
  DateFieldName extends FieldPath<DateFieldValues>,
> = UseControllerProps<DateFieldValues, DateFieldName> &
  DateTimePickerProps<Date>;

const ControlledDateTimePicker = <
  DateFieldValues extends FieldValues,
  DateFieldName extends FieldPath<DateFieldValues>,
>(
  props: ControlledDateTimePicker<DateFieldValues, DateFieldName>,
) => {
  const { control, name, slotProps, ...rest } = props;

  const {
    field: { ref, ...fieldRest },
    fieldState: { error },
  } = useController({ control, name });

  return (
    <DateTimePicker
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

export default ControlledDateTimePicker;
