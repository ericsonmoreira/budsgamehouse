import { formatterCurrencyBRL } from "@/utils/formatters";
import { Box, Paper } from "@mui/material";
import {
  AllSeriesType,
  BarPlot,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { useMemo } from "react";

type SalesAndPaymentsChartBarProps = {
  sales: Sale[] | undefined;
  payments: Payment[] | undefined;
  month: string;
};

function SalesAndPaymentsChartBar({
  sales,
  payments,
  month,
}: SalesAndPaymentsChartBarProps) {
  const [mes, ano] = month.split("/");

  const primeiroDia = startOfMonth(new Date(Number(ano), Number(mes) - 1));

  const ultimoDia = endOfMonth(new Date(Number(ano), Number(mes) - 1));

  const todasAsDatasDoMes = eachDayOfInterval({
    start: primeiroDia,
    end: ultimoDia,
  });

  const calculateSalesByDayOfMonth = useMemo<
    { day: string; value: number }[]
  >(() => {
    const salesByDayOfMonth: { day: string; value: number }[] =
      todasAsDatasDoMes.map((date) => ({
        day: format(date, "dd/MM"),
        value: 0,
      }));

    if (sales) {
      for (const sale of sales) {
        const day = format(sale.createdAt.toDate(), "dd/MM");

        const value =
          sale.products.reduce(
            (acc, curr) => acc + curr.amount * curr.price,
            0,
          ) + (sale?.looseValue || 0);

        const existingDayIndex = salesByDayOfMonth.findIndex(
          (item) => item.day === day,
        );

        if (existingDayIndex >= 0) {
          salesByDayOfMonth[existingDayIndex].value += value;
        }
      }
    }

    return salesByDayOfMonth;
  }, [sales, todasAsDatasDoMes]);

  const calculatePaymentsByDayOfMonth = useMemo(() => {
    const paymentsByDayOfMonth: { day: string; value: number }[] =
      todasAsDatasDoMes.map((date) => ({
        day: format(date, "dd/MM"),
        value: 0,
      }));

    if (payments) {
      for (const payment of payments) {
        const day = format(payment.createdAt.toDate(), "dd/MM");

        const value = payment.value;

        const existingDayIndex = paymentsByDayOfMonth.findIndex(
          (item) => item.day === day,
        );

        if (existingDayIndex >= 0) {
          paymentsByDayOfMonth[existingDayIndex].value += value;
        }
      }
    }

    paymentsByDayOfMonth.sort((a, b) => a.day.localeCompare(b.day));

    return paymentsByDayOfMonth;
  }, [payments, todasAsDatasDoMes]);

  const series = useMemo<AllSeriesType[]>(
    () => [
      {
        type: "bar",
        label: "Venda",
        data: calculateSalesByDayOfMonth.map((elem) => elem.value),
        valueFormatter: (value) => formatterCurrencyBRL.format(value as number),
      },
      {
        type: "line",
        label: "Pagamento",
        data: calculatePaymentsByDayOfMonth.map((elem) => elem.value),
        valueFormatter: (value) => formatterCurrencyBRL.format(value as number),
      },
    ],
    [calculateSalesByDayOfMonth, calculatePaymentsByDayOfMonth],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", height: 300 }} variant="outlined">
        <ResponsiveChartContainer
          title="Vendas & Pagamentos por dia"
          series={series}
          xAxis={[
            {
              id: "days",
              data: todasAsDatasDoMes,
              scaleType: "band",
              valueFormatter: (date: Date) => format(date, "dd/MM"),
            },
          ]}
        >
          <BarPlot />
          <LinePlot />
          <ChartsTooltip />
          <ChartsXAxis label="Dias" position="bottom" axisId="days" />
          <ChartsYAxis label="Vendas (R$)" position="left" />
          <ChartsYAxis label="Pagamentos (R$)" position="right" />
        </ResponsiveChartContainer>
      </Paper>
    </Box>
  );
}

export default SalesAndPaymentsChartBar;
