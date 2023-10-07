import { Box, Typography } from '@mui/material';
import AvatarPlayer from '../AvatarPlayer';

type AutocompletePlayersOptionProps = {
  player: Player;
};

const AutocompletePlayersOption: React.FC<AutocompletePlayersOptionProps> = ({ player, ...rest }) => {
  return (
    <Box component="li" {...rest}>
      <AvatarPlayer playerId={player.id} sx={{ width: 24, height: 24, marginRight: 1 }} />
      <Typography>{player.name}</Typography>
    </Box>
  );
};

export default AutocompletePlayersOption;
