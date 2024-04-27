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
  Grid,
  MenuItem,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useCommands from '../../../../hooks/useCommands';
import { CardsClubIcon, CardsDiamondIcon, CardsHeartIcon, CardsSpadeIcon } from '../../../../icons';
import addCommand from '../../../../resources/commands/addCommand';
import { auth } from '../../../../services/firebaseConfig';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema';

const cardNumbers = ['A', 'J', 'Q', 'K'];

const cardSuities = ['club', 'diamond', 'heart', 'spade'];

const cardsSuitiesMap: Record<'club' | 'diamond' | 'heart' | 'spade', React.FC<SvgIconProps>> = {
  club: CardsClubIcon,
  diamond: CardsDiamondIcon,
  heart: CardsHeartIcon,
  spade: CardsSpadeIcon,
};

type AddCommandDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddCommandDialogFormData = {
  name: string;
};

const AddCommandDialog: React.FC<AddCommandDialogProps & DialogProps> = ({ title, subTitle, setOpen, ...rest }) => {
  const queryClient = useQueryClient();

  const { data: commands } = useCommands('open');

  const [user] = useAuthState(auth);

  const possibleCommandsNames = useMemo(() => {
    const names = [];

    for (const suite of cardSuities) {
      for (const num of cardNumbers) {
        names.push(`${num}|${suite}`);
      }
    }

    if (commands) {
      return names.filter((name) => !commands.some((command) => command.name === name));
    } else {
      return names;
    }
  }, [commands]);

  const { handleSubmit, reset, control } = useForm<AddCommandDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const { mutate: addCommandMutate, isPending: addCommandMutateIsloading } = useMutation({
    mutationFn: async ({ name }: AddCommandDialogFormData) => {
      if (user) {
        await addCommand({
          createdAt: Date.now(),
          name,
          products: [],
          status: 'open',
          userId: user.uid,
        });

        await queryClient.invalidateQueries({ queryKey: ['useCommands', 'open'] });
      } else {
        throw new Error('Usuário não autenticado');
      }
    },
    onSuccess: () => {
      handleClose();

      toast.success('Comanda adicionado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = ({ name }: AddCommandDialogFormData) => {
    addCommandMutate({ name });
  };

  const handleClose = () => {
    reset({
      name: possibleCommandsNames[0],
    });

    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextField
              name="name"
              control={control}
              defaultValue={possibleCommandsNames[0]}
              variant="outlined"
              label="Comanda"
              size="small"
              fullWidth
              select
            >
              {possibleCommandsNames.map((commandName) => {
                const [num, suite] = commandName.split('|');

                const IconComponent = cardsSuitiesMap[suite as 'club' | 'diamond' | 'heart' | 'spade'];

                return (
                  <MenuItem key={commandName} value={commandName}>
                    <Stack direction="row" spacing={1}>
                      <Typography>{num}</Typography>
                      <IconComponent />
                    </Stack>
                  </MenuItem>
                );
              })}
            </ControlledTextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={addCommandMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default AddCommandDialog;
