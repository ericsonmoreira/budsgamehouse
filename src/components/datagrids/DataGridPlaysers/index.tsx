import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import AvatarPlayer from '../../AvatarPlayer';
import ActionsCell from '../../cells/ActionsCell';
import NoDataOverlay from '../../NoDataOverlay';

type DataGridPlaysersRowData = {
  id: string;
  name: string;
  email: string;
  avatarImgUrl?: string;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridPlaysersProps = {
  rows?: DataGridPlaysersRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'avatar',
    headerName: '',
    width: 30,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => <AvatarPlayer playerId={row.id} sx={{ width: 24, height: 24 }} />,
  },
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
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

const DataGridPlaysers: React.FC<DataGridPlaysersProps> = ({ rows = [], loading }) => {
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

export default DataGridPlaysers;
