import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
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

const getPriorityMapLabel = (value: WantedCardPriority) => {
  const priorityMapLabel: Record<WantedCardPriority | "default", string> = {
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
    default: "indefinido",
  };

  return priorityMapLabel[value] || priorityMapLabel["default"];
};

const columns: GridColDef[] = [
  {
    field: "imgUrl",
    headerName: "Imagem",
    width: 100,
    disableColumnMenu: true,
    sortable: false,
    renderCell: ({ value }) => (
      <Tooltip
        arrow
        placement="right"
        PopperProps={{ sx: { backgroundColor: "none" } }}
        title={<img src={value} style={{ height: 300, marginTop: 5 }} />}
      >
        <img src={value} style={{ height: "2rem" }} />
      </Tooltip>
    ),
  },
  { field: "name", headerName: "Nome", flex: 1 },
  {
    field: "priority",
    headerName: "Prioridade",
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
      <Box>
        <Tooltip title="Deletar">
          <IconButton color="error" onClick={params.value?.handledelete}>
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton color="info" onClick={params.value?.handleUpdate}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
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
