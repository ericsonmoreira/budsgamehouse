import { Box, Typography } from '@mui/material';
import React from 'react';
import NotFoundImg from '../../assets/404.svg';

const NotFoundPage: React.FC = () => {
  return (
    <Box width={1} height={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography gutterBottom variant="h3" color="textPrimary">
        Contúdo não encontrado
      </Typography>
      <img src={NotFoundImg} width="50%" />
    </Box>
  );
};

export default NotFoundPage;
