import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAssociates from '../../../hooks/useAssociates';
import ControlledPhoneTextField from '../../textfields/ControlledPhoneTextField';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type AddAssociateDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddAssociateDialog: React.FC<AddAssociateDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { control, handleSubmit } = useForm<Omit<Associate, 'id'>>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const { addAssociate } = useAssociates();

  const handleConfirmAction = ({ name, phone }: Omit<Associate, 'id'>) => {
    addAssociate({ name, phone });

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
            name="name"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Nome',
            }}
          />
          <ControlledPhoneTextField
            name="phone"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Telefone',
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

export default AddAssociateDialog;

