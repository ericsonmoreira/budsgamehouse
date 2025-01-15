import AvatarPlayer from "@/components/AvatarPlayer";
import ActionsCell from "@/components/cells/ActionsCell";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { formatterCurrencyBRL } from "@/utils/formatters";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type DataGridSalesRowData = Sale & {
  actions: {
    handleView(): void;
  };
};

type DataGridSalesProps = {
  rows?: DataGridSalesRowData[];
  loading?: boolean;
};

const columns: GridColDef<DataGridSalesRowData>[] = [
  {
    field: "playerId",
    headerName: "",
    align: "center",
    width: 20,
    renderCell: ({ row }: GridRenderCellParams<DataGridSalesRowData>) =>
      row.playerId ? (
        <AvatarPlayer sx={{ width: 24, height: 24 }} playerId={row.playerId} />
      ) : null,
  },
  {
    field: "products",
    headerName: "Valor",
    flex: 1,
    valueGetter: (value, row) =>
      row.products.reduce(
        (
          acc: number,
          curr: {
            amount: number;
            price: number;
          },
        ) => acc + curr.amount * curr.price,
        0,
      ) + (row?.looseValue || 0),
    valueFormatter: (value) => formatterCurrencyBRL.format(value),
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
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) => (
      <ActionsCell handleView={row.actions.handleView} />
    ),
  },
];

function DataGridSales({ rows = [], loading }: DataGridSalesProps) {
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

export default DataGridSales;
