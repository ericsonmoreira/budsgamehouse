import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Fiados: React.FC = () => {
  return (
    <Box
      sx={{
        margin: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h4" color="textPrimary">
        Fiados
      </Typography>
      <Tooltip title="Add">
        <IconButton color="secondary">
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Fiados;
