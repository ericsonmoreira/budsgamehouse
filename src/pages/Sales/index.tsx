import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import useSales from '../../hooks/useSales';
import DataGridSales from '../../components/datagrids/DataGridSales';
import ViewSaleDialog from '../../components/dialogs/sales/ViewSaleDialog';

const Sales: React.FC = () => {
  const { data: sales, isLoading } = useSales();

  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);

  const [saleToview, setSaleToview] = useState<Sale>({} as Sale);

  const handleView = (sale: Sale) => {
    setSaleToview(sale);

    setViewSaleDialogOpen(true);
  };

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
        <DataGridSales
          rows={sales?.map((sale) => ({ ...sale, actions: { handleView: () => handleView(sale) } }))}
          loading={isLoading}
        />
      </Box>
      <ViewSaleDialog
        title="Venda"
        subTitle="Informações sobre a Venda..."
        open={viewSaleDialogOpen}
        setOpen={setViewSaleDialogOpen}
        saleToview={saleToview}
      />
    </>
  );
};

export default Sales;
