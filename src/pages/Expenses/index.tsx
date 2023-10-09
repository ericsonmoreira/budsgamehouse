import { useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import AddExpenseDialog from '../../components/dialogs/expenses/AddExpenseDialog';

const Expenses: React.FC = () => {
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false);

  return (
    <Page>
      <PageHeader title="Despesas" onClickAddButton={() => setOpenAddExpenseDialog(true)} />
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
