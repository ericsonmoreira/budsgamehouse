import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import DataGridTradingCards from "../../components/datagrids/DataGridTradingCards";
import AddTradingCardDialog from "../../components/dialogs/tradingCards/AddTradingCardDialog";
import UpdateTradingCardDialog, {
  TradingCardUpdateData,
} from "../../components/dialogs/tradingCards/UpdateTradingCardDialog";
import useConfirmation from "../../hooks/useConfirmation";
import useTradingCards from "../../hooks/useTradingCards";

function TradingCards() {
  const [addTradingCardDialogOpen, setAddTradingCardDialogOpen] =
    useState(false);

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const [updateTradingCardDialogOpen, setUpdateTradingCardDialogOpen] =
    useState(false);

  const [tradingCardToUpdate, setTradingCardToUpdate] =
    useState<TradingCardUpdateData>({
      id: "",
      name: "",
      amount: "",
      imgUrl: "",
    });

  const handleUpdate = ({
    id,
    name,
    amount,
    imgUrl,
  }: TradingCardUpdateData) => {
    setTradingCardToUpdate({ id, name, amount, imgUrl });

    setUpdateTradingCardDialogOpen(true);
  };

  const {
    cards: tradingCards,
    isLoading,
    deleteTradingCard,
  } = useTradingCards();

  const { mutate: deleteTradingCardMutate } = useMutation({
    mutationFn: async (id: string) => {
      const confirmation = await showDialog({
        title: "Remover Card",
        message: "Deseja realmente remover esse Card",
      });

      if (confirmation) {
        deleteTradingCard(id);

        return true;
      }

      return false;
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Card removido com sucesso");
      }
    },
    onError: () => toast.error("Erro!"),
  });

  return (
    <Page>
      <PageHeader
        title="Cartas de Troca"
        onClickAddButton={() => setAddTradingCardDialogOpen(true)}
      />
      <Box height={1} m={1}>
        <DataGridTradingCards
          loading={isLoading}
          rows={tradingCards?.map(({ id, name, amount, imgUrl }) => ({
            id,
            imgUrl,
            name,
            amount,
            actions: {
              handleUpdate: () =>
                handleUpdate({ id, name, amount: String(amount), imgUrl }),
              handledelete: () => deleteTradingCardMutate(id),
            },
          }))}
        />
      </Box>
      <AddTradingCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas de troca"
        open={addTradingCardDialogOpen}
        setOpen={setAddTradingCardDialogOpen}
        onClose={() => setAddTradingCardDialogOpen(false)}
      />
      <UpdateTradingCardDialog
        title="Atualizar carta de troca"
        subTitle="Mude a quantidade que deseja"
        open={updateTradingCardDialogOpen}
        setOpen={setUpdateTradingCardDialogOpen}
        onClose={() => setUpdateTradingCardDialogOpen(false)}
        tradingCardToUpdate={tradingCardToUpdate}
      />
      <ConfirmationDialog />
    </Page>
  );
}

export default TradingCards;
