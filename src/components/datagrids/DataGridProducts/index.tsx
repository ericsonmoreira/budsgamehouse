import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import ActionsCell from '../../cells/ActionsCell';
import CustomDataGrid from '../CustomDataGrid';

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
    width: 20,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) =>
      row.imgUrl && <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={row.imgUrl} />,
  },
  { field: 'name', headerName: 'Nome', flex: 2 },
  { field: 'category', headerName: 'Categoria', flex: 1 },
  {
    field: 'price',
    headerName: 'Preço',
    flex: 1,
    minWidth: 80,
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
  },
  {
    field: 'stock',
    headerName: 'Estoque',
    headerAlign: 'right',
    align: 'right',
    maxWidth: 60,
  },
  {
    field: 'actions',
    headerName: '',
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
    <CustomDataGrid
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
      }}
      columns={columns}
      loading={loading}
    />
  );
};

export default DataGridProducts;
