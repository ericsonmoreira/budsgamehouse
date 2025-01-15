import ActionsCell from "@/components/cells/ActionsCell";
import { formatterCurrencyBRL } from "@/utils/formatters";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";

type DataGridProductsRowData = Product & {
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridProductsProps = {
  rows?: DataGridProductsRowData[];
  loading?: boolean;
};

const columns: GridColDef<DataGridProductsRowData>[] = [
  {
    field: "Imagem",
    headerName: "",
    width: 20,
    align: "center",
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ row }) =>
      row.imgUrl && (
        <img
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          src={row.imgUrl}
        />
      ),
  },
  { field: "name", headerName: "Nome", flex: 2 },
  { field: "category", headerName: "Categoria", flex: 1 },
  {
    field: "price",
    headerName: "Preço",
    flex: 1,
    minWidth: 80,
    valueFormatter: (value, row) => formatterCurrencyBRL.format(row.price),
  },
  {
    field: "stock",
    headerName: "Estoque",
    headerAlign: "right",
    align: "right",
    maxWidth: 60,
  },
  {
    field: "actions",
    headerName: "",
    headerAlign: "right",
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

function DataGridProducts({ rows = [], loading }: DataGridProductsProps) {
  return (
    <CustomDataGrid
      rows={rows}
      initialState={{
        sorting: { sortModel: [{ field: "name", sort: "asc" }] },
      }}
      columns={columns}
      loading={loading}
    />
  );
}

export default DataGridProducts;
