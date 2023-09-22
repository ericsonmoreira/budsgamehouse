import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useWantedCards from '../../../../hooks/useWantedCards';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema ';

const priorityMapValues: { value: WantedCardPriority; label: string }[] = [
  { value: 'high', label: 'Alto' },
  { value: 'medium', label: 'Médio' },
  { value: 'low', label: 'Baixo' },
];

export type WantedCardUpdateData = {
  id: string;
  name: string;
  imgUrl: string;
  amount: string;
  priority: WantedCardPriority;
};

type UpdateWantedCardDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tradingCardToUpdate: WantedCardUpdateData;
};

type UpdateWantedCardDialogFormData = {
  name: string;
  imgUrl: string;
  amount: string;
  priority: WantedCardPriority;
};

const UpdateWantedCardDialog: React.FC<UpdateWantedCardDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  tradingCardToUpdate,
  ...rest
}) => {
  const { id, name, imgUrl, amount, priority } = tradingCardToUpdate;

  const { updateWantedCard } = useWantedCards();

  const { control, handleSubmit, setValue } = useForm<UpdateWantedCardDialogFormData>({
    resolver: yupResolver(schema),
  });

  const handleConfirmAction = ({ name, amount, imgUrl, priority }: UpdateWantedCardDialogFormData) => {
    updateWantedCard({ id, name, amount: Number(amount), imgUrl, priority });

    toast.success('Card Atualizado com sucesso!');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue('name', name);
    setValue('amount', amount);
    setValue('imgUrl', imgUrl);
    setValue('priority', priority);
  }, [tradingCardToUpdate]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Box
          sx={{
            display: 'flex',
            marginTop: 2,
          }}
        >
          <img src={imgUrl} alt={name} style={{ width: 150 }} />
          <Stack
            spacing={2}
            sx={{
              display: 'flex',
              flex: 1,
              marginLeft: 2,
            }}
          >
            <ControlledTextField
              name="name"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Nome',
                disabled: true,
              }}
            />
            <ControlledTextField
              name="amount"
              control={control}
              textFieldProps={{
                variant: 'outlined',
                size: 'small',
                label: 'Quantidade',
                type: 'number',
                InputProps: { inputProps: { min: 1 } },
              }}
            />
            <ControlledTextField
              name="priority"
              control={control}
              textFieldProps={{
                select: true,
                children: priorityMapValues.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                )),
                variant: 'outlined',
                size: 'small',
                label: 'Prioridade',
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" disableElevation onClick={handleCancelAction}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateWantedCardDialog;
