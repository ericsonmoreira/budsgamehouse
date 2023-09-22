import { yupResolver } from '@hookform/resolvers/yup';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import usePlayers from '../../../../hooks/usePlayers';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import addFiado from '../../../../resources/fiados/addFiado';

type AddFiadoDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddFiadoDialogFormData = {
  playerId: string;
};

const AddFiadoDialog: React.FC<AddFiadoDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const { handleSubmit, reset, control } = useForm<AddFiadoDialogFormData>({
    resolver: yupResolver(schema),
  });

  const { players } = usePlayers();

  const { mutate: addFiadoMutate, isLoading: addFiadoMutateIsloading } = useMutation({
    mutationFn: async (playerId: string) => {
      await addFiado({
        playerId,
        value: 0,
      });

      await queryClient.invalidateQueries(['useFiados']);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = ({ playerId }: AddFiadoDialogFormData) => {
    addFiadoMutate(playerId);
  };

  const handleClose = () => {
    reset({
      playerId: '',
    });

    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField
              name="playerId"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Jogador',
                fullWidth: true,
                select: true,
              }}
            >
              {players?.map(({ id, name }) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </ControlledTextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={addFiadoMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddFiadoDialog;
