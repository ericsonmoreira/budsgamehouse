import { Chip, Box } from '@mui/material';

export type TournamentInfosProps = {
  tournament: Tournament;
};

const stateNameMap: { [T in TournamentState]: string } = {
  'not-started': 'Não iniciado',
  started: 'Iniciado',
  finished: 'Finalizado',
};

const TournamentInfos: React.FC<TournamentInfosProps> = ({ tournament }) => {
  const { format, rounds, state } = tournament;

  return (
    <Box>
      <Chip label={format.toUpperCase()} sx={{ marginRight: 1 }} />
      <Chip label={`Rodadas: ${String(rounds)}`} sx={{ marginRight: 1 }} />
      <Chip label={stateNameMap[state]} sx={{ marginRight: 1 }} />
    </Box>
  );
};

export default TournamentInfos;
