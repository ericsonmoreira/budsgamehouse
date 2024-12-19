import {
  Box,
  Chip,
  Stack,
  SvgIconProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { differenceInHours } from "date-fns";
import {
  CardsClubIcon,
  CardsDiamondIcon,
  CardsHeartIcon,
  CardsSpadeIcon,
  WarningIcon,
} from "../../../icons";

type CommandTitleName = {
  command: Command;
};

const cardsSuitiesMap: Record<
  "club" | "diamond" | "heart" | "spade",
  React.FC<SvgIconProps>
> = {
  club: CardsClubIcon,
  diamond: CardsDiamondIcon,
  heart: CardsHeartIcon,
  spade: CardsSpadeIcon,
};

const cardsStatusMap: Record<"open" | "closed" | "canceled", React.FC> = {
  open: () => <Chip label="ABERTA" color="success" />,
  closed: () => <Chip label="FECHADA" color="error" />,
  canceled: () => <Chip label="CANCELADA" color="warning" />,
};

function CommandTitleName({ command }: CommandTitleName) {
  const [num, suite] = command.name.split("|");

  const IconComponent =
    cardsSuitiesMap[suite as "club" | "diamond" | "heart" | "spade"];

  const StatusComponent = cardsStatusMap[command.status];

  // verifica se a comanda está aberta a mais de 24 horas
  const checkDelay = (command: Command): boolean => {
    const now = new Date();

    const createdAtDate = new Date(Number(command.createdAt.toString()));

    return (
      command.status === "open" && differenceInHours(now, createdAtDate) > 24
    );
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Stack
        display="flex"
        alignItems="center"
        p={1}
        direction="row"
        spacing={2}
        sx={({ palette, spacing }) => ({
          backgroundColor: palette.common.white,
          borderRadius: spacing(0.5),
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: palette.common.black,
        })}
      >
        <Typography variant="h5" color="black">
          {num}
        </Typography>
        <IconComponent fontSize="medium" />
      </Stack>
      <Stack direction="row" spacing={1}>
        <StatusComponent />
        {checkDelay(command) && (
          <Tooltip title="Comanda Aberta a mais de 24 horas">
            <WarningIcon fontSize="large" color="warning" />
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}

export default CommandTitleName;
