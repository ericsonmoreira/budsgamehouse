import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import DataGridBalances from '../../components/datagrids/DataGridBalances';
import UpdateBalanceDialog from '../../components/dialogs/balances/UpdateBalanceDialog';
import usePlayers from '../../hooks/usePlayers';
import { formatterCurrencyBRL } from '../../utils/formatters';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

type ContentCard = {
  title: string;
  tooltipTitle: string;
  value: string | number;
  color: 'success' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'warning';
  icon: React.ReactElement;
};

const Balances: React.FC = () => {
  const { players } = usePlayers();

  const [updateFiadoDialogOpen, setUpdateFiadoDialogOpen] = useState(false);

  const [playerToUpdate, setPlayerToUpdate] = useState<Player>({} as Player);

  const totalPlayersNegativeBaleance = useMemo(() => {
    if (players) {
      return players.filter((player) => player.balance < 0).length;
    }

    return 0;
  }, [players]);

  const totalPlayersPositiveBalance = useMemo(() => {
    if (players) {
      return players.filter((player) => player.balance > 0).length;
    }

    return 0;
  }, [players]);

  const totalPositiveBaleances = useMemo(() => {
    if (players) {
      return players.filter((player) => player.balance > 0).reduce((acc, curr) => acc + curr.balance, 0);
    }

    return 0;
  }, [players]);

  const totalNegativeBaleances = useMemo(() => {
    if (players) {
      return players.filter((player) => player.balance < 0).reduce((acc, curr) => acc + curr.balance, 0);
    }

    return 0;
  }, [players]);

  const contentCards: ContentCard[] = [
    {
      title: 'Jogadores em Débito',
      tooltipTitle: 'Total de jogadores com saldo negativo',
      value: totalPlayersNegativeBaleance,
      color: 'error',
      icon: <PersonIcon />,
    },
    {
      title: 'Jogadores com Saldo',
      tooltipTitle: 'Total de jogadores com saldo positivo',
      value: totalPlayersPositiveBalance,
      color: 'success',
      icon: <PersonIcon />,
    },
    {
      title: 'Total de Fiados',
      tooltipTitle: 'Somatório dos saldos negatvios dos jogadores',
      value: formatterCurrencyBRL.format(totalNegativeBaleances),
      color: 'error',
      icon: <AttachMoneyIcon />,
    },
    {
      title: 'Total de Saldos',
      tooltipTitle: 'Somatório dos saldos positivos dos jogadores',
      value: formatterCurrencyBRL.format(totalPositiveBaleances),
      color: 'success',
      icon: <AttachMoneyIcon />,
    },
    {
      title: 'Balanço Geral',
      tooltipTitle: 'Somatório dos saldos positivos dos jogadores',
      value: formatterCurrencyBRL.format(totalPositiveBaleances + totalNegativeBaleances),
      color: 'secondary',
      icon: <AttachMoneyIcon />,
    },
  ];

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
      <Box mx={1}>
        <Stack direction="row" spacing={1}>
          {contentCards.map(({ title, tooltipTitle, value, color, icon }, index) => (
            <Tooltip title={tooltipTitle} key={index}>
              <Chip size="small" icon={icon} color={color} variant="outlined" label={`${title}: ${value}`} />
            </Tooltip>
          ))}
        </Stack>
      </Box>
      <Box m={1} sx={{ height: 1 }}>
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
