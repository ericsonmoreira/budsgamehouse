import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import ActionsCell from "../../cells/ActionsCell";

type DataGridAssociatesRowData = {
  id: string;
  name: string;
  phone: string;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridAssociatesProps = {
  rows?: DataGridAssociatesRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "id",
    width: 0,
    hide: true,
  },
  {
    field: "name",
    headerName: "Nome",
    flex: 1,
  },
  { field: "phone", headerName: "Telefone", flex: 1 },
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
      <ActionsCell
        handleUpdate={params.value?.handleUpdate}
        handledelete={params.value?.handledelete}
      />
    ),
  },
];

const DataGridAssociates: React.FC<DataGridAssociatesProps> = ({
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

export default DataGridAssociates;
