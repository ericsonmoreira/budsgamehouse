import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddPlayerDialog from "../../components/AddPlayerDialog";
import ConfirmActionDialog from "../../components/ConfirmActionDialog";
import DataGridPlaysers from "../../components/DataGridPlaysers";
import usePlayers from "../../hooks/usePlayers";

const Players: React.FC = () => {
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { players, deletePlayer, updatePlayer } = usePlayers();

  const [playserToDeleteId, setPlayserToDeleteId] = useState("");

  const handledelete = (id: string) => {
    setPlayserToDeleteId(id);
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
        <Typography variant="h4">Payers</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddPlayerDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        {players ? (
          <DataGridPlaysers
            rows={players.map(({ id, name, email }) => ({
              id,
              name,
              email,
              actions: {
                handleUpdate: () => updatePlayer({ id, name, email }), // TODO: ajustart pra abrir um Dialog para editar
                handledelete: () => handledelete(id),
              },
            }))}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
      <AddPlayerDialog
        title="Adicionar Players"
        subTitle="Cadastre aqui novos jogadores"
        open={addPlayerDialogOpen}
        setOpen={setAddPlayerDialogOpen}
        onClose={() => setAddPlayerDialogOpen(false)}
      />
      <ConfirmActionDialog
        title="Remover Player"
        subTitle="Deseja realmente remover esse Jogador"
        confirmationMesage="Player removido com sucessor"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deletePlayer(playserToDeleteId)}
      />
    </>
  );
};

export default Players;
