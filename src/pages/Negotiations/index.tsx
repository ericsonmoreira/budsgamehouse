import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import DataGridNegotiations from '../../components/datagrids/DataGridNegotiations';
import AddNegotiationDialog from '../../components/dialogs/AddNegotiationDialog';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import UpdateNegotiationDialog from '../../components/dialogs/UpdateNegotiationDialog';

import useNegotiations from '../../hooks/useNegotiations';

const Negotiations: React.FC = () => {
  const [addNegotiationDialogOpen, setAddNegotiationDialogOpen] =
    useState(false);

  const [updateNegotiationDialogOpen, setUpdateNegotiationDialogOpen] =
    useState(false);

  const [deleteNegotiationDialogOpen, setDeleteNegotiationDialogOpen] =
    useState(false);

  const { negotiations, isLoading, deleteNegotiation } = useNegotiations();

  const [negotiationToDeleteId, setNegotiationToDeleteId] = useState('');

  const [negotiationToUpdate, setnegotiationToUpdate] = useState<Negotiation>({
    id: '',
    associateId: '',
    description: '',
    price: 0,
    status: 'created',
  });

  const handleUpdate = ({
    id,
    associateId,
    description,
    price,
    status,
  }: Negotiation) => {
    setnegotiationToUpdate({ id, associateId, description, price, status });
    setUpdateNegotiationDialogOpen(true);
  };

  const handledelete = (id: string) => {
    setNegotiationToDeleteId(id);
    setDeleteNegotiationDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Negociações
        </Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddNegotiationDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridNegotiations
          loading={isLoading}
          rows={negotiations?.map(
            ({ id, status, price, associateId, description }) => ({
              id,
              status,
              price,
              associate: associateId,
              actions: {
                handleUpdate: () =>
                  handleUpdate({ id, associateId, description, price, status }),
                handledelete: () => handledelete(id),
              },
            })
          )}
        />
      </Box>
      <AddNegotiationDialog
        title="Adicionar Negociação"
        subTitle="Cadastre uma nova negociação"
        open={addNegotiationDialogOpen}
        setOpen={setAddNegotiationDialogOpen}
        onClose={() => setAddNegotiationDialogOpen(false)}
      />
      <UpdateNegotiationDialog
        title="Update Negociação"
        subTitle="Atualize aqui a Negociação"
        open={updateNegotiationDialogOpen}
        setOpen={setUpdateNegotiationDialogOpen}
        onClose={() => setUpdateNegotiationDialogOpen(false)}
        negotiationToUpdate={negotiationToUpdate}
      />
      <ConfirmActionDialog
        title="Remover Negociação"
        subTitle="Deseja realmente remover essa Negociação"
        confirmationMesage="Negociação removida com sucesso"
        open={deleteNegotiationDialogOpen}
        setOpen={setDeleteNegotiationDialogOpen}
        onClose={() => setDeleteNegotiationDialogOpen(false)}
        handleConfirmAction={() => deleteNegotiation(negotiationToDeleteId)}
      />
    </>
  );
};

export default Negotiations;
