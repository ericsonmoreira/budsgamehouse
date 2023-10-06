import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import AvatarPlayer from '../../AvatarPlayer';
import NoDataOverlay from '../../NoDataOverlay';
import TypographyBalance from '../../Typography';
import ActionsCell from '../../cells/ActionsCell';

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
    renderCell: ({ row }) => <AvatarPlayer sx={{ width: 24, height: 24 }} player={row} />,
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

export default DataGridBalances;
