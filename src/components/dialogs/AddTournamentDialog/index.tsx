import { yupResolver } from '@hookform/resolvers/yup';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Grid,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useTournaments from '../../../hooks/useTournaments';
import AutocompletePlayers from '../../AutocompletePlayers';
import AvatarPlayer from '../../AvatarPlayer';
import ControlledTextField from '../../textfields/ControlledTextField';
import schema from './schema ';

type AddTournamentDialogProps = {
  title: string;
  subTitle: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type AddTournamentDialogFormData = {
  name: string;
  format: TournamentFormat;
  rounds: number;
};

const formatValues = [
  {
    value: 'pioneer',
    label: 'Pioneer',
  },
  {
    value: 'selado',
    label: 'Selado',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

const AddTournamentDialog: React.FC<AddTournamentDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  ...rest
}) => {
  const { control, handleSubmit } = useForm<AddTournamentDialogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      format: formatValues[0].value as TournamentFormat,
      rounds: 1,
      name: '',
    },
  });

  const { addTournament } = useTournaments();

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const handleConfirmAction = async ({
    name,
    format,
    rounds,
  }: AddTournamentDialogFormData) => {
    addTournament({
      name,
      data: JSON.stringify({
        players: selectedPlayers,
        rounds,
        name,
        format,
        ratings: [],
      }),
      format,
      rounds: Number(rounds),
      state: 'not-started',
    });

    toast.success('Torneiro adicionado com sucesso');

    setOpen(false);
  };

  const handleCancelAction = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <form onSubmit={handleSubmit(handleConfirmAction)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{subTitle}</DialogContentText>
          <Grid container spacing={2} sx={{ width: '100%', marginTop: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body1">Informações do Torneio</Typography>
            </Grid>
            <Grid item xs={12}>
              <ControlledTextField
                name="name"
                control={control}
                textFieldProps={{
                  variant: 'outlined',
                  size: 'small',
                  label: 'Nome',
                  fullWidth: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledTextField
                name="format"
                control={control}
                textFieldProps={{
                  variant: 'outlined',
                  size: 'small',
                  label: 'Formato',
                  fullWidth: true,
                  select: true,
                  children: formatValues.map(({ value, label }) => (
                    <MenuItem key={label} value={value}>
                      {label}
                    </MenuItem>
                  )),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledTextField
                name="rounds"
                control={control}
                textFieldProps={{
                  type: 'number',
                  variant: 'outlined',
                  size: 'small',
                  label: 'Rounds',
                  fullWidth: true,
                  inputProps: {
                    min: 1,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ width: '100%', marginTop: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body1">Jogadores</Typography>
            </Grid>
            <Grid item xs={12}>
              <AutocompletePlayers
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body1">Jogadores selecionados</Typography>
                <Typography variant="body1">
                  Total: {selectedPlayers.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'inline-block', alignItems: 'center' }}>
                {selectedPlayers.map(({ id, name, email, avatarImgUrl }) => (
                  <Chip
                    key={id}
                    variant="outlined"
                    label={name}
                    avatar={
                      <AvatarPlayer
                        player={{ id, name, email, avatarImgUrl }}
                      />
                    }
                    onDelete={() => {
                      setSelectedPlayers((old) =>
                        old.filter((player) => player.id !== id)
                      );
                    }}
                    deleteIcon={<PersonRemoveIcon />}
                    sx={{ marginRight: 1, marginBottom: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
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
          <Button type="submit">Confirmar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTournamentDialog;
