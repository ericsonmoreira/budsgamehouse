import usePlayer from "@/hooks/usePlayer";
import routesNames from "@/routes/routesNames";
import { Avatar, AvatarProps, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
        <Avatar
          sx={{ ...originalSx, cursor: "pointer" }}
          onClick={() =>
            navigate(routesNames.VIEW_PLAYER.replace(":id", player.id))
          }
          {...rest}
        >
          <Typography variant="inherit">?</Typography>
        </Avatar>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={player.name}>
      {player.avatarImgUrl ? (
        <Avatar
          sx={{
            ...originalSx,
            ...stringAvatar(player.name).sx,
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(routesNames.VIEW_PLAYER.replace(":id", player.id))
          }
          {...rest}
          src={player.avatarImgUrl}
        />
      ) : (
        <Avatar
          sx={{
            ...originalSx,
            ...stringAvatar(player.name).sx,
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(routesNames.VIEW_PLAYER.replace(":id", player.id))
          }
          {...rest}
          src={player.avatarImgUrl}
        >
          <Typography variant="inherit">
            {stringAvatar(player.name).children}
          </Typography>
        </Avatar>
      )}
    </Tooltip>
  );
}

export default AvatarPlayer;
