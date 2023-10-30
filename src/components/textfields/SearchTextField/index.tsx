import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material';
import React, { useCallback } from 'react';

type SearchTextFieldProps = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
} & TextFieldProps;

const SearchTextField: React.FC<SearchTextFieldProps> = ({ setValue, ...rest }) => {
  const handleClearSearchTerm = useCallback(() => {
    setValue('');
  }, []);

  return (
    <TextField
      {...rest}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Stack direction="row" spacing={1} display="flex" alignItems="center">
              <SearchIcon color="disabled" fontSize="inherit" />
              <IconButton size="small" onClick={handleClearSearchTerm}>
                <DeleteIcon color="inherit" fontSize="inherit" />
              </IconButton>
            </Stack>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchTextField;
