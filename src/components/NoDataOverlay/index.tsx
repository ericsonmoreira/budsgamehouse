import { Box, Typography } from '@mui/material';
import React from 'react';
import NotDataImg from '../../assets/noData.svg';

const NoDataOverlay: React.FC<React.HTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Typography variant="inherit" gutterBottom>
        Não há linhas para mostrar...
      </Typography>
      <img {...props} src={NotDataImg} style={{ width: '50%', maxWidth: '300px' }} />
    </Box>
  );
};

export default NoDataOverlay;
