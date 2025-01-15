import { DeleteIcon, SearchIcon } from "@/icons";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
} from "@mui/material";

type SearchTextFieldProps = {
  handleClearSearchTerm: () => void;
} & TextFieldProps;

function SearchTextField({
  handleClearSearchTerm,
  ...rest
}: SearchTextFieldProps) {
  return (
    <TextField
      {...rest}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Stack
                direction="row"
                spacing={1}
                display="flex"
                alignItems="center"
              >
                <SearchIcon color="disabled" fontSize="inherit" />
                <IconButton size="small" onClick={handleClearSearchTerm}>
                  <DeleteIcon color="inherit" fontSize="inherit" />
                </IconButton>
              </Stack>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default SearchTextField;
