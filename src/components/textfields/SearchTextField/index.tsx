import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material';
import React from 'react';

type SearchTextFieldProps = {
  handleClearSearchTerm: () => void;
} & TextFieldProps;

const SearchTextField: React.FC<SearchTextFieldProps> = ({ handleClearSearchTerm, ...rest }) => {
  return (
    <TextField
      {...rest}
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
