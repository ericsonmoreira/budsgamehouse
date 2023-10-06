import { Box, Typography } from '@mui/material';
import React from 'react';
import useSales from '../../hooks/useSales';
import DataGridSales from '../../components/datagrids/DataGridSales';

const Sales: React.FC = () => {
  const { data: sales, isLoading } = useSales();

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Vendas
        </Typography>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridSales rows={sales} loading={isLoading} />
      </Box>
    </>
  );
};

export default Sales;
