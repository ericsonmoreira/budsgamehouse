import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

type PriorityPlayers = Record<string, number>;

type AutocompletePlayersProps = {
  selectedPlayer: Player | null;
  setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  validPlayers: Player[];
  disabled?: boolean;
  textFieldProps?: TextFieldProps;
};

function AutocompletePlayers({
  selectedPlayer,
  setSelectedPlayer,
  validPlayers,
  disabled = false,
  textFieldProps,
}: AutocompletePlayersProps) {
  const [priorityPlayers, setPriorityPlayers] = useState<PriorityPlayers>(
    () => {
      return validPlayers.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {});
    },
  );

  const validPlayersSortedPriority = useMemo<Player[]>(() => {
    return validPlayers
      .map((player) => ({ ...player, priority: priorityPlayers[player.id] }))
      .sort((a, b) => b.priority - a.priority);
  }, [validPlayers, priorityPlayers]);

  return (
    <Stack direction="row" spacing={1} width={1}>
      <Autocomplete
        disabled={disabled}
        value={selectedPlayer}
        options={validPlayersSortedPriority}
        onChange={(_, newValue) => {
          setSelectedPlayer(newValue);

          if (newValue) {
            setPriorityPlayers((old) => ({
              ...old,
              [newValue.id]: old[newValue.id] + 1,
            }));
          }
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.avatarImgUrl && (
              <img
                alt="avatar-image"
                src={option.avatarImgUrl}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  marginRight: 4,
                }}
              />
            )}
            <Typography flexGrow={1}>{option.name}</Typography>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            ref={null}
            size="small"
            label="Player"
            {...textFieldProps}
          />
        )}
      />
    </Stack>
  );
}

export default AutocompletePlayers;
