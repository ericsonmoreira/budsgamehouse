import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import DataGridWantedCards from "../../components/datagrids/DataGridWantedCards";
import AddWantCardDialog from "../../components/dialogs/AddWantCardDialog";
import ConfirmActionDialog from "../../components/dialogs/ConfirmActionDialog";
import UpdateWantedCardDialog, {
  WantedCardUpdateData,
} from "../../components/dialogs/UpdateWantedCardDialog";
import useWantedCards from "../../hooks/useWantedCards";

const WantedCards: React.FC = () => {
  const [addWantCardDialogOpen, setAddWantCardDialogOpen] = useState(false);

  const [updateWantedCardDialogOpen, setUpdateWantedCardDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [wantedCardToDeleteId, setWantedCardToDeleteId] = useState("");

  const [wantedCardToUpdate, setWantedCardToUpdate] =
    useState<WantedCardUpdateData>({
      id: "",
      name: "",
      amount: "",
      imgUrl: "",
      priority: "medium",
    });

  const handleUpdate = ({
    id,
    name,
    amount,
    imgUrl,
    priority,
  }: WantedCardUpdateData) => {
    setWantedCardToUpdate({ id, name, amount, imgUrl, priority });
    setUpdateWantedCardDialogOpen(true);
  };

  const { cards: wantedCards, isLoading, deleteWantedCard } = useWantedCards();

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
        <DataGridWantedCards
          loading={isLoading}
          rows={wantedCards?.map(({ id, name, amount, imgUrl, priority }) => ({
            id,
            imgUrl,
            name,
            amount,
            actions: {
              handleUpdate: () =>
                handleUpdate({
                  id,
                  name,
                  amount: String(amount),
                  imgUrl,
                  priority,
                }),
              handledelete: () => handledelete(id),
            },
            priority,
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
      <UpdateWantedCardDialog
        title="Atualizar carta de troca"
        subTitle="Mude a quantidade que deseja"
        open={updateWantedCardDialogOpen}
        setOpen={setUpdateWantedCardDialogOpen}
        onClose={() => setUpdateWantedCardDialogOpen(false)}
        tradingCardToUpdate={wantedCardToUpdate}
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
