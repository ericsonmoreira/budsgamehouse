import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatterCurrencyBRL } from '../../../utils/formatters';

type DataGridSalesProps = {
  rows?: Sale[];
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
    valueFormatter: ({ value }) => format(value.toDate(), 'PPPp', { locale: ptBR }),
  },
];

const DataGridSales: React.FC<DataGridSalesProps> = ({ rows = [], loading }) => {
  return (
    <DataGrid
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
      }}
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
