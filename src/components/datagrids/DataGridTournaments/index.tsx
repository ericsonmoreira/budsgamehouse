import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import routesNames from "../../../routes/routesNames";

type DataGridTournamentsRowData = {
  id: string;
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
  actions: {
    handleUpdate(): void;
    handledelete(): void;
  };
};

type DataGridTournamentsProps = {
  rows?: DataGridTournamentsRowData[];
  loading?: boolean;
};

const DataGridTournaments: React.FC<DataGridTournamentsProps> = ({
  rows = [],
  loading,
}) => {
  const theme = useTheme();

  const stateColorMap: { [T in TournamentState]: string } = {
    "not-started": theme.palette.warning.main,
    started: theme.palette.primary.main,
    finished: theme.palette.error.main,
  };

  const stateNameMap: { [T in TournamentState]: string } = {
    "not-started": "Não iniciado",
    started: "Iniciado",
    finished: "Finalizado",
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      width: 0,
      hide: true,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      renderCell: ({ value, row }) => (
        <Link
          to={routesNames.TOURNAMENT_VIEW.replace(":id", row.id)}
          style={{ color: theme.palette.common.white }}
        >
          {value}
        </Link>
      ),
    },
    {
      field: "format",
      headerName: "Formato",
      flex: 1,
      valueFormatter: ({ value }) => String(value).toUpperCase(),
    },
    { field: "rounds", headerName: "Rounds", flex: 1 },
    {
      field: "state",
      headerName: "Estado",
      flex: 1,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ color: stateColorMap[value as TournamentState] }}
        >
          {stateNameMap[value as TournamentState]}
        </Typography>
      ),
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
            <span>
              <IconButton
                disabled={(params.row.state as TournamentState) === "finished"}
                color="info"
                onClick={params.value?.handleUpdate}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];
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

export default DataGridTournaments;
