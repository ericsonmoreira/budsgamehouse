import { Avatar, AvatarProps, Typography } from "@mui/material";

type AvatarPlayerProps = {
  name: string;
};

// VIDE: https://mui.com/material-ui/react-avatar/#letter-avatars
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

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
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const AvatarPlayer: React.FC<AvatarPlayerProps & AvatarProps> = ({
  name,
  sx: originalSx,
  ...rest
}) => {
  const { sx, children } = stringAvatar(name);

  return (
    <Avatar sx={{ ...originalSx, ...sx }} {...rest}>
      <Typography variant="inherit" sx={{ fontSize: 10 }}>
        {children}
      </Typography>
    </Avatar>
  );
};

export default AvatarPlayer;
