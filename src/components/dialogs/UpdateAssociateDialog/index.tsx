import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAssociates from '../../../hooks/useAssociates';
import ControlledPhoneTextField from '../../textfields/ControlledPhoneTextField';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type UpdateAssociateDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  associateToUpdate: Associate;
};

const UpdateAssociateDialog: React.FC<
  UpdateAssociateDialogProps & DialogProps
> = ({ title, subTitle, setOpen, associateToUpdate, ...rest }) => {
  const { id, name, phone } = associateToUpdate;

  const { control, handleSubmit, setValue } = useForm<Omit<Associate, 'id'>>({
    resolver: yupResolver(schema),
  });

  const { updateAssociate } = useAssociates();

  const handleConfirmAction = ({ name, phone }: Omit<Associate, 'id'>) => {
    updateAssociate({
      id,
      name,
      phone,
    });

    toast.success('Torneiro adicionado com sucesso');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue('name', name);
    setValue('phone', phone);
  }, [associateToUpdate]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Grid container spacing={2} sx={{ width: '100%', marginTop: 1 }}>
          <Grid item xs={12}>
            <ControlledTextField
              name="name"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Nome',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledPhoneTextField
              name="phone"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Telefone',
                fullWidth: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={handleCancelAction}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAssociateDialog;
