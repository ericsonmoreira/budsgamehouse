import { Box, Chip, Stack, SvgIconProps, Typography } from '@mui/material';
import React from 'react';
import { CardsClubIcon, CardsDiamondIcon, CardsHeartIcon, CardsSpadeIcon } from '../../icons';

type CommandTitleName = {
  command: Command;
};

const cardsSuitiesMap: Record<'club' | 'diamond' | 'heart' | 'spade', React.FC<SvgIconProps>> = {
  club: CardsClubIcon,
  diamond: CardsDiamondIcon,
  heart: CardsHeartIcon,
  spade: CardsSpadeIcon,
};

const cardsStatusMap: Record<'open' | 'closed' | 'canceled', React.FC> = {
  open: () => <Chip label="ABERTA" color="success" />,
  closed: () => <Chip label="FECHADA" color="error" />,
  canceled: () => <Chip label="CANCELADA" color="warning" />,
};

const CommandTitleName: React.FC<CommandTitleName> = ({ command }) => {
  const [num, suite] = command.name.split('|');

  const IconComponent = cardsSuitiesMap[suite as 'club' | 'diamond' | 'heart' | 'spade'];

  const StatusComponent = cardsStatusMap[command.status];

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
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: palette.common.black,
        })}
      >
        <Typography variant="h5" color="black">
          {num}
        </Typography>
        <IconComponent fontSize="medium" />
      </Stack>
      <StatusComponent />
    </Box>
  );
};

export default CommandTitleName;
