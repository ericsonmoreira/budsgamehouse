import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';

type AutocompletePlayersProps = {
  selectedPlayer: Player | null;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  validPlayers: Player[];
  disabled?: boolean;
};

const AutocompletePlayers: React.FC<AutocompletePlayersProps> = ({
  selectedPlayer,
  setSelectedPlayer,
  validPlayers,
  disabled = false,
}) => {
  return (
    <Stack direction="row" spacing={1} width={1}>
      <Autocomplete
        disabled={disabled}
        value={selectedPlayer}
        options={validPlayers}
        onChange={(_, newValue) => {
          setSelectedPlayer(newValue);
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.avatarImgUrl && (
              <img src={option.avatarImgUrl} style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 4 }} />
            )}
            <Typography flexGrow={1}>{option.name}</Typography>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderInput={(params) => <TextField {...params} ref={null} size="small" label="Player" />}
      />
    </Stack>
  );
};

export default AutocompletePlayers;
