import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import DataGridTradingCards from "../../components/datagrids/DataGridTradingCards";
import AddTradingCardDialog from "../../components/dialogs/AddTradingCardDialog";
import ConfirmActionDialog from "../../components/dialogs/ConfirmActionDialog";
import UpdateTradingCardDialog, {
  TradingCardUpdateData,
} from "../../components/dialogs/UpdateTradingCardDialog";
import useTradingCards from "../../hooks/useTradingCards";

const TradingCards: React.FC = () => {
  const [addTradingCardDialogOpen, setAddTradingCardDialogOpen] =
    useState(false);

  const [updateTradingCardDialogOpen, setUpdateTradingCardDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [tradingCardToDeleteId, setTradingCardToDeleteId] = useState("");

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

  const handledelete = (id: string) => {
    setTradingCardToDeleteId(id);
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
        <Typography variant="h4">Cartas de Troca</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddTradingCardDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
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
              handledelete: () => handledelete(id),
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
      <ConfirmActionDialog
        title="Remover Card"
        subTitle="Deseja realmente remover esse Card"
        confirmationMesage="Card Removido com sucesso"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deleteTradingCard(tradingCardToDeleteId)}
      />
    </>
  );
};

export default TradingCards;
