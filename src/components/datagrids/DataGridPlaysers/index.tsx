import AvatarPlayer from "@/components/AvatarPlayer";
import ActionsCell from "@/components/cells/ActionsCell";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { Box, TableCell } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

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

const columns: GridColDef<DataGridPlaysersRowData>[] = [
  {
    field: "avatar",
    headerName: "",
    width: 20,
    align: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <AvatarPlayer playerId={row.id} sx={{ width: 24, height: 24 }} />
      </Box>
    ),
  },
  { field: "name", headerName: "Nome", flex: 2 },
  { field: "phone", headerName: "Telefone", flex: 1, sortable: false },
  { field: "email", headerName: "Email", flex: 1 },
  {
    field: "actions",
    headerName: "",
    width: 80,
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <ActionsCell
        handleUpdate={params.row.actions.handleUpdate}
        handledelete={params.row.actions.handledelete}
      />
    ),
  },
];

function DataGridPlaysers({ rows = [], loading }: DataGridPlaysersProps) {
  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: "name", sort: "asc" }] },
      }}
      loading={loading}
    />
  );
}

export default DataGridPlaysers;
