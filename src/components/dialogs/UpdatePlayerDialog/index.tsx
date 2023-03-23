import { yupResolver } from '@hookform/resolvers/yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import usePlayers from '../../../hooks/usePlayers';
import { storage } from '../../../services/firebaseConfig';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type UpdatePlayerDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playerToUpdate: Player;
};

type UpdatePlayerDialogFormData = {
  name: string;
  email: string;
  image: File[];
};

const UpdatePlayerDialog: React.FC<UpdatePlayerDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  playerToUpdate,
  ...rest
}) => {
  const { id, name, email } = playerToUpdate;

  const { updatePlayer } = usePlayers();

  const { control, handleSubmit, setValue, register } =
    useForm<UpdatePlayerDialogFormData>({
      resolver: yupResolver(schema),
    });

  const handleConfirmAction = async ({
    name,
    email,
    image,
  }: UpdatePlayerDialogFormData) => {
    if (image) {
      const storageRef = ref(storage, `images/${id}`);

      await uploadBytes(storageRef, image[0]);

      const urlImage = await getDownloadURL(storageRef);

      updatePlayer({ id, name, email, avatarImgUrl: urlImage });
    } else {
      updatePlayer({ id, name, email });
    }

    toast.success('Player atualizado com sucesso!');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue('name', name);
    setValue('email', email);
  }, [playerToUpdate]);

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
            marginY: 2,
          }}
        >
          <Box>
            <IconButton color="primary" component="label">
              <input
                {...register('image')}
                hidden
                accept="image/*"
                type="file"
              />
              <PhotoCamera />
            </IconButton>
          </Box>
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

export default UpdatePlayerDialog;
