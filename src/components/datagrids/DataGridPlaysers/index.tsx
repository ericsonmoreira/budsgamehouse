import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import AvatarPlayer from "../../AvatarPlayer";
import ActionsCell from "../../cells/ActionsCell";
import CustomDataGrid from "../CustomDataGrid";

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
      <AvatarPlayer playerId={row.id} sx={{ width: 24, height: 24 }} />
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
