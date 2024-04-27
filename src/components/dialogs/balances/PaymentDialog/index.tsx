import { zodResolver } from '@hookform/resolvers/zod';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import addPayment from '../../../../resources/payments/addPayment';
import updatePlayer from '../../../../resources/players/updatePlayer';
import { auth } from '../../../../services/firebaseConfig';
import AvatarPlayer from '../../../AvatarPlayer';
import TypographyBalance from '../../../TypographyBalance';
import ControlledCurrencyTextField from '../../../textfields/ControlledCurrencyTextField';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema ';

type PaymentDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: Player;
} & DialogProps;

type PaymentDialogFormData = {
  paymentValue: number;
  description: string;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ title, subTitle, playerToUpdate, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const { control, handleSubmit, watch, reset } = useForm<PaymentDialogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentValue: 0,
      description: '',
    },
  });

  const paymentValueWatch = watch('paymentValue');

  const handleClose = () => {
    setOpen(false);

    reset({
      paymentValue: 0,
      description: '',
    });
  };

  const { mutate: paymentMutate, isPending: paymentMutateIsloading } = useMutation({
    mutationFn: async ({ paymentValue, description }: PaymentDialogFormData) => {
      if (user) {
        await updatePlayer({ ...playerToUpdate, balance: playerToUpdate.balance + paymentValue });

        await addPayment({
          previousPlayerBalance: playerToUpdate.balance,
          currentPlayerBalance: playerToUpdate.balance + paymentValue,
          value: paymentValue,
          description,
          createdAt: Timestamp.now(),
          playerId: playerToUpdate.id,
          userId: user.uid,
        });

        await queryClient.invalidateQueries({ queryKey: ['usePlayers'] });

        await queryClient.invalidateQueries({ queryKey: ['usePlayer', playerToUpdate.id] });

        await queryClient.invalidateQueries({ queryKey: ['usePayments'] });

        await queryClient.invalidateQueries({ queryKey: ['usePaymentsFromPlayer', playerToUpdate.id] });
      } else {
        throw new Error('Usuário não autenticado');
      }
    },
    onSuccess: () => {
      handleClose();

      toast.success('Pagamento efetuado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirm = (data: PaymentDialogFormData) => {
    paymentMutate(data);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarPlayer playerId={playerToUpdate.id} />
              <Typography variant="h4">{playerToUpdate.name}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8} display="flex" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <TypographyBalance variant="h5" balance={playerToUpdate.balance} />
              <ArrowForwardIcon fontSize="large" />
              <TypographyBalance variant="h5" balance={paymentValueWatch} />
              <TypographyBalance variant="h5" balance={playerToUpdate.balance + Number(paymentValueWatch)} />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <ControlledCurrencyTextField
              control={control}
              name="paymentValue"
              fullWidth
              label="Valor do Pagamento"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextField
              control={control}
              multiline
              minRows={3}
              name="description"
              fullWidth
              label="Descrição"
              placeholder="Descreva aqui o seu pagamento..."
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirm)}>Confirmar</Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={paymentMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default PaymentDialog;
