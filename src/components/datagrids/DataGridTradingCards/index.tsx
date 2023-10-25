import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ActionsCell from '../../cells/ActionsCell';
import ImageCell from '../../cells/ImageCell';
import CustomDataGrid from '../CustomDataGrid';

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

const DataGridTradingCards: React.FC<DataGridTradingCardsProps> = ({ rows = [], loading }) => {
  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
      }}
      loading={loading}
    />
  );
};

export default DataGridTradingCards;
