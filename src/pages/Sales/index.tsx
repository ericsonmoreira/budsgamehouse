import { Box, useTheme } from '@mui/material';
import { format, parse } from 'date-fns';
import React, { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import DataGridSales from '../../components/datagrids/DataGridSales';
import ViewSaleDialog from '../../components/dialogs/sales/ViewSaleDialog';
import useSales from '../../hooks/useSales';
import { formatterCurrencyBRL } from '../../utils/formatters';

const Sales: React.FC = () => {
  const { palette, typography } = useTheme();

  const { data: sales, isLoading } = useSales();

  const [viewSaleDialogOpen, setViewSaleDialogOpen] = useState(false);

  const [saleToview, setSaleToview] = useState<Sale>({} as Sale);

  const handleView = (sale: Sale) => {
    setSaleToview(sale);

    setViewSaleDialogOpen(true);
  };

  const calculateSalesByDayOfMonth = useMemo(() => {
    const salesByDayOfMonth: { day: string; value: number }[] = [];

    if (sales) {
      for (const sale of sales) {
        const day = format(sale.createdAt.toDate(), 'yy/MM/dd');

        const value = sale.products.reduce((acc, curr) => acc + curr.amount * curr.price, 0);

        const existingDay = salesByDayOfMonth.find((item) => item.day === day);

        if (existingDay) {
          existingDay.value += value;
        } else {
          salesByDayOfMonth.push({
            value,
            day,
          });
        }
      }
    }

    salesByDayOfMonth.sort((a, b) => a.day.localeCompare(b.day));

    return salesByDayOfMonth;
  }, [sales]);

  return (
    <Page>
      <PageHeader title="Vendas" />
      <Box p={1}>
        <Chart
          type="bar"
          options={{
            title: {
              text: 'Vendas por dia',
              align: 'center',
            },
            dataLabels: {
              formatter: (value) => formatterCurrencyBRL.format(Number(value)),
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: 'bottom',
                },
              },
            },
            theme: {
              mode: palette.mode,
            },
            chart: {
              id: 'sales',
              fontFamily: typography.fontFamily,
            },
            xaxis: {
              categories: calculateSalesByDayOfMonth.map((elem) => elem.day),
              labels: {
                formatter: (value) => format(parse(value, 'yy/MM/dd', new Date()), 'dd/MM'),
              },
            },
            yaxis: {
              labels: {
                formatter: (value) => formatterCurrencyBRL.format(value),
              },
            },
          }}
          series={[
            {
              name: 'Vendas por dia',
              data: calculateSalesByDayOfMonth.map((elem) => elem.value),
            },
          ]}
          width="100%"
          height="200"
        />
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
