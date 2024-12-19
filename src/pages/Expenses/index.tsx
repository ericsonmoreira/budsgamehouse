import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import DataGridExpenses from "../../components/datagrids/DataGridExpenses";
import AddExpenseDialog from "../../components/dialogs/expenses/AddExpenseDialog";
import useExpensesPerMonth from "../../hooks/useExpensesPerMonth";
import useLastTwelveMonths from "../../hooks/useLastTwelveMonths";
import routesNames from "../../routes/routesNames";

function Expenses() {
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);

  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(
    format(Date.now(), "MM/yyyy"),
  );

  const [mes, ano] = selectedMonth.split("/");

  const { data: expenses, isLoading } = useExpensesPerMonth(
    new Date(`${ano}-${mes}-01T00:00:00`),
  );

  const lastTwelveMonths = useLastTwelveMonths(12);

  return (
    <Page>
      <PageHeader
        title="Despesas"
        onClickAddButton={() => setOpenAddExpenseDialog(true)}
      />
      <Box height={1} px={1} pb={1} flexDirection="column" display="flex">
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
        <Typography color="text.secondary" gutterBottom>
          Despesas
        </Typography>
        <Box flex={1}>
          <DataGridExpenses
            loading={isLoading}
            rows={expenses?.map((expense) => ({
              ...expense,
              actions: {
                handleView: () =>
                  navigate(routesNames.VIEW_EXPENSE.replace(":id", expense.id)),
              },
            }))}
          />
        </Box>
      </Box>
      <AddExpenseDialog
        title="Criar uma nova Despesa"
        subTitle="Uma despesa representa contas pagas com aquisição de produtos ou custos permanentes."
        open={openAddExpenseDialog}
        setOpen={setOpenAddExpenseDialog}
      />
    </Page>
  );
}

export default Expenses;
