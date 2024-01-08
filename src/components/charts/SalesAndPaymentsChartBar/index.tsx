import { useTheme } from '@mui/material';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { formatterCurrencyBRL } from '../../../utils/formatters';

type SalesAndPaymentsChartBarProps = {
  sales: Sale[] | undefined;
  payments: Payment[] | undefined;
  month: string;
};

const SalesAndPaymentsChartBar: React.FC<SalesAndPaymentsChartBarProps> = ({ sales, payments, month }) => {
  const { palette, typography } = useTheme();

  const [mes, ano] = month.split('/');

  const primeiroDia = startOfMonth(new Date(Number(ano), Number(mes) - 1));

  const ultimoDia = endOfMonth(new Date(Number(ano), Number(mes) - 1));

  const todasAsDatasDoMes = eachDayOfInterval({ start: primeiroDia, end: ultimoDia });

  const calculateSalesByDayOfMonth = useMemo(() => {
    const salesByDayOfMonth: { day: string; value: number }[] = [];

    if (sales) {
      for (const sale of sales) {
        const day = format(sale.createdAt.toDate(), 'yy/MM/dd');

        const value = sale.products.reduce((acc, curr) => acc + curr.amount * curr.price, 0) + (sale?.looseValue || 0);

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

  const calculatePaymentsByDayOfMonth = useMemo(() => {
    const paymentsByDayOfMonth: { day: string; value: number }[] = [];

    if (payments) {
      for (const payment of payments) {
        const day = format(payment.createdAt.toDate(), 'yy/MM/dd');

        const value = payment.value;

        const existingDay = paymentsByDayOfMonth.find((item) => item.day === day);

        if (existingDay) {
          existingDay.value += value;
        } else {
          paymentsByDayOfMonth.push({
            value,
            day,
          });
        }
      }
    }

    paymentsByDayOfMonth.sort((a, b) => a.day.localeCompare(b.day));

    return paymentsByDayOfMonth;
  }, [payments]);

  return (
    <Chart
      type="line"
      options={{
        title: {
          text: 'Vendas & Pagamentos por dia',
          align: 'center',
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
          formatter: (val: number) => formatterCurrencyBRL.format(val),
        },
        theme: {
          mode: palette.mode,
        },
        chart: {
          id: 'sales',
          fontFamily: typography.fontFamily,
        },
        stroke: {
          width: [0, 4],
        },
        xaxis: {
          categories: todasAsDatasDoMes.map((value) => format(value, 'dd/MM')),
        },
        yaxis: [
          {
            title: {
              text: 'Vendas',
            },
            labels: {
              formatter: (value) => formatterCurrencyBRL.format(value ?? 0),
            },
          },
          {
            title: {
              text: 'Pagamentos',
            },
            labels: {
              formatter: (value) => formatterCurrencyBRL.format(value ?? 0),
            },
            opposite: true,
          },
        ],
      }}
      series={[
        {
          name: 'Vendas do dia',
          type: 'column',
          data: calculateSalesByDayOfMonth.map((elem) => elem.value),
        },
        {
          name: 'Pagamentos do dia',
          type: 'line',
          data: calculatePaymentsByDayOfMonth.map((elem) => elem.value),
        },
      ]}
      width="100%"
      height="200px"
    />
  );
};

export default SalesAndPaymentsChartBar;
