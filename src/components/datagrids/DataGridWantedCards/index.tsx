import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import ActionsCell from "./ActionsCell";
import ImageCell from "./ImageCell";
import PriorityCell from "./PriorityCell";

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

const columns: GridColDef[] = [
  {
    field: "imgUrl",
    headerName: "Imagem",
    width: 100,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ value }) => <ImageCell value={value} />,
  },
  { field: "name", headerName: "Nome", flex: 1 },
  {
    field: "priority",
    headerName: "Prioridade",
    headerAlign: "center",
    width: 150,
    align: "center",
    renderCell: ({ value }) => <PriorityCell value={value} />,
  },
  {
    field: "amount",
    headerName: "Quantidade",
    width: 150,
    align: "right",
    headerAlign: "center",
  },
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

const DataGridWantedCards: React.FC<DataGridWantedCardsProps> = ({
  rows = [], // default enpty array
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

export default DataGridWantedCards;
