import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import DataGridTournaments from '../../components/datagrids/DataGridTournaments';
import AddTournamentDialog from '../../components/dialogs/AddTournamentDialog';
import ConfirmActionDialog from '../../components/dialogs/ConfirmActionDialog';
import UpdateTournamentDialog, {
  UpdateTournamentDialogFormData,
} from '../../components/dialogs/UpdateTournamentDialog';
import useTournaments from '../../hooks/useTournaments';

const Tournaments: React.FC = () => {
  const [addTournamentDialogOpen, setAddTournamentDialogOpen] = useState(false);

  const [updateTournamentDialogOpen, setUpdateTournamentDialogOpen] =
    useState(false);

  const [tournamentToDeleteId, setTournamentToDeleteId] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { tournaments, deleteTournament, isLoading } = useTournaments();

  const [tournamentToUpdate, setTournamentToUpdate] =
    useState<UpdateTournamentDialogFormData>({
      id: '',
      name: '',
      format: 'pioneer',
      rounds: 0,
      selectedPlayers: [],
    });

  const handleUpdate = ({
    id,
    name,
    format,
    rounds,
    selectedPlayers,
  }: UpdateTournamentDialogFormData) => {
    setTournamentToUpdate({ id, name, format, rounds, selectedPlayers });
    setUpdateTournamentDialogOpen(true);
  };

  const handledelete = (id: string) => {
    setTournamentToDeleteId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Torneiros
        </Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddTournamentDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridTournaments
          loading={isLoading}
          rows={tournaments?.map(({ id, format, name, rounds, state }) => ({
            id,
            format,
            name,
            rounds,
            state,
            actions: {
              handleUpdate: () =>
                handleUpdate({
                  id,
                  format,
                  name,
                  rounds,
                  selectedPlayers: [],
                }),
              handledelete: () => handledelete(id),
            },
          }))}
        />
      </Box>
      <AddTournamentDialog
        title="Adicionar um Torneio"
        subTitle="Crie um novo campeonato e cadastre seus Jogadores"
        open={addTournamentDialogOpen}
        setOpen={setAddTournamentDialogOpen}
        onClose={() => setAddTournamentDialogOpen(false)}
      />
      <UpdateTournamentDialog
        title="Update Torneiro"
        subTitle="Atualize aqui o Evento"
        open={updateTournamentDialogOpen}
        setOpen={setUpdateTournamentDialogOpen}
        onClose={() => setUpdateTournamentDialogOpen(false)}
        tournamentToUpdate={tournamentToUpdate}
      />
      <ConfirmActionDialog
        title="Remover Torneiro"
        subTitle="Deseja realmente remover esse Evento"
        confirmationMesage="Torneiro removido com sucessor"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        handleConfirmAction={() => deleteTournament(tournamentToDeleteId)}
      />
    </>
  );
};

export default Tournaments;
