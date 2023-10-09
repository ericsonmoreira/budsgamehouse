import { Box } from '@mui/material';
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import DataGridSales from '../../components/datagrids/DataGridSales';
import ViewSaleDialog from '../../components/dialogs/sales/ViewSaleDialog';
import useSales from '../../hooks/useSales';
import Page from '../../components/Page';

const Sales: React.FC = () => {
  const { data: sales, isLoading } = useSales();

  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);

  const [saleToview, setSaleToview] = useState<Sale>({} as Sale);

  const handleView = (sale: Sale) => {
    setSaleToview(sale);

    setViewSaleDialogOpen(true);
  };

  return (
    <Page>
      <PageHeader title="Vendas" />
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
    </Page>
  );
};

export default Sales;
