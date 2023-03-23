import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Autocomplete, Box, IconButton, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import usePlayers from '../../hooks/usePlayers';
import AutocompletePlayersOption from '../AutocompletePlayersOption';

type AutocompletePlayersProps = {
  selectedPlayers: Player[];
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

const AutocompletePlayers: React.FC<AutocompletePlayersProps> = ({
  selectedPlayers,
  setSelectedPlayers,
}) => {
  const [autocompleteInputValue, setAutocompleteInputValue] =
    useState<string>('');

  const [activePlayer, setActivePlayer] = useState<Player | null>();

  const { players } = usePlayers();

  const selectablePlayers = useMemo<Player[]>(() => {
    if (!players) return [];

    return players.filter((player) => !selectedPlayers.includes(player));
  }, [selectedPlayers, players]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Autocomplete
        options={selectablePlayers}
        value={activePlayer || null}
        onChange={(_, newValue) => setActivePlayer(newValue)}
        inputValue={autocompleteInputValue}
        onInputChange={(_, newValue) => setAutocompleteInputValue(newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} ref={null} size="small" label="Jogadores" />
        )}
        renderOption={(renderOptionProps, player: Player) => (
          <AutocompletePlayersOption player={player} {...renderOptionProps} />
        )}
      />
      <IconButton
        disabled={!activePlayer}
        onClick={() => {
          setSelectedPlayers((old) => [...old, activePlayer as Player]);
          setActivePlayer(null);
          setAutocompleteInputValue('');
        }}
        sx={{ marginLeft: 1 }}
        color="secondary"
      >
        <PersonAddIcon />
      </IconButton>
    </Box>
  );
};

export default AutocompletePlayers;
