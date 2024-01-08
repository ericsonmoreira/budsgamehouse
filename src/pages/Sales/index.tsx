import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import SalesAndPaymentsChartBar from '../../components/charts/SalesAndPaymentsChartBar';
import DataGridProductsSales from '../../components/datagrids/DataGridProductsSales';
import DataGridSales from '../../components/datagrids/DataGridSales';
import ViewSaleDialog from '../../components/dialogs/sales/ViewSaleDialog';
import useLastTwelveMonths from '../../hooks/useLastTwelveMonths';
import usePaymentsPerMonth from '../../hooks/usePaymentsPerMonth';
import useSalesPerMonth from '../../hooks/useSalesPerMonth';

const Sales: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(Date.now(), 'MM/yyyy'));

  const [mes, ano] = selectedMonth.split('/');

  const { data: sales, isLoading: isLoadingSalesPerMonth } = useSalesPerMonth(new Date(`${ano}-${mes}-01T00:00:00`));

  const { data: payments, isLoading: isLoadingPaymentsPerMonth } = usePaymentsPerMonth(
    new Date(`${ano}-${mes}-01T00:00:00`)
  );

  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);

  const [saleToview, setSaleToview] = useState<Sale>({} as Sale);

  const lastTwelveMonths = useLastTwelveMonths(12);

  const handleView = (sale: Sale) => {
    setSaleToview(sale);

    setViewSaleDialogOpen(true);
  };

  const isLoading = useMemo(
    () => isLoadingSalesPerMonth || isLoadingPaymentsPerMonth,
    [isLoadingSalesPerMonth, isLoadingPaymentsPerMonth]
  );

  return (
    <Page>
      <PageHeader title="Vendas" />
      <Grid container component={Box} p={1} spacing={1}>
        <Grid item xs={12}>
          <TextField
            select
            label="Mês"
            variant="outlined"
            size="small"
            margin="normal"
            value={selectedMonth}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedMonth(event.target.value);
            }}
          >
            {lastTwelveMonths.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <SalesAndPaymentsChartBar sales={sales} payments={payments} month={selectedMonth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="text.secondary" gutterBottom>
            Produtos vendidos
          </Typography>
          <Box sx={{ height: 500 }}>
            <DataGridProductsSales sales={sales} loading={isLoading} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="text.secondary" gutterBottom>
            Vendas Realizadas
          </Typography>
          <Box sx={{ height: 500 }}>
            <DataGridSales
              rows={sales?.map((sale) => ({ ...sale, actions: { handleView: () => handleView(sale) } }))}
              loading={isLoading}
            />
          </Box>
        </Grid>
      </Grid>
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
