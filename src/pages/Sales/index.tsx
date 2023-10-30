import { Box, MenuItem, TextField } from '@mui/material';
import { format, subMonths } from 'date-fns';
import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import SalesChartBar from '../../components/charts/SalesChartBar';
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

      <Box p={1}>
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
        <SalesChartBar sales={sales} />
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
    </Page>
  );
};

export default Sales;
