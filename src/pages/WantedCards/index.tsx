import { Box, Grid, MenuItem, TextField, styled } from '@mui/material';
import { useState } from 'react';
import Each from '../../components/Each';
import PageHeader from '../../components/PageHeader';
import DataGridWantedCards from '../../components/datagrids/DataGridWantedCards';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import AddWantCardDialog from '../../components/dialogs/wantCards/AddWantCardDialog';
import UpdateWantedCardDialog, {
  WantedCardUpdateData,
} from '../../components/dialogs/wantCards/UpdateWantedCardDialog';
import useWantedCards from '../../hooks/useWantedCards';

type PreviewModeType = 'Tabela' | 'Visual';

const viewingModes: PreviewModeType[] = ['Tabela', 'Visual'];

type PreviewModeImgProps = {
  amount: number;
};

const PreviewModeImg = styled('div')<PreviewModeImgProps>(({ amount }) => ({
  position: 'relative',

  ':after': {
    content: `"x ${String(amount)}"`, // Adiciona o conteúdo dinâmico entre aspas
    position: 'absolute',
    bottom: '10%',
    right: '10%',
  },
}));

const WantedCards: React.FC = () => {
  const [addWantCardDialogOpen, setAddWantCardDialogOpen] = useState(false);

  const [updateWantedCardDialogOpen, setUpdateWantedCardDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [wantedCardToDeleteId, setWantedCardToDeleteId] = useState('');

  const [previewMode, setPreviewMode] = useState<PreviewModeType>('Visual');

  const [wantedCardToUpdate, setWantedCardToUpdate] = useState<WantedCardUpdateData>({
    id: '',
    name: '',
    amount: '',
    imgUrl: '',
    priority: 'medium',
  });

  const handleUpdate = ({ id, name, amount, imgUrl, priority }: WantedCardUpdateData) => {
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
      <PageHeader
        title="Want List - Lista de cartas para aquisição"
        onClickAddButton={() => setAddWantCardDialogOpen(true)}
      />
      <Box mx={1} display="flex" flex={1}>
        <TextField
          fullWidth
          select
          label="Modo de Visualização"
          variant="outlined"
          size="small"
          margin="normal"
          value={previewMode}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPreviewMode(event.target.value as PreviewModeType);
          }}
        >
          {viewingModes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        {previewMode === 'Tabela' && (
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
        )}
        {previewMode === 'Visual' && (
          <Grid container>
            <Each
              of={wantedCards || []}
              render={({ imgUrl, amount }, index) => (
                <Grid item xs={2} p={1} key={index}>
                  <PreviewModeImg amount={amount}>
                    <img src={imgUrl} width="100%" style={{ borderRadius: '8px' }} />
                  </PreviewModeImg>
                </Grid>
              )}
            />
          </Grid>
        )}
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
