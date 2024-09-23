import { Paper, PaperProps } from '@mui/material';
import React from 'react';

const PaperGlass: React.FC<PaperProps> = (props) => {
  return (
    <Paper
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
      }}
    />
  );
};

export default PaperGlass;
