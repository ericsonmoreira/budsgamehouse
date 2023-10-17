import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import AvatarPlayer from '../../AvatarPlayer';
import NoDataOverlay from '../../NoDataOverlay';
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
    headerName: '',
    align: 'center',
    width: 20,
    renderCell: ({ row }) =>
      row.playerId ? <AvatarPlayer sx={{ width: 24, height: 24 }} playerId={row.playerId} /> : null,
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
    valueFormatter: ({ value }) => format(value.toDate(), 'PPPp', { locale: ptBR }),
  },
  {
    field: 'actions',
    headerName: '',
    width: 24,
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
      initialState={{
        sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
      }}
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

export default DataGridSales;
