import { yupResolver } from '@hookform/resolvers/yup';
import {
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
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAssociates from '../../../hooks/useAssociates';
import useNegotiations from '../../../hooks/useNegotiations';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type AddNegotiationDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const negotiationStatusValues: { value: NegotiationStatus; label: string }[] = [
  { value: 'created', label: 'Criado' },
  { value: 'sent', label: 'Enviado' },
  { value: 'received', label: 'Recebido' },
];

const AddNegotiationDialog: React.FC<
  AddNegotiationDialogProps & DialogProps
> = ({ title, subTitle, setOpen, ...rest }) => {
  const { control, handleSubmit } = useForm<Omit<Negotiation, 'id'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      associateId: '',
      description: '',
      price: 0,
      status: 'created',
    },
  });

  const { addNegotiation } = useNegotiations();

  const { associates } = useAssociates();

  const handleConfirmAction = ({
    associateId,
    description,
    price,
    status,
  }: Omit<Negotiation, 'id'>) => {
    addNegotiation({ associateId, description, price, status });

    toast.success('Associado adicionado com sucesso!');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            flex: 1,
            marginTop: 1,
          }}
        >
          <ControlledTextField
            name="description"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Descrição',
              multiline: true,
              rows: 3,
            }}
          />
          <ControlledTextField
            name="status"
            control={control}
            textFieldProps={{
              select: true,
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
          <ControlledTextField
            name="associateId"
            control={control}
            textFieldProps={{
              select: true,
              variant: 'outlined',
              size: 'small',
              label: 'Asssociado',
              children: associates?.map(({ id, name }) => (
                <MenuItem key={id} value={name}>
                  {name}
                </MenuItem>
              )),
            }}
          />
          <ControlledTextField
            name="price"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Preço',
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelAction}>Cancelar</Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNegotiationDialog;
