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

type PaymentDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: Player;
} & DialogProps;

type PaymentDialogFormData = {
  paymentValue: number;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ title, subTitle, playerToUpdate, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, reset } = useForm<PaymentDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentValue: 0,
    },
  });

  const paymentValueWatch = watch('paymentValue');

  const handleClose = () => {
    setOpen(false);

    reset({
      paymentValue: 0,
    });
  };

  const { mutate: paymentMutate, isLoading: paymentMutateIsloading } = useMutation({
    mutationFn: async ({ paymentValue }: PaymentDialogFormData) => {
      await updatePlayer({ ...playerToUpdate, balance: playerToUpdate.balance + paymentValue });

      await queryClient.invalidateQueries(['usePlayers']);

      await queryClient.invalidateQueries(['usePlayer', playerToUpdate.id]);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Pagamento efetuado com sucesso');
    },
    onError: () => {
      toast.error('Algo de errado aconteceu');
    },
  });

  const handleConfirm = (data: PaymentDialogFormData) => {
    paymentMutate(data);
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Box my={2} display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <AvatarPlayer player={playerToUpdate} />
            <Typography variant="h4">{playerToUpdate.name}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TypographyBalance variant="h4" balance={playerToUpdate.balance} />
            <ArrowForwardIcon fontSize="large" />
            <TypographyBalance variant="h4" balance={playerToUpdate.balance + paymentValueWatch} />
          </Stack>
        </Box>
        <ControlledCurrencyTextField
          control={control}
          name="paymentValue"
          fullWidth
          label="Valor do Pagamento"
          size="small"
        />
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
