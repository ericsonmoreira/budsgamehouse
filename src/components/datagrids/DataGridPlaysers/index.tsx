import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import AvatarPlayer from "../../AvatarPlayer";

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
    field: "avatar",
    headerName: "",
    width: 30,
    align: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => (
      <AvatarPlayer player={row} sx={{ width: 24, height: 24 }} />
    ),
  },
  { field: "name", headerName: "Nome", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  {
    field: "actions",
    headerName: "Ações",
    width: 150,
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: (
      params: GridRenderCellParams<{
        handleUpdate(): void;
        handledelete(): void;
      }>
    ) => (
      <Box>
        <Tooltip title="Deletar">
          <IconButton color="error" onClick={params.value?.handledelete}>
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton color="info" onClick={params.value?.handleUpdate}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

const DataGridPlaysers: React.FC<DataGridPlaysersProps> = ({
  rows = [],
  loading,
}) => {
  return (
    <DataGrid
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: "name", sort: "asc" }] },
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

export default DataGridPlaysers;
