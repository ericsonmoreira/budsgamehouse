import TypographyBalance from "@/components/TypographyBalance";
import ActionsCell from "@/components/cells/ActionsCell";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type DataGridExpensesRowData = Expense & {
  actions: {
    handleView(): void;
  };
};

type DataGridExpensesProps = {
  rows?: DataGridExpensesRowData[];
  loading?: boolean;
};

const columns: GridColDef<DataGridExpensesRowData>[] = [
  {
    field: "name",
    headerName: "Nome",
    flex: 1,
  },
  {
    field: "value",
    headerName: "Valor",
    flex: 1,
    renderCell: ({ row }) => (
      <TypographyBalance variant="inherit" balance={-row.value} />
    ),
  },
  {
    field: "createdAt",
    headerName: "Data",
    flex: 1,
    valueFormatter: (value, row) =>
      format(row.createdAt.toDate(), "PPPp", { locale: ptBR }),
  },
  {
    field: "actions",
    headerName: "",
    width: 24,
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params: GridRenderCellParams<DataGridExpensesRowData>) => (
      <ActionsCell handleView={params.value?.handleView} />
    ),
  },
];

function DataGridExpenses({ rows = [], loading }: DataGridExpensesProps) {
  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
      }}
      loading={loading}
    />
  );
}

export default DataGridExpenses;
