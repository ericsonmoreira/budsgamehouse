import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddTradingCardDialog from "../../components/AddTradingCardDialog";
import ConfirmActionDialog from "../../components/ConfirmActionDialog";
import DataGridCards from "../../components/DataGridCards";
import useTradingCards from "../../hooks/useTradingCards";

const TradingCards: React.FC = () => {
  const [addTradingCardDialogOpen, setAddTradingCardDialogOpen] =
    useState(false);

  const [confirmActionDialogOpen, setConfirmActionDialogOpen] = useState(false);

  const [tradingCardToDeleteId, setTradingCardToDeleteId] = useState("");

  const {
    cards: tradingCards,
    deleteTradingCard,
    updateTradingCard,
  } = useTradingCards();

  const handledelete = (id: string) => {
    setTradingCardToDeleteId(id);
    setConfirmActionDialogOpen(true);
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
        {tradingCards ? (
          <DataGridCards
            rows={tradingCards.map(({ id, name, amount, imgUrl }) => ({
              id,
              imgUrl,
              name,
              amount,
              actions: {
                handleUpdate: () =>
                  updateTradingCard({ id, name, amount, imgUrl }), // TODO: ajustart pra abrir um Dialog para editar
                handledelete: () => handledelete(id), // TODO: perguntar antes de deletar
              },
            }))}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
      <AddTradingCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas de troca"
        open={addTradingCardDialogOpen}
        setOpen={setAddTradingCardDialogOpen}
        onClose={() => setAddTradingCardDialogOpen(false)}
      />
      <ConfirmActionDialog
        title="Remover Card"
        subTitle="Deseja realmente remover esse Card"
        open={confirmActionDialogOpen}
        confirmationMesage="Card Removido com sucesso"
        setOpen={setConfirmActionDialogOpen}
        onClose={() => setConfirmActionDialogOpen(false)}
        handleConfirmAction={() => deleteTradingCard(tradingCardToDeleteId)}
      />
    </>
  );
};

export default TradingCards;
