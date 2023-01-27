import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import useTournaments from "../../hooks/useTournaments";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DataGridTournaments from "../../components/DataGridTournaments";

const Tournaments: React.FC = () => {
  const { tournaments, isLoading } = useTournaments();

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Torneiros</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            // onClick={() => setAddPlayerDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridTournaments
          loading={isLoading}
          rows={tournaments?.map(({ id, format, name, rounds, state }) => ({
            id,
            format,
            name,
            rounds,
            state,
          }))}
        />
      </Box>
    </>
  );
};

export default Tournaments;
