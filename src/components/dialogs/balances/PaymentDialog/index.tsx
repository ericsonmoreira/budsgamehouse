import { yupResolver } from '@hookform/resolvers/yup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
  Grid,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import updatePlayer from '../../../../resources/players/updatePlayer';
import AvatarPlayer from '../../../AvatarPlayer';
import TypographyBalance from '../../../Typography';
import ControlledCurrencyTextField from '../../../textfields/ControlledCurrencyTextField';
import schema from './schema ';
import addPayment from '../../../../resources/payments/addPayment';
import ControlledTextField from '../../../textfields/ControlledTextField';
import { Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../services/firebaseConfig';

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
    resolver: yupResolver(schema),
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

  const { mutate: paymentMutate, isLoading: paymentMutateIsloading } = useMutation({
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

        await queryClient.invalidateQueries(['usePlayers']);

        await queryClient.invalidateQueries(['usePlayer', playerToUpdate.id]);

        await queryClient.invalidateQueries(['usePayments']);

        await queryClient.invalidateQueries(['usePaymentsFromPlayer', playerToUpdate.id]);
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
    <Dialog fullWidth maxWidth="md" {...rest} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Box my={2} display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <AvatarPlayer playerId={playerToUpdate.id} />
            <Typography variant="h4">{playerToUpdate.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TypographyBalance variant="h4" balance={playerToUpdate.balance} />
            <ArrowForwardIcon fontSize="large" />
            <TypographyBalance variant="h4" balance={playerToUpdate.balance + paymentValueWatch} />
          </Stack>
        </Box>
        <Grid container spacing={2}>
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
