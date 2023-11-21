import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { format, subMonths } from 'date-fns';
import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import SalesChartBar from '../../components/charts/SalesChartBar';
import DataGridProductsSales from '../../components/datagrids/DataGridProductsSales';
import DataGridSales from '../../components/datagrids/DataGridSales';
import ViewSaleDialog from '../../components/dialogs/sales/ViewSaleDialog';
import useSalesPerMonth from '../../hooks/useSalesPerMonth';

const Sales: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(Date.now(), 'MM/yyyy'));

  const [mes, ano] = selectedMonth.split('/');

  // Pegando o Objeto Date do Mês selecionado
  const { data: sales, isLoading } = useSalesPerMonth(new Date(`${ano}-${mes}-01T00:00:00`));

  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);

  const [saleToview, setSaleToview] = useState<Sale>({} as Sale);

  // últimos 12 meses
  const lastTwelveMonths = useMemo(() => {
    const now = Date.now();

    const months: string[] = []; // MM/yyyy

    for (let i = 0; i < 12; i++) {
      const data = subMonths(now, i);

      const mesAno = format(data, 'MM/yyyy');
      months.push(mesAno);
    }

    return months;
  }, []);

  const handleView = (sale: Sale) => {
    setSaleToview(sale);

    setViewSaleDialogOpen(true);
  };

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
          <SalesChartBar sales={sales} />
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
