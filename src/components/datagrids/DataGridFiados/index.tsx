import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { memo } from 'react';
import usePlayer from '../../../hooks/usePlayer';
import { formatterCurrencyBRL } from '../../../utils/formatters';
import AvatarPlayer from '../../AvatarPlayer';
import ActionsCell from '../../cells/ActionsCell';

type DataGridFiadosRowData = Fiado & {
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridFiadosProps = {
  rows?: DataGridFiadosRowData[];
  loading?: boolean;
};

const PlayerNameCellMemo = memo(function PlayerNameCell({ id }: { id: string }) {
  const { data } = usePlayer(id);

  return <Typography variant="inherit">{data?.name}</Typography>;
});

const AvatarPlayerCellMemo = memo(function PlayerNameCell({ id }: { id: string }) {
  const { data } = usePlayer(id);

  return data ? <AvatarPlayer sx={{ width: 20, height: 20 }} player={data} /> : null;
});

const columns: GridColDef[] = [
  {
    field: 'Imagem',
    headerName: '',
    width: 30,
    align: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => <AvatarPlayerCellMemo id={row.playerId} />,
  },
  {
    field: 'playerId',
    headerName: 'Nome',
    flex: 1,
    renderCell: ({ row }) => <PlayerNameCellMemo id={row.playerId} />,
  },
  {
    field: 'value',
    headerName: 'Valor',
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
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

const DataGridFiados: React.FC<DataGridFiadosProps> = ({ rows = [], loading }) => {
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

export default DataGridFiados;
