import { Box } from '@mui/material';
import { useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import DataGridExpenses from '../../components/datagrids/DataGridExpenses';
import AddExpenseDialog from '../../components/dialogs/expenses/AddExpenseDialog';
import useExpenses from '../../hooks/useExpenses';
import { useNavigate } from 'react-router-dom';
import routesNames from '../../routes/routesNames';

const Expenses: React.FC = () => {
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);

  const navigate = useNavigate();

  const { data: expenses, isLoading } = useExpenses();

  return (
    <Page>
      <PageHeader title="Despesas" onClickAddButton={() => setOpenAddExpenseDialog(true)} />
      <Box m={1} height={1}>
        <DataGridExpenses
          loading={isLoading}
          rows={expenses?.map((expense) => ({
            ...expense,
            actions: {
              handleView: () => navigate(routesNames.VIEW_EXPENSE.replace(':id', expense.id)),
            },
          }))}
        />
      </Box>
      <AddExpenseDialog
        title="Criar uma nova Despesa"
        subTitle="Uma despesa representa contas pagas com aquisição de produtos ou custos permanentes."
        open={openAddExpenseDialog}
        setOpen={setOpenAddExpenseDialog}
      />
    </Page>
  );
};

export default Expenses;
