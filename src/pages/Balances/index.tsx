import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import DataGridBalances from '../../components/datagrids/DataGridBalances';
import UpdateBalanceDialog from '../../components/dialogs/balances/UpdateBalanceDialog';
import usePlayers from '../../hooks/usePlayers';

const Balances: React.FC = () => {
  const { players } = usePlayers();

  const [updateFiadoDialogOpen, setUpdateFiadoDialogOpen] = useState(false);

  const [playerToUpdate, setPlayerToUpdate] = useState<Player>({} as Player);

  const handleUpdate = (player: Player) => {
    setPlayerToUpdate(player);

    setUpdateFiadoDialogOpen(true);
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
          Fiados
        </Typography>
        <Tooltip title="Add">
          <IconButton color="secondary">
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridBalances
          rows={players?.map((player) => ({
            ...player,
            actions: {
              handleUpdate: () => handleUpdate(player),
            },
          }))}
        />
      </Box>
      <UpdateBalanceDialog
        title="Adicionar Fiado"
        subTitle="Um Fiado para um Jogador"
        playerToUpdate={playerToUpdate}
        open={updateFiadoDialogOpen}
        setOpen={setUpdateFiadoDialogOpen}
      />
    </>
  );
};

export default Balances;
