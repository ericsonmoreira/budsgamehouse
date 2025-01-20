import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import DataGridPlaysers from "@/components/datagrids/DataGridPlaysers";
import SearchTextField from "@/components/textfields/SearchTextField";
import useConfirmation from "@/hooks/useConfirmation";
import usePlayers from "@/hooks/usePlayers";
import deletePlayer from "@/resources/players/deletePlayer";
import routesNames from "@/routes/routesNames";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounceCallback } from "usehooks-ts";
import AddPlayerDialog from "./AddPlayerDialog";

function Players() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const [searchParams, setSearchParams] = useSearchParams({ searchTerm: "" });

  const searchTerm = searchParams.get("searchTerm");

  const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);

  const { data: players, isLoading } = usePlayers();

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

  const { mutate: deletePlayerMutate, isPending: deletePlayerMutateIsloading } =
    useMutation({
      mutationFn: async (player: Player) => {
        await deletePlayer(player.id);

        await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePlayer", player.id],
        });

        await queryClient.invalidateQueries({ queryKey: ["usePayments"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePaymentsFromPlayer", player.id],
        });
      },
      onSuccess: () => {
        toast.success("Jogador Removido com Sucesso.");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleUpdate = (player: Player) => {
    navigate(routesNames.EDIT_PLAYER.replace(":id", player.id));
  };

  const handledelete = async (player: Player) => {
    const confirmation = await showDialog({
      title: "Remover Player",
      message: "Deseja realmente remover esse Jogador?",
    });

    if (confirmation) {
      deletePlayerMutate(player);
    }
  };

  const handleClearSearchTerm = (): void => {
    if (inputRef.current) {
      inputRef.current.value = "";

      setSearchParams({ searchTerm: "" });
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
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridPlaysers
          loading={isLoading}
          rows={searchedPlayers.map((player) => ({
            ...player,
            actions: {
              handleUpdate: () => handleUpdate(player),
              handledelete: () => handledelete(player),
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

      <ConfirmationDialog />
    </Page>
  );
}

export default Players;
