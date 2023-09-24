import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import DataGridPlaysers from '../../components/datagrids/DataGridPlaysers';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import AddPlayerDialog from '../../components/dialogs/players/AddPlayerDialog';
import UpdatePlayerDialog from '../../components/dialogs/players/UpdatePlayerDialog';
import usePlayers from '../../hooks/usePlayers';

const Players: React.FC = () => {
  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);

  const [updatePlayerDialogOpen, setUpdatePlayerDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { players, deletePlayer, isLoading } = usePlayers();

  const [playerToDeleteId, setPlayerToDeleteId] = useState('');

  const [playerToUpdate, setPlayerToUpdate] = useState<Player>({
    id: '',
    name: '',
    email: '',
    balance: 0,
  });

  const handleUpdate = ({ id, name, email, avatarImgUrl, balance }: Player) => {
    setPlayerToUpdate({ id, name, email, avatarImgUrl, balance });
    setUpdatePlayerDialogOpen(true);
  };

  const handledelete = (id: string) => {
    setPlayerToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Payers
        </Typography>
        <Tooltip title="Add">
          <IconButton color="secondary" onClick={() => setAddPlayerDialogOpen(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridPlaysers
          loading={isLoading}
          rows={players?.map((row) => ({
            ...row,
            actions: {
              handleUpdate: () => handleUpdate(row),
              handledelete: () => handledelete(row.id),
            },
          }))}
        />
      </Box>
      <AddPlayerDialog
        title="Adicionar Players"
        subTitle="Cadastre aqui novos jogadores"
        open={addPlayerDialogOpen}
        setOpen={setAddPlayerDialogOpen}
        onClose={() => setAddPlayerDialogOpen(false)}
      />
      <UpdatePlayerDialog
        title="Update Player"
        subTitle="Atualize aqui o Jogador"
        open={updatePlayerDialogOpen}
        setOpen={setUpdatePlayerDialogOpen}
        onClose={() => setUpdatePlayerDialogOpen(false)}
        playerToUpdate={playerToUpdate}
      />
      <ConfirmActionDialog
        title="Remover Player"
        subTitle="Deseja realmente remover esse Jogador"
        confirmationMesage="Player removido com sucessor"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deletePlayer(playerToDeleteId)}
      />
    </>
  );
};

export default Players;
