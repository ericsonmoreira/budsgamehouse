import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import DataGridBalances from "@/components/datagrids/DataGridBalances";
import TransferBalanceBetweenPlayersDialog from "@/components/dialogs/balances/TransferBalanceBetweenPlayersDialog";
import UpdateBalanceDialog from "@/components/dialogs/balances/UpdateBalanceDialog";
import SearchTextField from "@/components/textfields/SearchTextField";
import usePlayers from "@/hooks/usePlayers";
import { formatterCurrencyBRL } from "@/utils/formatters";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Chip, Grid2 as Grid, Tooltip } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";

type ContentCard = {
  title: string;
  tooltipTitle: string;
  value: string | number;
  color:
    | "success"
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "warning";
  icon: React.ReactElement;
};

function Balances() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams({ searchTerm: "" });

  const searchTerm = searchParams.get("searchTerm");

  const { data: players, isLoading } = usePlayers();

  const [updateFiadoDialogOpen, setUpdateFiadoDialogOpen] = useState(false);

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const [playerToUpdate, setPlayerToUpdate] = useState<Player>({} as Player);

  const [senderPlayerFransfer, setSenderPlayerFransfer] = useState<Player>(
    {} as Player,
  );

  const debounced = useDebounceCallback((value: string) => {
    setSearchParams({ searchTerm: value });
  }, 500);

  const searchedPlayers = useMemo(() => {
    if (players) {
      return players.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm?.toLowerCase() || ""),
      );
    }

    return [];
  }, [players, searchTerm]);

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
      return players
        .filter((player) => player.balance > 0)
        .reduce((acc, curr) => acc + curr.balance, 0);
    }

    return 0;
  }, [players]);

  const totalNegativeBaleances = useMemo(() => {
    if (players) {
      return players
        .filter((player) => player.balance < 0)
        .reduce((acc, curr) => acc + curr.balance, 0);
    }

    return 0;
  }, [players]);

  const contentCards: ContentCard[] = [
    {
      title: "Jogadores em Débito",
      tooltipTitle: "Total de jogadores com saldo negativo",
      value: totalPlayersNegativeBaleance,
      color: "error",
      icon: <PersonIcon />,
    },
    {
      title: "Jogadores com Saldo",
      tooltipTitle: "Total de jogadores com saldo positivo",
      value: totalPlayersPositiveBalance,
      color: "success",
      icon: <PersonIcon />,
    },
    {
      title: "Total de Fiados",
      tooltipTitle: "Somatório dos saldos negatvios dos jogadores",
      value: formatterCurrencyBRL.format(totalNegativeBaleances),
      color: "error",
      icon: <AttachMoneyIcon />,
    },
    {
      title: "Total de Saldos",
      tooltipTitle: "Somatório dos saldos positivos dos jogadores",
      value: formatterCurrencyBRL.format(totalPositiveBaleances),
      color: "success",
      icon: <AttachMoneyIcon />,
    },
    {
      title: "Balanço Geral",
      tooltipTitle: "Somatório dos saldos positivos dos jogadores",
      value: formatterCurrencyBRL.format(
        totalPositiveBaleances + totalNegativeBaleances,
      ),
      color: "secondary",
      icon: <AttachMoneyIcon />,
    },
  ];

  const handleUpdate = (player: Player) => {
    setPlayerToUpdate(player);

    setUpdateFiadoDialogOpen(true);
  };

  const handleTransfer = (player: Player) => {
    setSenderPlayerFransfer(player);

    setTransferDialogOpen(true);
  };

  const handleClearSearchTerm = (): void => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setSearchParams({ searchTerm: "" });
    }
  };

  return (
    <Page>
      <PageHeader title="Saldos" />
      <Box m={1}>
        <Grid container spacing={1}>
          {contentCards.map(({ tooltipTitle, icon, color, title, value }) => (
            <Grid key={title}>
              <Tooltip title={tooltipTitle}>
                <Chip
                  size="small"
                  icon={icon}
                  color={color}
                  variant="outlined"
                  label={`${title}: ${value}`}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mx={1}>
        <SearchTextField
          autoFocus
          inputRef={inputRef}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            debounced(event.target.value);
          }}
          handleClearSearchTerm={handleClearSearchTerm}
          placeholder="Buscar por nome..."
          size="small"
          fullWidth
        />
      </Box>
      <Box m={1} height={1}>
        <DataGridBalances
          loading={isLoading}
          rows={searchedPlayers.map((player) => ({
            ...player,
            actions: {
              handleUpdate: () => handleUpdate(player),
              handleTransfer: () => handleTransfer(player),
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
      <TransferBalanceBetweenPlayersDialog
        title="Nova Transferência"
        subTitle="Tranfira Saldo entre Jogadores"
        senderPlayer={senderPlayerFransfer}
        open={transferDialogOpen}
        setOpen={setTransferDialogOpen}
      />
    </Page>
  );
}

export default Balances;
