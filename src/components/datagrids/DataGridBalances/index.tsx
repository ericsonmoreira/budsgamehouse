import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AvatarPlayer from '../../AvatarPlayer';
import TypographyBalance from '../../TypographyBalance';
import ActionsCell from '../../cells/ActionsCell';
import CustomDataGrid from '../CustomDataGrid';

type DataGridBalancesRowData = Player & {
  actions: {
    handleUpdate(): void;
    handleTransfer(): void;
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
    width: 24,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => <AvatarPlayer sx={{ width: 24, height: 24 }} playerId={row.id} />,
  },
  {
    field: 'name',
    headerName: 'Nome',
    flex: 1,
  },
  {
    field: 'phone',
    headerName: 'Telefone',
    flex: 1,
    sortable: false,
  },
  {
    field: 'balance',
    headerName: 'Saldo',
    flex: 1,
    renderCell: ({ row }) => <TypographyBalance balance={row.balance} />,
  },
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
        handleTransfer(): void;
      }>
    ) => <ActionsCell handleUpdate={params.value?.handleUpdate} handleTransfer={params.value?.handleTransfer} />,
  },
];

const DataGridBalances: React.FC<DataGridBalancesProps> = ({ rows = [], loading }) => {
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

export default DataGridBalances;
