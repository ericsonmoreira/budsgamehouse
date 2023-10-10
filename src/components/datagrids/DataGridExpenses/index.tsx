import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import NoDataOverlay from '../../NoDataOverlay';
import TypographyBalance from '../../Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ActionsCell from '../../cells/ActionsCell';

type DataGridExpensesRowData = Expense & {
  actions: {
    handleView(): void;
  };
};

type DataGridExpensesProps = {
  rows?: DataGridExpensesRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nome',
    flex: 1,
  },
  {
    field: 'value',
    headerName: 'Valor',
    flex: 1,
    renderCell: ({ row }) => <TypographyBalance balance={-row.value} />,
  },
  {
    field: 'createdAt',
    headerName: 'Data',
    flex: 1,
    valueFormatter: ({ value }) => format(value.toDate(), 'PPPp', { locale: ptBR }),
  },
  {
    field: 'actions',
    headerName: '',
    width: 24,
    align: 'right',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<{
        handleView(): void;
      }>
    ) => <ActionsCell handleView={params.value?.handleView} />,
  },
];

const DataGridExpenses: React.FC<DataGridExpensesProps> = ({ rows = [], loading }) => {
  return (
    <DataGrid
      rows={rows}
      density="compact"
      columns={columns}
      disableColumnMenu={false}
      components={{
        Toolbar: GridToolbar,
        NoRowsOverlay: () => <NoDataOverlay />,
        NoResultsOverlay: () => <NoDataOverlay />,
      }}
      disableSelectionOnClick
      loading={loading}
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
};

export default DataGridExpenses;
