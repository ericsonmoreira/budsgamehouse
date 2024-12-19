import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { formatterCurrencyBRL } from "../../../utils/formatters";
import CustomDataGrid from "../CustomDataGrid";

type DataGridProductsSalesProps = {
  sales?: Sale[];
  loading?: boolean;
};

type DataGridProductsSalesRowData = {
  id: string;
  name: string;
  amount: number;
  price: number;
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Produto",
    flex: 1,
  },
  {
    field: "amount",
    headerName: "Quant.",
    width: 100,
  },
  {
    field: "price",
    headerName: "Unid.",
    width: 100,
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
  },
  {
    field: "total",
    headerName: "Total",
    width: 100,
    valueGetter: ({ row }) => row.amount * row.price,
    valueFormatter: ({ value }) => formatterCurrencyBRL.format(value),
  },
];

function DataGridProductsSales({
  sales = [],
  loading,
}: DataGridProductsSalesProps) {
  const rows = useMemo<DataGridProductsSalesRowData[]>(
    () =>
      sales.reduce((acc, curr) => {
        for (const product of curr.products) {
          const index = acc.findIndex((elem) => elem.id === product.id);

          if (index >= 0) {
            acc[index].amount += product.amount;
          } else {
            acc.push({
              id: product.id,
              amount: product.amount,
              name: product.name,
              price: product.price,
            });
          }
        }

        return acc;
      }, [] as DataGridProductsSalesRowData[]),
    [sales],
  );

  return (
    <CustomDataGrid
      columns={columns}
      initialState={{
        sorting: { sortModel: [{ field: "total", sort: "desc" }] },
      }}
      rows={rows}
      loading={loading}
    />
  );
}

export default DataGridProductsSales;
