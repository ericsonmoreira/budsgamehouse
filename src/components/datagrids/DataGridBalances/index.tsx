import AvatarPlayer from "@/components/AvatarPlayer";
import TypographyBalance from "@/components/TypographyBalance";
import ActionsCell from "@/components/cells/ActionsCell";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";

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

const columns: GridColDef<DataGridBalancesRowData>[] = [
  {
    field: "Imagem",
    headerName: "",
    width: 24,
    align: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => (
      <AvatarPlayer sx={{ width: 24, height: 24 }} playerId={row.id} />
    ),
  },
  {
    field: "name",
    headerName: "Nome",
    flex: 1,
  },
  {
    field: "phone",
    headerName: "Telefone",
    flex: 1,
    sortable: false,
  },
  {
    field: "balance",
    headerName: "Saldo",
    flex: 1,
    renderCell: ({ row }) => (
      <TypographyBalance variant="inherit" balance={row.balance} />
    ),
  },
  {
    field: "actions",
    headerName: "",
    width: 80,
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => (
      <ActionsCell
        handleUpdate={row.actions.handleUpdate}
        handleTransfer={row.actions.handleTransfer}
      />
    ),
  },
];

function DataGridBalances({ rows = [], loading }: DataGridBalancesProps) {
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

export default DataGridBalances;
