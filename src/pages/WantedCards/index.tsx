import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddWantCardDialog from "../../components/AddWantCardDialog";
import ConfirmActionDialog from "../../components/ConfirmActionDialog";
import DataGridCards from "../../components/DataGridCards";
import useWantedCards from "../../hooks/useWantedCards";

const WantedCards: React.FC = () => {
  const [addWantCardDialogOpen, setAddWantCardDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [wantedCardToDeleteId, setWantedCardToDeleteId] = useState("");

  const {
    cards: wantedCards,
    isLoading,
    deleteWantedCard,
    updateWantedCard,
  } = useWantedCards();

  const handledelete = (id: string) => {
    setWantedCardToDeleteId(id);
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
        <Typography variant="h4">
          Want List - Lista de cartas para aquisição
        </Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddWantCardDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridCards
          loading={isLoading}
          rows={wantedCards?.map(({ id, name, amount, imgUrl }) => ({
            id,
            imgUrl,
            name,
            amount,
            actions: {
              handleUpdate: () =>
                updateWantedCard({ id, name, amount, imgUrl }), // TODO: ajustart pra abrir um Dialog para editar
              handledelete: () => handledelete(id), // TODO: perguntar antes de deletar
            },
          }))}
        />
      </Box>
      <AddWantCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas para encontrar"
        open={addWantCardDialogOpen}
        setOpen={setAddWantCardDialogOpen}
        onClose={() => setAddWantCardDialogOpen(false)}
      />
      <ConfirmActionDialog
        title="Remover Card"
        subTitle="Deseja realmente remover esse Card"
        confirmationMesage="Card Removido com sucesso"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deleteWantedCard(wantedCardToDeleteId)}
      />
    </>
  );
};

export default WantedCards;
