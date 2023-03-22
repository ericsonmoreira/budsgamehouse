import { Avatar, AvatarProps, Tooltip, Typography } from '@mui/material';

type AvatarPlayerProps = {
  player: Player;
};

// VIDE: https://mui.com/material-ui/react-avatar/#letter-avatars
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name[0],
  };
}

const AvatarPlayer: React.FC<AvatarPlayerProps & AvatarProps> = ({
  player,
  sx: originalSx,
  ...rest
}) => {
  const { sx, children } = stringAvatar(player.name);

  return (
    <Tooltip title={player.name}>
      {player.avatarImgUrl ? (
        <Avatar
          sx={{ ...originalSx, ...sx }}
          {...rest}
          src={player.avatarImgUrl}
        />
      ) : (
        <Avatar
          sx={{ ...originalSx, ...sx }}
          {...rest}
          src={player.avatarImgUrl}
        >
          <Typography variant="inherit" sx={{ fontSize: 10 }}>
            {children}
          </Typography>
        </Avatar>
      )}
    </Tooltip>
  );
};

export default AvatarPlayer;
