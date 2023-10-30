import { useTheme } from '@mui/material';
import { format, parse } from 'date-fns';
import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { formatterCurrencyBRL } from '../../../utils/formatters';

type SalesChartBarProps = {
  sales: Sale[] | undefined;
};

const SalesChartBar: React.FC<SalesChartBarProps> = ({ sales }) => {
  const { palette, typography } = useTheme();

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
    <Chart
      type="bar"
      options={{
        title: {
          text: 'Vendas por dia',
          align: 'center',
        },
        dataLabels: {
          enabled: false,
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
      height="200px"
    />
  );
};

export default SalesChartBar;
