import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Autocomplete,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import usePlayers, { PlayerData } from "../../hooks/usePlayers";
import useTournaments from "../../hooks/useTournaments";

type TournamentViewParams = {
  id: string;
};

const TournamentView: React.FC = () => {
  const { id } = useParams<TournamentViewParams>();

  const { players } = usePlayers();

  const [activePlayer, setActivePlayer] = useState<PlayerData | null>();

  const [autocompleteInputValue, setAutocompleteInputValue] =
    useState<string>("");

  const [selectedPlayers, setSelectedPlayers] = useState<PlayerData[]>([]);

  const selectablePlayers = useMemo<PlayerData[]>(() => {
    if (!players) return [];

    return players.filter((player) => !selectedPlayers.includes(player));
  }, [selectedPlayers, players]);

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
      <Typography variant="h6">Add Players</Typography>
      <Box sx={{ display: "flex" }}>
        <Autocomplete
          options={selectablePlayers}
          value={activePlayer || null}
          onChange={(_, newValue) => setActivePlayer(newValue)}
          inputValue={autocompleteInputValue}
          onInputChange={(_, newValue) => setAutocompleteInputValue(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} ref={null} size="small" label="Jogadores" />
          )}
          sx={{ width: 500 }}
        />
        <IconButton
          disabled={!activePlayer}
          onClick={() => {
            setSelectedPlayers((old) => [...old, activePlayer as PlayerData]);
            setActivePlayer(null);
            setAutocompleteInputValue("");
          }}
        >
          <PersonAddIcon />
        </IconButton>
      </Box>
      <Stack>
        {selectedPlayers.map(({ id, name }) => (
          <Box key={id} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6">{name}</Typography>
            <IconButton
              onClick={() => {
                setSelectedPlayers((old) =>
                  old.filter((player) => player.id !== id)
                );
              }}
            >
              <PersonRemoveIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default TournamentView;
