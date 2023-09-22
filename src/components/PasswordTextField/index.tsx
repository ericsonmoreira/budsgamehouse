import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { useState } from 'react';

const PasswordTextField: React.FC<TextFieldProps> = (props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={isPasswordVisible ? 'text' : 'password'}
      autoComplete="current-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton disableRipple onClick={() => setIsPasswordVisible((old) => !old)}>
              {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordTextField;
