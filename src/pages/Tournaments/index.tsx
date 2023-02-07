import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AddTournamentDialog from "../../components/dialogs/AddTournamentDialog";
import DataGridTournaments from "../../components/datagrids/DataGridTournaments";
import useTournaments from "../../hooks/useTournaments";
import ConfirmActionDialog from "../../components/dialogs/ConfirmActionDialog";

const Tournaments: React.FC = () => {
  const [addTournamentDialogOpen, setAddTournamentDialogOpen] = useState(false);

  const [tournamentToDeleteId, setTournamentToDeleteId] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { tournaments, deleteTournament, isLoading } = useTournaments();

  const handledelete = (id: string) => {
    setTournamentToDeleteId(id);
    setDeleteDialogOpen(true);
  };

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
            actions: {
              handleUpdate: () => console.log("handleUpdate"), // TODO: implementar essa parte
              handledelete: () => handledelete(id),
            },
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
      <ConfirmActionDialog
        title="Remover Torneiro"
        subTitle="Deseja realmente remover esse Evento"
        confirmationMesage="Torneiro removido com sucessor"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deleteTournament(tournamentToDeleteId)}
      />
    </>
  );
};

export default Tournaments;
