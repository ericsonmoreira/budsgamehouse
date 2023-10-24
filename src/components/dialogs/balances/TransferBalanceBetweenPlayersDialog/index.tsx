import { yupResolver } from '@hookform/resolvers/yup';
import ForwardIcon from '@mui/icons-material/Forward';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
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
import { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import usePlayers from '../../../../hooks/usePlayers';
import updatePlayer from '../../../../resources/players/updatePlayer';
import addTransfer from '../../../../resources/transfers/addTransfer';
import { auth } from '../../../../services/firebaseConfig';
import AutocompletePlayers from '../../../AutocompletePlayers';
import AvatarPlayer from '../../../AvatarPlayer';
import TypographyBalance from '../../../TypographyBalance';
import ControlledCurrencyTextField from '../../../textfields/ControlledCurrencyTextField';
import ControlledTextField from '../../../textfields/ControlledTextField';
import schema from './schema';

type TransferBalanceBetweenPlayersDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  senderPlayer: Player;
};

type TransferBalanceBetweenPlayersDialogFormData = {
  value: number;
  description?: string;
};

const defaultValues: TransferBalanceBetweenPlayersDialogFormData = {
  value: 0,
  description: '',
};

const TransferBalanceBetweenPlayersDialog: React.FC<TransferBalanceBetweenPlayersDialogProps & DialogProps> = ({
  title,
  subTitle,
  senderPlayer,
  setOpen,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const { data: players } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { handleSubmit, reset, control, watch } = useForm<TransferBalanceBetweenPlayersDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const valueWatch = watch('value');

  const playersEligibleToReceive = useMemo(() => {
    if (players && senderPlayer) {
      return players.filter((player) => player.id !== senderPlayer.id);
    }

    return [];
  }, [players, senderPlayer]);

  const handleClose = () => {
    setSelectedPlayer(null);

    reset(defaultValues);

    setOpen(false);
  };

  const { mutate: transferMutate, isLoading: transferMutateIsloading } = useMutation({
    mutationFn: async ({ value, description }: TransferBalanceBetweenPlayersDialogFormData) => {
      if (user && selectedPlayer) {
        await addTransfer({
          userId: user.uid,
          sendingPlayerId: senderPlayer.id,
          receiverPlayerId: selectedPlayer.id,
          createdAt: Timestamp.now(),
          value,
          description,
        });

        await updatePlayer({
          ...senderPlayer,
          balance: senderPlayer.balance - value,
        });

        await updatePlayer({
          ...selectedPlayer,
          balance: selectedPlayer.balance + value,
        });

        await queryClient.invalidateQueries(['useTransfers']);

        await queryClient.invalidateQueries(['usePlayers']);

        await queryClient.invalidateQueries(['usePlayer', senderPlayer.id]);

        await queryClient.invalidateQueries(['usePlayer', selectedPlayer.id]);
      } else {
        throw new Error('Usuário não encontrado.');
      }
    },
    onSuccess: () => {
      handleClose();

      toast.success('Transferência realizada com sucesso.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmAction = ({ value, description }: TransferBalanceBetweenPlayersDialogFormData) => {
    transferMutate({ value, description });
  };

  return (
    <Dialog {...rest} fullScreen onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{subTitle}</DialogContentText>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={12}>
            <AutocompletePlayers
              validPlayers={playersEligibleToReceive}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />
          </Grid>
          <Grid item xs={5}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AvatarPlayer playerId={senderPlayer.id} />
                  <Typography variant="h6">{senderPlayer.name}</Typography>
                </Stack>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Saldo Atual
                    </Typography>
                    <TypographyBalance balance={senderPlayer.balance} />
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Saldo Final
                    </Typography>
                    <TypographyBalance balance={senderPlayer.balance - valueWatch} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <ForwardIcon fontSize="large" />
            </Box>
          </Grid>
          <Grid item xs={5}>
            {selectedPlayer && (
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AvatarPlayer playerId={selectedPlayer.id} />
                    <Typography variant="h6">{selectedPlayer.name}</Typography>
                  </Stack>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" variant="caption">
                        Saldo Atual
                      </Typography>
                      <TypographyBalance balance={selectedPlayer.balance} />
                    </Box>
                    <Box>
                      <Typography color="text.secondary" variant="caption">
                        Saldo Final
                      </Typography>
                      <TypographyBalance balance={selectedPlayer.balance + valueWatch} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
          <Grid item xs={12} mt={1}>
            <ControlledCurrencyTextField
              control={control}
              name="value"
              label="Valor da Transferência"
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} mt={1}>
            <ControlledTextField
              control={control}
              name="description"
              multiline
              rows={3}
              label="Descrição"
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit(handleConfirmAction)} disabled={!selectedPlayer}>
          Confirmar
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={transferMutateIsloading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Dialog>
  );
};

export default TransferBalanceBetweenPlayersDialog;
