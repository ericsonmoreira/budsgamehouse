import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import useTournaments from "../../hooks/useTournaments";

type TournamentViewParams = {
  id: string;
};

const TournamentView: React.FC = () => {
  const { id } = useParams<TournamentViewParams>();

  const { findTournament } = useTournaments();

  const { data: tournament, isLoading } = findTournament(id);

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Torneio</Typography>
      </Box>
      <Typography>Nome: {tournament?.name}</Typography>
      <Typography>Formato: {tournament?.format}</Typography>
      <Typography>Rodadas: {tournament?.rounds}</Typography>
      <Typography>Status: {tournament?.state}</Typography>
    </>
  );
};

export default TournamentView;
