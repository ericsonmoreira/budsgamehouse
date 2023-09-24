import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import AvatarPlayer from '../../AvatarPlayer';
import ActionsCell from '../../cells/ActionsCell';
import TypographyBalance from '../../TypographyBalance';

type DataGridBalancesRowData = Player & {
  actions: {
    handleUpdate(): void;
  };
};

type DataGridBalancesProps = {
  rows?: DataGridBalancesRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'Imagem',
    headerName: '',
    width: 30,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => <AvatarPlayer player={row} />,
  },
  {
    field: 'name',
    headerName: 'Nome',
    flex: 1,
  },
  {
    field: 'balance',
    headerName: 'Saldo',
    renderCell: ({ row }) => <TypographyBalance balance={row.balance} />,
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 150,
    align: 'right',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<{
        handleUpdate(): void;
        handledelete(): void;
      }>
    ) => <ActionsCell handleUpdate={params.value?.handleUpdate} handledelete={params.value?.handledelete} />,
  },
];

const DataGridBalances: React.FC<DataGridBalancesProps> = ({ rows = [], loading }) => {
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

export default DataGridBalances;
