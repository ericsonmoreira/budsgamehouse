import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import NoDataOverlay from '../../NoDataOverlay';
import ActionsCell from '../../cells/ActionsCell';
import ImageCell from '../../cells/ImageCell';

type DataGridTradingCardsRowData = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridTradingCardsProps = {
  rows?: DataGridTradingCardsRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'imgUrl',
    headerName: '',
    width: 20,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ value }) => <ImageCell value={value} />,
  },
  { field: 'name', headerName: 'Nome', flex: 2 },
  { field: 'amount', headerName: 'Quantidade', flex: 1, maxWidth: 100, align: 'right' },
  {
    field: 'actions',
    headerName: '',
    width: 80,
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

const DataGridTradingCards: React.FC<DataGridTradingCardsProps> = ({
  rows = [], // default enpty array
  loading,
}) => {
  return (
    <DataGrid
      rows={rows}
      density="compact"
      initialState={{
        sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
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

export default DataGridTradingCards;
