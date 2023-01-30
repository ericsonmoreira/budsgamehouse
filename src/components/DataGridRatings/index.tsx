import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";

export type DataGridRatingsRowData = {
  id: string;
  index: number;
  player: string;
  points: number;
  mwp: number;
  gwp: number;
  omwp: number;
};

type DataGridRatingsProps = {
  rows?: DataGridRatingsRowData[];
  title: string;
  round: number;
  format: string;
};

type CustomToolbarProps = {
  title: string;
  round: number;
  format: string;
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "",
    width: 0,
    hide: true,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "index",
    headerName: "",
    width: 20,
    align: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) => `${value + 1}.`,
  },
  {
    field: "player",
    headerName: "Jogador",
    flex: 1,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "points",
    headerName: "Pontos",
    width: 100,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "mwp",
    headerName: "MWP",
    width: 100,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "gwp",
    headerName: "GWP",
    width: 100,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "omwp",
    headerName: "OMWP",
    width: 100,
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
];

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  title,
  format,
  round,
}) => {
  return (
    <GridToolbarContainer sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: 1,
          paddingX: 1,
          paddingTop: 1,
        }}
      >
        <Typography>Evento: {title}</Typography>
        <Box
          sx={{ display: "flex", width: 1, justifyContent: "space-between" }}
        >
          <Typography>Formato: {format}</Typography>
          <Typography>Rodada: {round}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", width: 1 }}>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
    </GridToolbarContainer>
  );
};

const DataGridRatings: React.FC<DataGridRatingsProps> = ({
  rows = [],
  title,
  format,
  round,
}) => {
  return (
    <DataGrid
      rows={rows}
      rowsPerPageOptions={[5, 10, 25, 100]}
      initialState={{
        pagination: {
          pageSize: 25,
        },
      }}
      components={{
        Toolbar: () => (
          <CustomToolbar title={title} format={format} round={round} />
        ),
      }}
      density="compact"
      columns={columns}
      disableColumnMenu={false}
      disableSelectionOnClick
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
};

export default DataGridRatings;
