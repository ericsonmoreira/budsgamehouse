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
  MenuItem,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useNegotiations from '../../../hooks/useNegotiations';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type UpdateNegotiationDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  negotiationToUpdate: Negotiation;
};

const negotiationStatusValues: { value: NegotiationStatus; label: string }[] = [
  { value: 'created', label: 'Criado' },
  { value: 'sent', label: 'Enviado' },
  { value: 'received', label: 'Recebido' },
];

const UpdateNegotiationDialog: React.FC<
  UpdateNegotiationDialogProps & DialogProps
> = ({ title, subTitle, setOpen, negotiationToUpdate, ...rest }) => {
  const { id, associateId, description, price, status } = negotiationToUpdate;

  const { control, handleSubmit, setValue } = useForm<Omit<Negotiation, 'id'>>({
    resolver: yupResolver(schema),
  });

  const { updateNegotiation } = useNegotiations();

  const handleConfirmAction = ({
    status,
    description,
    price,
    associateId,
  }: Omit<Negotiation, 'id'>) => {
    updateNegotiation({
      id,
      status,
      description,
      price,
      associateId,
    });

    toast.success('Torneiro adicionado com sucesso');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue('description', description);
    setValue('associateId', associateId);
    setValue('price', price);
    setValue('status', status);
  }, [negotiationToUpdate]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Grid container spacing={2} sx={{ width: '100%', marginTop: 1 }}>
          <Grid item xs={12}>
            <ControlledTextField
              name="description"
              control={control}
              textFieldProps={{
                fullWidth: true,
                variant: 'outlined',
                size: 'small',
                label: 'Descrição',
                multiline: true,
                rows: 3,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="price"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: '',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              name="status"
              control={control}
              textFieldProps={{
                select: true,
                fullWidth: true,
                variant: 'outlined',
                size: 'small',
                label: 'Telefone',
                children: negotiationStatusValues.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                )),
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

export default UpdateNegotiationDialog;
