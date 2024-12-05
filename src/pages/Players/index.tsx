import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import DataGridPlaysers from "../../components/datagrids/DataGridPlaysers";
import AddPlayerDialog from "../../components/dialogs/players/AddPlayerDialog";
import UpdatePlayerDialog from "../../components/dialogs/players/UpdatePlayerDialog";
import SearchTextField from "../../components/textfields/SearchTextField";
import useConfirmation from "../../hooks/useConfirmation";
import usePlayers from "../../hooks/usePlayers";
import deletePlayer from "../../resources/players/deletePlayer";

function Players() {
  const queryClient = useQueryClient();

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const [searchParams, setSearchParams] = useSearchParams({ searchTerm: "" });

  const searchTerm = searchParams.get("searchTerm");

  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);

  const [updatePlayerDialogOpen, setUpdatePlayerDialogOpen] = useState(false);

  const { data: players, isLoading } = usePlayers();

  const [playerToUpdate, setPlayerToUpdate] = useState<Player>({
    id: "",
    name: "",
    email: "",
    balance: 0,
  });

  const searchTermDebounced = useDebounce(searchTerm, 300);

  const searchedPlayers = useMemo(() => {
    if (players) {
      return players.filter(({ name }) =>
        name.toLowerCase().includes(searchTermDebounced?.toLowerCase() || ""),
      );
    }

    return [];
  }, [players, searchTermDebounced]);

  const { mutate: deletePlayerMutate, isPending: deletePlayerMutateIsloading } =
    useMutation({
      mutationFn: async (playerId: string) => {
        await deletePlayer(playerId);

        await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePlayer", playerToUpdate.id],
        });

        await queryClient.invalidateQueries({ queryKey: ["usePayments"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePaymentsFromPlayer", playerToUpdate.id],
        });
      },
      onSuccess: () => {
        toast.success("Jogador Removido com Sucesso.");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleUpdate = ({
    id,
    name,
    email,
    avatarImgUrl,
    balance,
    phone,
  }: Player) => {
    setPlayerToUpdate({ id, name, email, avatarImgUrl, balance, phone });

    setUpdatePlayerDialogOpen(true);
  };

  const handledelete = async (id: string) => {
    const confirmation = await showDialog({
      title: "Remover Player",
      message: "Deseja realmente remover esse Jogador?",
    });

    if (confirmation) {
      deletePlayerMutate(id);
    }
  };

  return (
    <Page loading={deletePlayerMutateIsloading}>
      <PageHeader
        title="Payers"
        onClickAddButton={() => setAddPlayerDialogOpen(true)}
      />
      <Box mx={1}>
        <SearchTextField
          autoFocus
          value={searchTerm}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchParams({ searchTerm: event.target.value });
          }}
          handleClearSearchTerm={() => setSearchParams({ searchTerm: "" })}
          placeholder="Buscar por nome..."
          size="small"
          fullWidth
        />
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridPlaysers
          loading={isLoading}
          rows={searchedPlayers.map((row) => ({
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
      />
      <UpdatePlayerDialog
        title="Update Player"
        subTitle="Atualize aqui o Jogador"
        open={updatePlayerDialogOpen}
        setOpen={setUpdatePlayerDialogOpen}
        playerToUpdate={playerToUpdate}
      />
      <ConfirmationDialog />
    </Page>
  );
}

export default Players;
