import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import DataGridFiados from '../../components/datagrids/DataGridFiados';
import AddFiadoDialog from '../../components/dialogs/fiados/AddFiadoDialog';
import useFiados from '../../hooks/useFiados';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteFiado from '../../resources/fiados/deleteFiado';
import toast from 'react-hot-toast';

const Fiados: React.FC = () => {
  const queryClient = useQueryClient();

  const [addFiadoDialogOpen, setAddFiadoDialogOpen] = useState(false);

  const [deleteFiadoDialogOpen, setDeleteFiadoDialogOpen] = useState(false);

  const [fiadoToDeleteSelected, setFiadoToDeleteSelected] = useState<Fiado>({} as Fiado);

  const { data, isLoading } = useFiados();

  const { mutate: deleteFiadoMutate, isLoading: deleteFiadoMutateIsloading } = useMutation({
    mutationFn: async () => {
      setDeleteFiadoDialogOpen(false);

      await deleteFiado(fiadoToDeleteSelected.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['useFiados']);

      toast.success('Fiado removido com sucesso');
    },
  });

  const handledelete = (fiadoToDelete: Fiado) => {
    setFiadoToDeleteSelected(fiadoToDelete);
    setDeleteFiadoDialogOpen(true);
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
          Fiados
        </Typography>
        <Tooltip title="Add">
          <IconButton color="secondary" onClick={() => setAddFiadoDialogOpen(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridFiados
          rows={data?.map((fiado) => ({
            ...fiado,
            actions: {
              handledelete: () => handledelete(fiado),
              handleUpdate: () => {},
            },
          }))}
          loading={isLoading}
        />
      </Box>
      <AddFiadoDialog
        title="Adicionar Fiado"
        subTitle="Um Fiado para um Jogador"
        open={addFiadoDialogOpen}
        setOpen={setAddFiadoDialogOpen}
        onClose={() => setAddFiadoDialogOpen(false)}
      />
      <Dialog fullWidth maxWidth="md" open={deleteFiadoDialogOpen} onClose={() => setDeleteFiadoDialogOpen(false)}>
        <DialogTitle>Remover Fiado</DialogTitle>
        <DialogContent>
          <DialogContentText>Deseja realmente remover esse Fiado?</DialogContentText>
          <DialogContentText variant="overline">Essa ação não pode ser desfeita!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setDeleteFiadoDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => deleteFiadoMutate()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleteFiadoMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default Fiados;
