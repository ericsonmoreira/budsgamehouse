import {
  Avatar,
  AvatarProps,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import routesNames from "../../routes/routesNames";
import usePlayer from "../../hooks/usePlayer";

type AvatarPlayerProps = {
  playerId: string;
};

function stringToColor(string: string) {
  let hash = 0;
  let i: number;

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
    children: name[0],
  };
}

function AvatarPlayer({
  playerId,
  sx: originalSx,
  ...rest
}: AvatarPlayerProps & AvatarProps) {
  const { data: player, isLoading, isError } = usePlayer(playerId);

  const navigate = useNavigate();

  if (isLoading || isError) {
    return null;
  }

  if (!player) {
    return null;
  }

  if (!player.name) {
    return (
      <Tooltip title="Desconhecido">
        <IconButton
          onClick={() =>
            navigate(routesNames.VIEW_PLAYER.replace(":id", player.id))
          }
        >
          <Avatar sx={originalSx} {...rest}>
            <Typography variant="inherit">?</Typography>
          </Avatar>
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={player.name}>
      <IconButton
        onClick={() =>
          navigate(routesNames.VIEW_PLAYER.replace(":id", player.id))
        }
      >
        {player.avatarImgUrl ? (
          <Avatar
            sx={{ ...originalSx, ...stringAvatar(player.name).sx }}
            {...rest}
            src={player.avatarImgUrl}
          />
        ) : (
          <Avatar
            sx={{ ...originalSx, ...stringAvatar(player.name).sx }}
            {...rest}
            src={player.avatarImgUrl}
          >
            <Typography variant="inherit" sx={{ fontSize: 10 }}>
              {stringAvatar(player.name).children}
            </Typography>
          </Avatar>
        )}
      </IconButton>
    </Tooltip>
  );
}

export default AvatarPlayer;
