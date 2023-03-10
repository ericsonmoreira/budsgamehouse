import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import ActionsCell from "../../cells/ActionsCell";

type DataGridNegotiationsRowData = {
  id: string;
  status: NegotiationStatus;
  price: number;
  associate: string;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridNegotiationsProps = {
  rows?: DataGridNegotiationsRowData[];
  loading?: boolean;
};

const columns: GridColDef[] = [
  { field: "status", headerName: "Status", flex: 1 },
  { field: "price", headerName: "Preço", flex: 1 },
  { field: "associate", headerName: "Associado", flex: 1 },
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

const DataGridNegotiations: React.FC<DataGridNegotiationsProps> = ({
  rows = [],
  loading,
}) => {
  return (
    <DataGrid
      rows={rows}
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

export default DataGridNegotiations;
