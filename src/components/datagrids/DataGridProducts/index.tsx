import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import NoDataOverlay from '../../NoDataOverlay';
import ActionsCell from '../../cells/ActionsCell';

type DataGridProductsRowData = Product & {
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridProductsProps = {
  rows?: DataGridProductsRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: 'Imagem',
    headerName: '',
    width: 100,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) =>
      row.imgUrl && <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={row.imgUrl} />,
  },
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'category', headerName: 'Categoria', flex: 1 },
  {
    field: 'price',
    headerName: 'Preço',
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
  },
  {
    field: 'stock',
    headerName: 'Quantidade em Estoque',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 150,
    headerAlign: 'right',
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

const DataGridProducts: React.FC<DataGridProductsProps> = ({ rows = [], loading }) => {
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

export default DataGridProducts;
