import { Autocomplete, Box, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

type PlayerWithPriority = {
  priority: number;
} & Player;

type AutocompletePlayersProps = {
  selectedPlayer: Player | null;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  validPlayers: Player[];
  disabled?: boolean;
  textFieldProps?: TextFieldProps;
};

const AutocompletePlayers: React.FC<AutocompletePlayersProps> = ({
  selectedPlayer,
  setSelectedPlayer,
  validPlayers,
  disabled = false,
  textFieldProps,
}) => {
  const [validPlayersWithPriority, setValidPlayersWithPriority] = useState<PlayerWithPriority[]>(
    () => validPlayers?.map((player) => ({ ...player, priority: 0 })) || []
  );

  const validPlayersSorted = useMemo<Player[]>(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      validPlayersWithPriority.sort((a, b) => b.priority - a.priority).map(({ priority, ...rest }) => ({ ...rest })),
    [validPlayersWithPriority]
  );

  return (
    <Stack direction="row" spacing={1} width={1}>
      <Autocomplete
        disabled={disabled}
        value={selectedPlayer}
        options={validPlayersSorted}
        onChange={(_, newValue) => {
          setSelectedPlayer(newValue);

          if (newValue) {
            setValidPlayersWithPriority((old) => {
              const selectedPlayerIndex = old.findIndex((item) => item.id === newValue.id);

              if (selectedPlayerIndex !== -1) {
                old[selectedPlayerIndex].priority = old[selectedPlayerIndex].priority + 1;
              }

              return [...old];
            });
          }
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
        renderInput={(params) => <TextField {...params} ref={null} size="small" label="Player" {...textFieldProps} />}
      />
    </Stack>
  );
};

export default AutocompletePlayers;
