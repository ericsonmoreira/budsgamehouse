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
import usePlayers from '../../../hooks/usePlayers';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type AddPlayerDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddPlayerDialogFormData = {
  name: string;
  email: string;
};

const AddPlayerDialog: React.FC<AddPlayerDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { control, handleSubmit } = useForm<AddPlayerDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const { addPlayer } = usePlayers();

  const handleConfirmAction = ({ name, email }: AddPlayerDialogFormData) => {
    addPlayer({ name, email });

    toast.success('Player adicionado com sucesso!');

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
          <ControlledTextField
            name="email"
            control={control}
            textFieldProps={{
              variant: 'outlined',
              size: 'small',
              label: 'Email',
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

export default AddPlayerDialog;
