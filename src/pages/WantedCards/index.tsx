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
import DataGridCards from "../../components/DataGridCards";
import useWantedCards from "../../hooks/useWantedCards";

const WantedCards: React.FC = () => {
  const [addWantCardDialogOpen, setAddWantCardDialogOpen] = useState(false);

  const {
    cards: wantedCards,
    deleteWantedCard,
    updateWantedCard,
  } = useWantedCards();

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
        {wantedCards ? (
          <DataGridCards
            rows={wantedCards.map(({ id, name, amount, imgUrl }) => ({
              id,
              imgUrl,
              name,
              amount,
              actions: {
                handleUpdate: () =>
                  updateWantedCard({ id, name, amount, imgUrl }), // TODO: ajustart pra abrir um Dialog para editar
                handledelete: () => deleteWantedCard(id), // TODO: perguntar antes de deletar
              },
            }))}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
      <AddWantCardDialog
        title="Add Card"
        subTitle="Busque e adicione cartas para encontrar"
        open={addWantCardDialogOpen}
        setOpen={setAddWantCardDialogOpen}
        onClose={() => setAddWantCardDialogOpen(false)}
      />
    </>
  );
};

export default WantedCards;
