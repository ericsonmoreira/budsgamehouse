import { Box } from '@mui/material';
import { useState } from 'react';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import DataGridTradingCards from '../../components/datagrids/DataGridTradingCards';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import AddTradingCardDialog from '../../components/dialogs/tradingCards/AddTradingCardDialog';
import UpdateTradingCardDialog, {
  TradingCardUpdateData,
} from '../../components/dialogs/tradingCards/UpdateTradingCardDialog';
import useTradingCards from '../../hooks/useTradingCards';

const TradingCards: React.FC = () => {
  const [addTradingCardDialogOpen, setAddTradingCardDialogOpen] = useState(false);

  const [updateTradingCardDialogOpen, setUpdateTradingCardDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [tradingCardToDeleteId, setTradingCardToDeleteId] = useState('');

  const [tradingCardToUpdate, setTradingCardToUpdate] = useState<TradingCardUpdateData>({
    id: '',
    name: '',
    amount: '',
    imgUrl: '',
  });

  const handleUpdate = ({ id, name, amount, imgUrl }: TradingCardUpdateData) => {
    setTradingCardToUpdate({ id, name, amount, imgUrl });
    setUpdateTradingCardDialogOpen(true);
  };

  const { cards: tradingCards, isLoading, deleteTradingCard } = useTradingCards();

  const handledelete = (id: string) => {
    setTradingCardToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <Page>
      <PageHeader title="Cartas de Troca" onClickAddButton={() => setAddTradingCardDialogOpen(true)} />
      <Box height={1} m={1}>
        <DataGridTradingCards
          loading={isLoading}
          rows={tradingCards?.map(({ id, name, amount, imgUrl }) => ({
            id,
            imgUrl,
            name,
            amount,
            actions: {
              handleUpdate: () => handleUpdate({ id, name, amount: String(amount), imgUrl }),
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
    </Page>
  );
};

export default TradingCards;
