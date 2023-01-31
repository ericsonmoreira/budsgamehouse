import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { join, split } from "lodash";

export type DataGridRatingsRowData = {
  id: string;
  index: number;
  player: string;
  points: number;
  mwp: number;
  gwp: number;
  omwp: number;
  ogwp: number;
  vde: number[];
};

type DataGridRatingsProps = {
  rows?: DataGridRatingsRowData[];
  title: string;
  round: number;
  roundTotal: number;
  format: string;
};

type CustomToolbarProps = {
  title: string;
  round: number;
  roundTotal: number;
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
    headerName: "#",
    width: 20,
    align: "center",
    headerAlign: "center",
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
    align: "center",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
  },
  {
    field: "vde",
    headerName: "VDE",
    width: 100,
    align: "center",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) => value.join("-"),
  },
  {
    field: "mwp",
    headerName: "MWP",
    width: 100,
    align: "right",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) =>
      Number(value).toLocaleString("pt-Br", {
        style: "percent",
        minimumFractionDigits: 2,
      }),
  },
  {
    field: "gwp",
    headerName: "GWP",
    width: 100,
    align: "right",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) =>
      Number(value).toLocaleString("pt-Br", {
        style: "percent",
        minimumFractionDigits: 2,
      }),
  },
  {
    field: "omwp",
    headerName: "OMWP",
    width: 100,
    align: "right",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) =>
      Number(value).toLocaleString("pt-Br", {
        style: "percent",
        minimumFractionDigits: 2,
      }),
  },
  {
    field: "ogwp",
    headerName: "OGWP",
    width: 100,
    align: "right",
    headerAlign: "center",
    sortable: false,
    disableReorder: true,
    disableColumnMenu: true,
    valueFormatter: ({ value }) =>
      Number(value).toLocaleString("pt-Br", {
        style: "percent",
        minimumFractionDigits: 2,
      }),
  },
];

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  title,
  format,
  round,
  roundTotal,
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
          <Typography>
            Rodada: {round} de {roundTotal}
          </Typography>
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
  roundTotal,
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
          <CustomToolbar
            title={title}
            format={format}
            round={round}
            roundTotal={roundTotal}
          />
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
