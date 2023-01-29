import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { PlayerData } from "../../hooks/usePlayers";

type TournamentCardData = {
  id: string;
  name: string;
  format: TournamentFormat;
  rouns: number;
  state: TournamentState;
  players: PlayerData[];
};

export type TournamentCardProps = {
  data: TournamentCardData;
};

type TournamentCardInfoProps = {
  label: string;
  value: string;
};

const TournamentCardInfo = ({ label, value }: TournamentCardInfoProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Typography variant="body1" style={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
};

const TournamentCard: React.FC<TournamentCardProps> = ({ data }) => {
  const { name, format, rouns, state, players } = data;

  const stateNameMap: { [T in TournamentState]: string } = {
    "not-started": "Não iniciado",
    started: "Iniciado",
    finished: "Finalizado",
  };

  if (!data) return null;

  return (
    <Card elevation={0}>
      <CardHeader title={name} />
      <CardContent>
        <Typography variant="h6">Dados do Torneio</Typography>
        <Stack>
          <TournamentCardInfo label="Formato" value={format.toUpperCase()} />
          <TournamentCardInfo label="Rodadas" value={String(rouns)} />
          <TournamentCardInfo label="Estado" value={stateNameMap[state]} />
        </Stack>
        <Typography variant="h6">Jogadores</Typography>
        <Stack>
          {players.map(({ id, name }) => (
            <Typography key={id} variant="body1">
              {name}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
