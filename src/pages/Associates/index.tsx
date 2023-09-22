import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import DataGridAssociates from '../../components/datagrids/DataGridAssociates';
import AddAssociateDialog from '../../components/dialogs/AddAssociateDialog';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import UpdateAssociateDialog from '../../components/dialogs/UpdateAssociateDialog';
import useAssociates from '../../hooks/useAssociates';

const Associates: React.FC = () => {
  const [addAssociateDialogOpen, setAddAssociateDialogOpen] = useState(false);

  const [updataAssociateDialogOpen, setUpdataAssociateDialogOpen] = useState(false);

  const [deleteAssociateDialogOpen, setDeleteAssociateDialogOpen] = useState(false);

  const [associateToDeleteId, setAssociateToDeleteId] = useState('');

  const { associates, isLoading, deleteAssociate } = useAssociates();

  const [associateToUpdate, setAssociateToUpdate] = useState<Associate>({} as Associate);

  const handleUpdate = ({ id, name, phone }: Associate) => {
    setAssociateToUpdate({ id, name, phone });
    setUpdataAssociateDialogOpen(true);
  };

  const handledelete = (id: string) => {
    setAssociateToDeleteId(id);
    setDeleteAssociateDialogOpen(true);
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
          Associados
        </Typography>
        <Tooltip title="Add">
          <IconButton color="secondary" onClick={() => setAddAssociateDialogOpen(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridAssociates
          loading={isLoading}
          rows={associates?.map(({ id, name, phone }) => ({
            id,
            name,
            phone,
            actions: {
              handleUpdate: () =>
                handleUpdate({
                  id,
                  name,
                  phone,
                }),
              handledelete: () => handledelete(id),
            },
          }))}
        />
      </Box>
      <AddAssociateDialog
        title="Adicionar novo Associado"
        subTitle="Crie um novo Associado para negociações"
        open={addAssociateDialogOpen}
        setOpen={setAddAssociateDialogOpen}
        onClose={() => setAddAssociateDialogOpen(false)}
      />
      <UpdateAssociateDialog
        title="Update Player"
        subTitle="Atualize aqui o Jogador"
        open={updataAssociateDialogOpen}
        setOpen={setUpdataAssociateDialogOpen}
        onClose={() => setUpdataAssociateDialogOpen(false)}
        associateToUpdate={associateToUpdate}
      />
      <ConfirmActionDialog
        title="Remover Associado"
        subTitle="Deseja realmente remover esse Associado"
        confirmationMesage="Associado removido com sucesso"
        open={deleteAssociateDialogOpen}
        setOpen={setDeleteAssociateDialogOpen}
        onClose={() => setDeleteAssociateDialogOpen(false)}
        handleConfirmAction={() => deleteAssociate(associateToDeleteId)}
      />
    </>
  );
};

export default Associates;
