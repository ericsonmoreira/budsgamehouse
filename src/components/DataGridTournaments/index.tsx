import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import routesNames from "../../routes/routesNames";
import theme from "../../theme";

type DataGridTournamentsRowData = {
  id: string;
  name: string;
  format: TournamentFormat;
  rounds: number;
  state: TournamentState;
};

type DataGridTournamentsProps = {
  rows?: DataGridTournamentsRowData[];
  loading?: boolean;
};

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
    field: "name",
    headerName: "Nome",
    flex: 1,
    renderCell: ({ value }) => <Link to={routesNames.HOME}>{value}</Link>,
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
];

const DataGridTournaments: React.FC<DataGridTournamentsProps> = ({
  rows = [],
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

export default DataGridTournaments;
