import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import ActionsCell from '../../cells/ActionsCell';

type DataGridSalesRowData = Sale & {
  actions: {
    handleView(): void;
  };
};

type DataGridSalesProps = {
  rows?: DataGridSalesRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'playerId',
    headerName: 'Jogador',
    flex: 1,
  },
  {
    field: 'products',
    headerName: 'Valor',
    flex: 1,
    valueGetter: ({ value }) =>
      value.reduce(
        (
          acc: number,
          curr: {
            amount: number;
            price: number;
          }
        ) => acc + curr.amount * curr.price,
        0
      ),
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
  },
  {
    field: 'createdAt',
    headerName: 'Data',
    flex: 1,
    valueFormatter: ({ value }) => format(value.toDate(), 'PPP', { locale: ptBR }),
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 100,
    headerAlign: 'right',
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

const DataGridSales: React.FC<DataGridSalesProps> = ({ rows = [], loading }) => {
  return (
    <DataGrid
      rows={rows}
      density="compact"
      columns={columns}
      disableColumnMenu={false}
      components={{ Toolbar: GridToolbar }}
      disableSelectionOnClick
      loading={loading}
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
};

export default DataGridSales;
