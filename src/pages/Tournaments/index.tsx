import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AddTournamentDialog from "../../components/dialogs/AddTournamentDialog";
import DataGridTournaments from "../../components/datagrids/DataGridTournaments";
import useTournaments from "../../hooks/useTournaments";

const Tournaments: React.FC = () => {
  const [addTournamentDialogOpen, setAddTournamentDialogOpen] = useState(false);

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
            onClick={() => setAddTournamentDialogOpen(true)}
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
      <AddTournamentDialog
        title="Adicionar um Torneio"
        subTitle="Crie um novo campeonato e cadastre seus Jogadores"
        open={addTournamentDialogOpen}
        setOpen={setAddTournamentDialogOpen}
        onClose={() => setAddTournamentDialogOpen(false)}
      />
    </>
  );
};

export default Tournaments;
