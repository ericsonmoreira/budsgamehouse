import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

const Balances: React.FC = () => {
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
        Saldos
      </Typography>
      <Tooltip title="Add">
        <IconButton color="secondary">
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Balances;
