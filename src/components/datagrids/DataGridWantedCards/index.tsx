import ActionsCell from "@/components/cells/ActionsCell";
import ImageCell from "@/components/cells/ImageCell";
import PriorityCell from "@/components/cells/PriorityCell";
import CustomDataGrid from "@/components/datagrids/CustomDataGrid";
import { GridColDef, GridComparatorFn } from "@mui/x-data-grid";

const priorityGridComparatorFn: GridComparatorFn<WantedCardPriority> = (
  a,
  b,
): number => {
  const priorityValues: Record<WantedCardPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return priorityValues[a] - priorityValues[b];
};

type DataGridWantedCardsRowData = {
  id: string;
  imgUrl: string;
  name: string;
  amount: number;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
  priority: WantedCardPriority;
};

type DataGridWantedCardsProps = {
  rows?: DataGridWantedCardsRowData[];
  loading?: boolean;
};

const columns: GridColDef<DataGridWantedCardsRowData>[] = [
  {
    field: "imgUrl",
    headerName: "",
    align: "center",
    width: 20,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ value }) => <ImageCell value={value} />,
  },
  { field: "name", headerName: "Nome", flex: 2 },
  {
    field: "priority",
    headerName: "Prioridade",
    headerAlign: "center",
    flex: 1,
    maxWidth: 150,
    align: "center",
    renderCell: ({ value }) => <PriorityCell value={value} />,
    sortComparator: priorityGridComparatorFn,
  },
  {
    field: "amount",
    headerName: "Quantidade",
    maxWidth: 100,
    flex: 1,
    align: "right",
    headerAlign: "center",
  },
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

function DataGridWantedCards({ rows = [], loading }: DataGridWantedCardsProps) {
  return (
    <CustomDataGrid
      columns={columns}
      rows={rows}
      initialState={{
        sorting: {
          sortModel: [{ field: "priority", sort: "desc" }],
        },
      }}
      loading={loading}
    />
  );
}

export default DataGridWantedCards;
