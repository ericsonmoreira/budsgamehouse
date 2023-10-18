import { yupResolver } from '@hookform/resolvers/yup';
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
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import addPlayer from '../../../../resources/players/addPlayer';
import uploadImageInStorage from '../../../../resources/uploadImageInStorage';
import ImageDropZone from '../../../ImageDropZone';
import ControlledTextField from '../../../textfields/ControlledTextField';
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

const AddPlayerDialog: React.FC<AddPlayerDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<AddPlayerDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const [file, setFile] = useState<File | null>();

  const { mutate: addPlayerMutate, isLoading: addPlayerIsLoading } = useMutation({
    mutationFn: async ({ name, email }: AddPlayerDialogFormData) => {
      if (file) {
        const avatarImgUrl = await uploadImageInStorage(file);

        await addPlayer({ name, balance: 0, email, avatarImgUrl });
      } else {
        await addPlayer({ name, balance: 0, email });
      }

      await queryClient.invalidateQueries(['usePlayers']);
    },
    onSuccess: () => {
      handleClose();

      toast.success('Produto adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = (data: AddPlayerDialogFormData) => {
    addPlayerMutate(data);
  };

  const handleClose = () => {
    reset({
      email: '',
      name: '',
    });

    setFile(null);

    setOpen(false);
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
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
          <ImageDropZone file={file} setFile={setFile} />
          <ControlledTextField name="name" control={control} variant="outlined" size="small" label="Nome" />
          <ControlledTextField name="email" control={control} variant="outlined" size="small" label="Email" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit(handleConfirmAction)}>Confirmar</Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={addPlayerIsLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddPlayerDialog;
